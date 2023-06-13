import { CodeGenerator } from "./generation"
import { RayLibEnum, RayLibFunction, RayLibStruct } from "./interfaces"
import { QuickJsGenerator, QuickJsHeader } from "./quickjs"
import { TypeScriptDeclaration } from "./typescript"




export class RayLibHeader extends QuickJsHeader {

    typings = new TypeScriptDeclaration()

    constructor(name: string){
        super(name)
        this.includes.include("raylib.h")
        //this.includes.line("#define RAYMATH_IMPLEMENTATION")
        
    }

    addApiFunction(api: RayLibFunction){
        const options = api.binding || {}
        if(options.ignore) return

        const jName = options.jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1)
        console.log("Binding function "+api.name)

        const fun = this.functions.jsBindingFunction(jName)
        if(options.body) {
            options.body(fun)
        } else {
            if(options.before) options.before(fun)
            // read parameters
            api.params = api.params || []
            const activeParams = api.params.filter(x => !x.binding?.ignore)
            
            for (let i = 0; i < activeParams.length; i++) {
                const para = activeParams[i]
                if(para.binding?.customConverter) para.binding.customConverter(fun, "argv["+i+"]")
                else fun.jsToC(para.type,para.name,"argv["+i+"]", this.structLookup, false, para.binding?.typeAlias)
            }
            // call c function
            if(options.customizeCall) fun.line(options.customizeCall)
            else fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : {type: api.returnType, name: "returnVal"})
            // clean up parameters
            for (let i = 0; i < activeParams.length; i++) {
                const param = activeParams[i]
                if(param.binding?.customCleanup) param.binding.customCleanup(fun, "argv["+i+"]")
                else fun.jsCleanUpParameter(param.type, param.name)
            }
            // return result
            if(api.returnType === "void"){
                if(options.after) options.after(fun)
                fun.statement("return JS_UNDEFINED")
            } else {
                fun.jsToJs(api.returnType, "ret", "returnVal", this.structLookup)
                if(options.after) options.after(fun)
                fun.returnExp("ret")
            }
        }

        // add binding to function declaration
        this.moduleFunctionList.jsFuncDef(jName, (api.params || []).filter(x => !x.binding?.ignore).length, fun.getTag("_name"))
        this.typings.addFunction(jName,api)
    }

    addEnum(renum: RayLibEnum){
        console.log("Binding enum "+ renum.name)
        renum.values.forEach(x => this.exportGlobalInt(x.name, x.description))      
    }

    addApiStruct(struct: RayLibStruct){
        const options = struct.binding || {}
        console.log("Binding struct "+ struct.name)
        const classId = this.definitions.jsClassId(`js_${struct.name}_class_id`)
        this.registerStruct(struct.name, classId)
        options.aliases?.forEach(x => this.registerStruct(x, classId))
        const finalizer = this.structs.jsStructFinalizer(classId, struct.name, (gen,ptr) => options.destructor && gen.call(options.destructor.name, ["*"+ptr]))
        
        const propDeclarations = this.structs.createGenerator()
        if(options && options.properties){
            for (const field of Object.keys(options.properties)) {
                const type = struct.fields.find(x => x.name === field)?.type
                if(!type) throw new Error(`Struct ${struct.name} does not contain field ${field}`)
                const el = options.properties[field]
                let _get: CodeGenerator | undefined = undefined
                let _set: CodeGenerator | undefined = undefined
                if(el.get) _get = this.structs.jsStructGetter(struct.name, classId, field, type, /*Be carefull when allocating memory in a getter*/this.structLookup, el.overrideRead)
                if(el.set) _set = this.structs.jsStructSetter(struct.name, classId, field, type, this.structLookup, el.overrideWrite)
                propDeclarations.jsGetSetDef(field, _get?.getTag("_name"), _set?.getTag("_name"))
            }
        }

        const classFuncList = this.structs.jsFunctionList(`js_${struct.name}_proto_funcs`)
        classFuncList.child(propDeclarations)
        classFuncList.jsPropStringDef("[Symbol.toStringTag]", struct.name)
        const classDecl = this.structs.jsClassDeclaration(struct.name, classId, finalizer.getTag("_name"), classFuncList.getTag("_name"))
        
        this.moduleInit.call(classDecl.getTag("_name"), ["ctx", "m"])
        
        if(options?.createConstructor || options?.createEmptyConstructor){
            const body = this.functions.jsStructConstructor(struct.name, options?.createEmptyConstructor ? [] : struct.fields, classId, this.structLookup)
            
            this.moduleInit.statement(`JSValue ${struct.name}_constr = JS_NewCFunction2(ctx, ${body.getTag("_name")},"${struct.name})", ${struct.fields.length}, JS_CFUNC_constructor_or_func, 0)`)
            this.moduleInit.call("JS_SetModuleExport", ["ctx","m", `"${struct.name}"`, struct.name+"_constr"])

            this.moduleEntry.call("JS_AddModuleExport", ["ctx","m",'"'+struct.name+'"'])
        }
        this.typings.addStruct(struct)
    }

    exportGlobalStruct(structName: string, exportName: string, values: string[], description: string){
        this.moduleInit.declareStruct(structName,exportName+"_struct", values)
        const classId = this.structLookup[structName]
        if(!classId) throw new Error("Struct "+structName+" not found in register")
        this.moduleInit.jsStructToOpq(structName, exportName+"_js", exportName+"_struct", classId)
        this.moduleInit.call("JS_SetModuleExport", ["ctx","m",`"${exportName}"`, exportName+"_js"])
        this.moduleEntry.call("JS_AddModuleExport", ["ctx","m",`"${exportName}"`])
        this.typings.constants.tsDeclareConstant(exportName, structName, description)
    }

    exportGlobalInt(name: string, description: string){
        this.moduleInit.statement(`JS_SetModuleExport(ctx, m, "${name}", JS_NewInt32(ctx, ${name}))`)
        this.moduleEntry.statement(`JS_AddModuleExport(ctx, m, "${name}")`)
        this.typings.constants.tsDeclareConstant(name, "number", description)
    }

    exportGlobalDouble(name: string, description: string){
        this.moduleInit.statement(`JS_SetModuleExport(ctx, m, "${name}", JS_NewFloat64(ctx, ${name}))`)
        this.moduleEntry.statement(`JS_AddModuleExport(ctx, m, "${name}")`)
        this.typings.constants.tsDeclareConstant(name, "number", description)
    }
}