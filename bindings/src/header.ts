import { ApiDescription, ApiFunction, ApiStruct } from "./api"
import { RayLibFunctionGenerator } from "./function"
import { RayLibFunctionListGenerator } from "./functionList"
import { CodeGenerator, FunctionGenerator, HeaderGenerator } from "./generation"
import { RayLibStructGenerator, StructBindingOptions } from "./struct"

export class RayLibHeaderGenerator extends HeaderGenerator {

    public readonly moduleFunctionList: RayLibFunctionListGenerator
    public readonly moduleInit = new CodeGenerator()
    public readonly moduleEntry = new CodeGenerator()
    public readonly declarations = new CodeGenerator()
    public readonly body = new CodeGenerator()

    constructor(public readonly name: string, private api: ApiDescription){
        super()
        this.moduleFunctionList = new RayLibFunctionListGenerator("js_"+name+"_funcs")
        this.init()
    }

    addApiFunction(func: ApiFunction, jsName: string | null = null){
        const jName = jsName || func.name.charAt(0).toLowerCase() + func.name.slice(1)
        const gen = new RayLibFunctionGenerator(jName, func)
        this.body.child(gen)
        this.body.breakLine()
        this.moduleFunctionList.addFunction(jName, func.argc, gen.name)
    }

    addApiFunctionByName(name: string, jsName: string | null = null){
        const func = this.api.getFunction(name)
        if(func === null) throw new Error("Function not in API: " + name)
        this.addApiFunction(func, jsName)
    }

    addApiStruct(struct: ApiStruct, destructor: ApiFunction | null, options?: StructBindingOptions){
        const classIdName = `js_${struct.name}_class_id`
        this.declarations.declare(classIdName, "JSClassID", true)

        const gen = new RayLibStructGenerator(classIdName, struct, destructor, options)
        this.body.child(gen)

        this.moduleInit.call(gen.classDeclarationName, ["ctx", "m"])
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

    private init(){
        const guardName = "JS_"+this.name+"_GUARD";
        this.guardStart(guardName)
        this.breakLine()
        this.include("stdio.h")
        this.include("stdlib.h")
        this.include("string.h")
        this.breakLine()
        this.include("quickjs.h")
        this.include("raylib.h")
        this.breakLine()
        this.line("#ifndef countof")
        this.line("#define countof(x) (sizeof(x) / sizeof((x)[0]))")
        this.line("#endif")
        this.breakLine()   
        this.child(this.declarations)
        this.breakLine()   
        this.child(this.body)
        this.child(this.moduleFunctionList) 
        this.breakLine()    

        const moduleInitFunc = new FunctionGenerator("js_"+this.name+"_init", "int", [
            {type: "JSContext *", name: "ctx"},
            {type: "JSModuleDef *", name: "m"}])
        moduleInitFunc.body.statement(`JS_SetModuleExportList(ctx, m,${this.moduleFunctionList.name},countof(${this.moduleFunctionList.name}))`)
        moduleInitFunc.body.child(this.moduleInit)
        moduleInitFunc.body.statement("return 0")
        this.child(moduleInitFunc)
        this.breakLine()  

        const moduleEntryFunc = new FunctionGenerator("js_init_module_"+this.name, "JSModuleDef *", [
            {type: "JSContext *", name: "ctx"},
            {type: "const char *", name: "module_name"}
        ])  
        moduleEntryFunc.body.statement("JSModuleDef *m")
        moduleEntryFunc.body.statement(`m = JS_NewCModule(ctx, module_name, ${moduleInitFunc.name})`)
        moduleEntryFunc.body.statement("if(!m) return NULL")
        moduleEntryFunc.body.statement(`JS_AddModuleExportList(ctx, m, ${this.moduleFunctionList.name}, countof(${this.moduleFunctionList.name}))`)
        moduleEntryFunc.body.child(this.moduleEntry)
        moduleEntryFunc.body.statement("return m")
        this.child(moduleEntryFunc)
        this.breakLine()

        this.guardEnd(guardName)
    }
}