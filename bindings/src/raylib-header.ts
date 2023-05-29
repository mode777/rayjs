import { ApiDescription, ApiFunction, ApiStruct } from "./api"
import { CodeGenerator } from "./generation"
import { QuickJsGenerator, QuickJsHeader } from "./quickjs"
import { TypeScriptDeclaration } from "./typescript"

export interface StructBindingOptions {
    properties?: { [key:string]: { get?:boolean, set?:boolean } },
    destructor?: string,
    construct?: string, 
    createConstructor?: boolean
    createEmptyConstructor?: boolean
}

export interface FuncBindingOptions {
    before?: (gen: QuickJsGenerator) => void,
    after?: (gen: QuickJsGenerator) => void,
    customizeCall?: string,
    body?: (gen: QuickJsGenerator) => void
}


export class RayLibHeader extends QuickJsHeader {

    typings = new TypeScriptDeclaration()

    constructor(name: string, private api: ApiDescription){
        super(name)
        this.includes.include("raylib.h")
        //this.includes.line("#define RAYMATH_IMPLEMENTATION")
        
    }

    addApiFunction(api: ApiFunction, jsName: string | null = null, options: FuncBindingOptions = {}){
        const jName = jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1)

        const fun = this.functions.jsBindingFunction(jName)
        if(options.body) {
            options.body(fun)
        } else {
            if(options.before) options.before(fun)
            // read parameters
            for (let i = 0; i < api.params.length; i++) {
                const para = api.params[i]
                fun.jsToC(para.type,para.name,"argv["+i+"]", this.structLookup)
            }
            // call c function
            if(options.customizeCall) fun.line(options.customizeCall)
            else fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : {type: api.returnType, name: "returnVal"})
            // clean up parameters
            for (const param of api.params) {
                fun.jsCleanUpParameter(param.type, param.name)
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
        this.moduleFunctionList.jsFuncDef(jName, api.argc, fun.getTag("_name"))
        this.typings.addFunction(jName,api)
    }

    addApiFunctionByName(name: string, jsName: string | null = null, options: FuncBindingOptions = {}){
        const func = this.api.getFunction(name)
        if(func === null) throw new Error("Function not in API: " + name)
        this.addApiFunction(func, jsName, options)
    }

    addApiStruct(struct: ApiStruct, destructor: ApiFunction | null, options?: StructBindingOptions){
        const classId = this.definitions.jsClassId(`js_${struct.name}_class_id`)
        this.registerStruct(struct.name, classId)
        this.api.getAliases(struct.name).forEach(x => this.registerStruct(x, classId))
        const finalizer = this.structs.jsStructFinalizer(classId, struct.name, (gen,ptr) => destructor && gen.call(destructor.name, ["*"+ptr]))
        
        const propDeclarations = this.structs.createGenerator()
        if(options && options.properties){
            for (const field of Object.keys(options.properties)) {
                const type = struct.fields.find(x => x.name === field)?.type
                if(!type) throw new Error(`Struct ${struct.name} does not contain field ${field}`)
                const el = options.properties[field]
                let _get: CodeGenerator | undefined = undefined
                let _set: CodeGenerator | undefined = undefined
                if(el.get) _get = this.structs.jsStructGetter(struct.name, classId, field, type, /*Be carefull when allocating memory in a getter*/this.structLookup)
                if(el.set) _set = this.structs.jsStructSetter(struct.name, classId, field, type, this.structLookup)
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
        this.typings.addStruct(struct, options || {})
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

    exportGlobalConstant(name: string, description: string){
        this.moduleInit.statement(`JS_SetModuleExport(ctx, m, "${name}", JS_NewInt32(ctx, ${name}))`)
        this.moduleEntry.statement(`JS_AddModuleExport(ctx, m, "${name}")`)
        this.typings.constants.tsDeclareConstant(name, "number", description)
    }

    addApiStructByName(structName: string, options?: StructBindingOptions){
        const struct = this.api.getStruct(structName)
        if(!struct) throw new Error("Struct not in API: "+ structName)
        let destructor: ApiFunction | null = null
        if(options?.destructor){
            destructor = this.api.getFunction(options.destructor)
            if(!destructor) throw new Error("Destructor func not in API: "+ options.destructor)
        }
        this.addApiStruct(struct, destructor, options)
    }
}