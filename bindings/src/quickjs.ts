import { writeFileSync } from "fs";
import { CodeGenerator, CodeWriter, FunctionArgument, GenericCodeGenerator } from "./generation"

export type StructLookup = { [struct: string]: string }

export class QuickJsHeader {

    public readonly structLookup: StructLookup = {}
    public readonly moduleFunctionList: QuickJsGenerator
    public readonly structs: QuickJsGenerator
    public readonly functions: QuickJsGenerator
    public readonly moduleInit: QuickJsGenerator
    public readonly moduleEntry: QuickJsGenerator
    public readonly definitions: QuickJsGenerator
    public readonly body: QuickJsGenerator
    public readonly includes: QuickJsGenerator
    private readonly root: QuickJsGenerator

    constructor(private name: string){
        const root = this.root = new QuickJsGenerator()
        const body = this.body = root.header("JS_"+this.name+"_GUARD")
        const includes = this.includes = body.child()
        includes.include("stdio.h")
        includes.include("stdlib.h")
        includes.include("string.h")
        includes.breakLine()
        includes.include("quickjs.h")
        body.breakLine()
        body.line("#ifndef countof")
        body.line("#define countof(x) (sizeof(x) / sizeof((x)[0]))")
        body.line("#endif")
        body.breakLine()   
        this.definitions = body.child()
        body.breakLine()   
        this.structs = body.child()
        this.functions = body.child()
        this.moduleFunctionList = body.jsFunctionList("js_"+name+"_funcs")
        
        const moduleInitFunc = body.function("js_"+this.name+"_init", "int", [{type: "JSContext *", name: "ctx"},{type: "JSModuleDef *", name: "m"}], true)
        const moduleInit = this.moduleInit = moduleInitFunc.child()
        moduleInit.statement(`JS_SetModuleExportList(ctx, m,${this.moduleFunctionList.getTag("_name")},countof(${this.moduleFunctionList.getTag("_name")}))`)
        moduleInitFunc.returnExp("0")
                
        const moduleEntryFunc = body.function("js_init_module_"+this.name, "JSModuleDef *", [{type: "JSContext *", name: "ctx"},{type: "const char *", name: "module_name"}], false)  
        const moduleEntry = this.moduleEntry = moduleEntryFunc.child()
        moduleEntry.statement("JSModuleDef *m")
        moduleEntry.statement(`m = JS_NewCModule(ctx, module_name, ${moduleInitFunc.getTag("_name")})`)
        moduleEntry.statement("if(!m) return NULL")
        moduleEntry.statement(`JS_AddModuleExportList(ctx, m, ${this.moduleFunctionList.getTag("_name")}, countof(${this.moduleFunctionList.getTag("_name")}))`)
        moduleEntryFunc.statement("return m")
    }

    registerStruct(struct: string, classId: string){
        this.structLookup[struct] = classId;
    }

    public writeTo(filename: string){
        const writer = new CodeWriter()
        writer.writeGenerator(this.root)
        writeFileSync(filename, writer.toString())
    }
}

export abstract class GenericQuickJsGenerator<T extends QuickJsGenerator> extends GenericCodeGenerator<T> {

    jsBindingFunction(jsName: string){
        const args = [
            {type: "JSContext *", name: "ctx"},
            {type: "JSValueConst", name: "this_val"},
            {type: "int", name: "argc"},
            {type: "JSValueConst *", name: "argv"},
        ]
        const sub = this.function("js_"+jsName, "JSValue", args, true)
        
        return sub     
    }
    
