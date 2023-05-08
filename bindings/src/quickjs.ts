import { writeFileSync } from "fs";
import { ApiFunction } from "./api"
import { CodeGenerator, CodeWriter, GenericCodeGenerator } from "./generation"

export type StructLookup = { [struct: string]: string }

export class QuickJsHeader {

    public readonly structLookup: StructLookup = {}
    public readonly moduleFunctionList: QuickJsGenerator
    public readonly structs: QuickJsGenerator
    public readonly functions: QuickJsGenerator
    public readonly moduleInit: QuickJsGenerator
    public readonly moduleEntry: QuickJsGenerator
    public readonly declarations: QuickJsGenerator
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
        this.declarations = body.child()
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
    
    jsToC(type: string, name: string, src: string){
        switch (type) {
            case "const char *":
                this.statement(`${type} ${name} = JS_ToCString(ctx, ${src})`)
                this.statement(`if(${name} == NULL) return JS_EXCEPTION`)
                break;
            case "int":
                this.statement(`${type} ${name}`)
                this.statement(`JS_ToInt32(ctx, &${name}, ${src})`)
                break;
            case "unsigned char":
                this.statement(`int _tmp`)
                this.statement(`JS_ToInt32(ctx, &_tmp, ${src})`)
                this.statement(`${type} ${name} = (${type})_tmp`)
                break;
            default:
                throw new Error("Cannot handle parameter type: " + type)
        }
    }

    jsToJs(type: string, name: string, src: string, classIds: StructLookup = {}){
        switch (type) {
            case "int":
            case "unsigned char":
                this.declare(name,'JSValue', false, `JS_NewInt32(ctx, ${src})`)
                break;
            default:
                const classId = classIds[type]
                if(!classId) throw new Error("Cannot handle parameter type: " + type)
                this.jsStructToOpq(type, name, src, classId)
        }
    }

    jsStructToOpq(structType: string, jsVar: string, srcVar: string, classId: string){
        this.declare("ptr", structType+"*", false, `(${structType}*)js_malloc(ctx, sizeof(${structType}))`)
        this.statement("*ptr = " + srcVar)
        this.declare(jsVar, "JSValue", false, `JS_NewObjectClass(ctx, ${classId})`)
        this.call("JS_SetOpaque", [jsVar, "ptr"])
    }

    jsCleanUpParameter(type: string, name: string) {
        switch (type) {
            case "const char *":
                this.statement(`JS_FreeCString(ctx, ${name})`)
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
            cond.call("TraceLog", ["LOG_INFO",`"Finalize ${structName}"`])
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

    jsStructGetter(structName: string, classId: string, field: string, type: string){
        const args = [{type: "JSContext*", name: "ctx" }, {type: "JSValueConst", name: "this_val"}]
        const fun = this.function(`js_${structName}_get_${field}`,"JSValue",args,true)
        fun.declare("ptr", structName+"*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`)
        fun.if("!ptr", cond => {
            cond.returnExp("JS_EXCEPTION")
        })
        fun.declare(field, type, false, "ptr->"+field)
        fun.jsToJs(type, "ret", field)
        fun.returnExp("ret")
        return fun
    }

    jsStructSetter(structName: string, classId: string, field: string, type: string){
        const args = [{type: "JSContext*", name: "ctx" }, {type: "JSValueConst", name: "this_val"},{type: "JSValueConst", name: "v"}]
        const fun = this.function(`js_${structName}_set_${field}`,"JSValue",args,true)
        fun.declare("ptr", structName+"*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`)
        fun.if("!ptr", cond => {
            cond.returnExp("JS_EXCEPTION")
        })
        fun.jsToC(type, "value", "v");
        fun.statement("ptr->"+field+" = value")
        fun.returnExp("JS_UNDEFINED")
        return fun
    }
}

export class QuickJsGenerator extends GenericQuickJsGenerator<QuickJsGenerator> {
    createGenerator(): QuickJsGenerator {
        return new QuickJsGenerator()
    }
}

