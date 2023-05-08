import { ApiDescription, ApiFunction, ApiStruct } from "./api"
import { CodeGenerator } from "./generation"
import { QuickJsHeader } from "./quickjs"

export interface StructBindingOptions {
    properties?: { [key:string]: { get?:boolean, set?:boolean } }
}


export class RayLibHeader extends QuickJsHeader {

    constructor(name: string, private api: ApiDescription){
        super(name)
        this.includes.include("raylib.h")
    }

    addApiFunction(api: ApiFunction, jsName: string | null = null){
        const jName = jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1)

        const fun = this.functions.jsBindingFunction(jName)
        // read parameters
        for (let i = 0; i < api.params.length; i++) {
            const para = api.params[i]
            fun.jsToC(para.type,para.name,"argv["+i+"]")
        }
        // call c function
        fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : {type: api.returnType, name: "returnVal"})
        // clean up parameters
        for (const param of api.params) {
            fun.jsCleanUpParameter(param.type, param.name)
        }
        // return result
        if(api.returnType === "void"){
            fun.statement("return JS_UNDEFINED")
        } else {
            fun.jsToJs(api.returnType, "ret", "returnVal")
            fun.returnExp("returnVal")
        }

        // add binding to function declaration
        this.moduleFunctionList.jsFuncDef(jName, api.argc, fun.getTag("_name"))
    }

    addApiFunctionByName(name: string, jsName: string | null = null){
        const func = this.api.getFunction(name)
        if(func === null) throw new Error("Function not in API: " + name)
        this.addApiFunction(func, jsName)
    }

    addApiStruct(struct: ApiStruct, destructor: ApiFunction | null, options?: StructBindingOptions){
        const classId = this.declarations.jsClassId(`js_${struct.name}_class_id`)
        
        const finalizer = this.structs.jsStructFinalizer(classId, struct.name, (gen,ptr) => destructor && gen.call(destructor.name, ["*"+ptr]))
        
        const propDeclarations = this.structs.createGenerator()
        if(options && options.properties){
            for (const field of Object.keys(options.properties)) {
                const type = struct.fields.find(x => x.name === field)?.type
                if(!type) throw new Error(`Struct ${struct.name} does not contain field ${field}`)
                const el = options.properties[field]
                let _get: CodeGenerator | undefined = undefined
                let _set: CodeGenerator | undefined = undefined
                if(el.get) _get = this.structs.jsStructGetter(struct.name, classId, field, type)
                propDeclarations.jsGetSetDef(field, _get?.getTag("_name"), undefined)
            }
        }

        const classFuncList = this.structs.jsFunctionList(`js_${struct.name}_proto_funcs`)
        classFuncList.child(propDeclarations)
        classFuncList.jsPropStringDef("[Symbol.toStringTag]", "Image")
        const classDecl = this.structs.jsClassDeclaration(struct.name, classId, finalizer.getTag("_name"), classFuncList.getTag("_name"))
        
        this.moduleInit.call(classDecl.getTag("_name"), ["ctx", "m"])
        // OPT: 7. expose class and constructor
    }

    addApiStructByName(structName: string, destructorName: string | null = null, options?: StructBindingOptions){
        const struct = this.api.getStruct(structName)
        if(!struct) throw new Error("Struct not in API: "+ structName)
        let destructor: ApiFunction | null = null
        if(destructorName !== null){
            destructor = this.api.getFunction(destructorName)
            if(!destructor) throw new Error("Destructor func not in API: "+ destructorName)
        }
        this.addApiStruct(struct, destructor, options)
    }
}