    jsToC(type: string, name: string, src: string, classIds: StructLookup = {}, suppressDeclaration = false, typeAlias?: string){
        let typeSpecifier = typeAlias ?? type;
        if (typeSpecifier !== undefined) {
            typeSpecifier = typeSpecifier.replace(" *", "*"); // allow specifiers like type * and type* to be the same
        }
        switch (typeSpecifier) {
            // Array Buffer
            case "const void*":
            case "void*":
            case "bool*":
            case "int*":
            case "float*":
            case "float*":
            case "unsigned short*":
            case "unsigned char*":
            case "const unsigned char*":
            case "unsigned int*":
            case "const unsigned int*":
                this.declare(name+"_size", "size_t")
                this.declare(name+"_js", "void *", false, `(void *)JS_GetArrayBuffer(ctx, &${name}_size, ${src})`)
                this.if(name+"_js == NULL").returnExp("JS_EXCEPTION")
                this.declare(name, type, false, "malloc("+name+"_size)")
                this.call("memcpy", ["(void *)"+name, "(const void *)"+name+"_js", name+"_size"])
                break;
            // String
            case "const char*":
            //case "char *":
                if(!suppressDeclaration) this.statement(`${type} ${name} = (JS_IsNull(${src}) || JS_IsUndefined(${src})) ? NULL : (${type})JS_ToCString(ctx, ${src})`)
                else this.statement(`${name} = (JS_IsNull(${src}) || JS_IsUndefined(${src})) ? NULL : (${type})JS_ToCString(ctx, ${src})`)
                break;
            case "double":
                if(!suppressDeclaration) this.statement(`${type} ${name}`)
                this.statement(`JS_ToFloat64(ctx, &${name}, ${src})`)
                break;
            case "float":
                this.statement("double _double_"+name)
                this.statement(`JS_ToFloat64(ctx, &_double_${name}, ${src})`)
                if(!suppressDeclaration) this.statement(`${type} ${name} = (${type})_double_${name}`)
                else this.statement(`${name} = (${type})_double_${name}`)
                break;
            case "int":
                if(!suppressDeclaration) this.statement(`${type} ${name}`)
                this.statement(`JS_ToInt32(ctx, &${name}, ${src})`)
                break;
            case "unsigned int":
                if(!suppressDeclaration) this.statement(`${type} ${name}`)
                this.statement(`JS_ToUint32(ctx, &${name}, ${src})`)
                break;
            case "unsigned char":
                this.statement("unsigned int _int_"+name)
                this.statement(`JS_ToUint32(ctx, &_int_${name}, ${src})`)
                if(!suppressDeclaration) this.statement(`${type} ${name} = (${type})_int_${name}`)
                else this.statement(`${name} = (${type})_int_${name}`)
                break;
            case "bool":
                if(!suppressDeclaration) this.statement(`${type} ${name} = JS_ToBool(ctx, ${src})`)
                else this.statement(`${name} = JS_ToBool(ctx, ${src})`)
                break;
            default:
                const isConst = type.startsWith('const')
                const isPointer = type.endsWith(' *')
                const classId = classIds[type.replace("const ", "").replace(" *", "")]
                if(!classId) {
                    console.error("Type: ", {type, name, src}, " not registered in ClassIds: ", classIds)
                    throw new Error("Cannot convert into parameter type: " + type)
                }
                const suffix = isPointer ? "" : "_ptr"
                this.jsOpqToStructPtr(type.replace(" *", ""), name+suffix, src, classId)
                this.statement(`if(${name+suffix} == NULL) return JS_EXCEPTION`)
                if(!isPointer) this.declare(name, type, false, `*${name}_ptr`)
        }
    }

    jsToJs(type: string, name: string, src: string, classIds: StructLookup = {}){
        switch (type) {
            case "int":
            case "long":
                this.declare(name,'JSValue', false, `JS_NewInt32(ctx, ${src})`)
                break;
            case "long":
                this.declare(name,'JSValue', false, `JS_NewInt64(ctx, ${src})`)
                break;
            case "unsigned int":
            case "unsigned char":
                this.declare(name,'JSValue', false, `JS_NewUint32(ctx, ${src})`)
                break;
            case "bool":
                this.declare(name, 'JSValue', false, `JS_NewBool(ctx, ${src})`)
                break;
            case "float":
            case "double":
                this.declare(name, 'JSValue', false, `JS_NewFloat64(ctx, ${src})`)
                break;
            case "unsigned char *":
            case "const char *":
            case "char *":
                this.declare(name, 'JSValue', false, `JS_NewString(ctx, ${src})`)
                break;
            case "unsigned int *":
            case "const int *":
            case "int *":
                this.declare(name, 'JSValue', false, `JS_NewArrayBufferCopy(ctx, ${src}, sizeof(${src}))`)
                break;
            // case "unsigned char *":
            //     this.declare(name, 'JSValue', false, `JS_NewString(ctx, ${src})`)
            //     break;
            default:
                const classId = classIds[type]
                if(!classId) throw new Error("Cannot convert parameter type to Javascript: " + type)
                this.jsStructToOpq(type, name, src, classId)
        }
    }
    
    jsStructToOpq(structType: string, jsVar: string, srcVar: string, classId: string){
        this.declare(jsVar+"_ptr", structType+"*", false, `(${structType}*)js_malloc(ctx, sizeof(${structType}))`)
        this.statement("*"+jsVar+"_ptr = " + srcVar)
        this.declare(jsVar, "JSValue", false, `JS_NewObjectClass(ctx, ${classId})`)
        this.call("JS_SetOpaque", [jsVar, jsVar+"_ptr"])
    }

    jsCleanUpParameter(type: string, name: string) {
        switch (type) {
            case "char *":
            case "const char *":
                this.statement(`JS_FreeCString(ctx, ${name})`)
                break;
            case "const void *":
            case "void *":
            case "float *":
            case "unsigned short *":
            case "unsigned char *":
            case "const unsigned char *":
                this.statement(`free((void *)${name})`)
                break;
            default:
                break;
        }
    }

    jsFunctionList(name: string){
        this.line("static const JSCFunctionListEntry "+ name + "[] = {")
        this.indent()
        const sub = this.createGenerator()
        sub.setTag("_type", "js-function-list")
        sub.setTag("_name", name)
        this.child(sub)
        this.unindent()
        this.statement("}")
        this.breakLine()
        return sub
    }

    jsFuncDef(jsName: string, numArgs: number, cName: string){
        this.line(`JS_CFUNC_DEF("${jsName}",${numArgs},${cName}),`)
    }

    jsClassId(id: string){
        this.declare(id, "JSClassID", true)
        return id
    }

    jsPropStringDef(key: string, value: string){
        this.line(`JS_PROP_STRING_DEF("${key}","${value}", JS_PROP_CONFIGURABLE),`)
    }
    
    jsGetSetDef(key: string, getFunc?: string, setFunc?: string){
        this.line(`JS_CGETSET_DEF("${key}",${getFunc || "NULL"},${setFunc || "NULL"}),`)
    }

    jsStructFinalizer(classId: string, structName: string, onFinalize?: (gen: T, ptrName: string) => void){
        const args = [{type: "JSRuntime *", name: "rt"},{type: "JSValue", name: "val"}]
        const body = this.function(`js_${structName}_finalizer`, "void", args, true)
        body.statement(`${structName}* ptr = JS_GetOpaque(val, ${classId})`)
        body.if("ptr", cond => {
            //cond.call("TraceLog", ["LOG_INFO",`"Finalize ${structName} %p"`,"ptr"])
            if(onFinalize) onFinalize(<T>cond, "ptr") 
            cond.call("js_free_rt", ["rt","ptr"])
        })
        return body    
    }

    jsClassDeclaration(structName: string, classId: string, finalizerName: string, funcListName: string){
        const body = this.function("js_declare_" + structName, "int", [{type: "JSContext *", name: "ctx"},{type: "JSModuleDef *", name: "m"}],true)
        body.call("JS_NewClassID", ["&"+classId])
        const classDefName = `js_${structName}_def` 
        body.declare(classDefName, "JSClassDef", false, `{ .class_name = "${structName}", .finalizer = ${finalizerName} }`)
        body.call("JS_NewClass", ["JS_GetRuntime(ctx)",classId,"&"+classDefName])
        body.declare("proto", "JSValue", false, "JS_NewObject(ctx)")
        body.call("JS_SetPropertyFunctionList", ["ctx", "proto", funcListName, `countof(${funcListName})`])
        body.call("JS_SetClassProto", ["ctx",classId,"proto"])
        body.statement("return 0")
        return body
    }

    jsStructGetter(structName: string, classId: string, field: string, type: string, classIds: StructLookup, overrideRead?: (gen: QuickJsGenerator) => void){
        const args = [{type: "JSContext*", name: "ctx" }, {type: "JSValueConst", name: "this_val"}]
        const fun = this.function(`js_${structName}_get_${field}`,"JSValue",args,true)
        fun.declare("ptr", structName+"*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`)
        if(overrideRead) { overrideRead(fun) }
        else { 
            fun.declare(field, type, false, "ptr->"+field) 
        }
        fun.jsToJs(type, "ret", field, classIds)
        fun.returnExp("ret")
        return fun
    }

    jsStructSetter(structName: string, classId: string, field: string, type: string, classIds: StructLookup, overrideWrite?: (gen: QuickJsGenerator) => void){
        const args = [{type: "JSContext*", name: "ctx" }, {type: "JSValueConst", name: "this_val"},{type: "JSValueConst", name: "v"}]
        const fun = this.function(`js_${structName}_set_${field}`,"JSValue",args,true)
        fun.declare("ptr", structName+"*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`)
        fun.jsToC(type, "value", "v", classIds);
        if(overrideWrite){ overrideWrite(fun) }
        else { 
            fun.statement("ptr->"+field+" = value") 
        }
        fun.returnExp("JS_UNDEFINED")
        return fun
    }

    jsOpqToStructPtr(structType: string, structVar: string, srcVar: string, classId: string){
        this.declare(structVar, structType+"*", false, `(${structType}*)JS_GetOpaque2(ctx, ${srcVar}, ${classId})`)
    }

    jsStructConstructor(structName: string, fields: FunctionArgument[], classId: string, classIds: StructLookup){
        const body = this.jsBindingFunction(structName + "_constructor")
        for (let i = 0; i < fields.length; i++) {
            const para = fields[i]
            body.jsToC(para.type,para.name,"argv["+i+"]", classIds)
        }
        body.declareStruct(structName, "_struct", fields.map(x => x.name))
        body.jsStructToOpq(structName,"_return","_struct", classId)
        body.returnExp("_return")
        return body
    }

}

export class QuickJsGenerator extends GenericQuickJsGenerator<QuickJsGenerator> {
    createGenerator(): QuickJsGenerator {
        return new QuickJsGenerator()
    }
}

