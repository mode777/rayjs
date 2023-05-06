import { ApiStruct, ApiFunction } from "./api";
import { RayLibFunctionListGenerator } from "./functionList";
import { CodeGenerator, ConditionGenerator, FunctionGenerator } from "./generation";

export interface StructBindingOptions {
    getters?: string[]
    setters?: string[]
}

export class RayLibStructGenerator extends CodeGenerator {

    private readonly options: StructBindingOptions; 
    private readonly funcList: RayLibFunctionListGenerator
    public finalizerName = ""
    public classDeclarationName = ""

    constructor(public readonly classId: string, private struct: ApiStruct, private destructor: ApiFunction | null, options?: StructBindingOptions){
        super()
        this.options = options || {}
        this.funcList = new RayLibFunctionListGenerator(`js_${struct.name}_proto_funcs`)

        this.declareFinalizer()
        this.breakLine()
        this.declareGetterSetter()
        this.funcList.addPropertyString("[Symbol.toStringTag]", "Image")
        this.child(this.funcList)
        this.breakLine()
        this.buildClassDeclaration()
        this.breakLine()
    }

    private declareFinalizer(){
        this.finalizerName = `js_${this.struct.name}_finalizer`
        this.childFuncBody(new FunctionGenerator(this.finalizerName, "void", [
            {type: "JSRuntime *", name: "rt"},
            {type: "JSValue", name: "val"}], true), body => {
                body.statement(`${this.struct.name}* ptr = JS_GetOpaque(val, ${this.classId})`)
                body.childFuncBody(new ConditionGenerator("ptr"), cond => {
                    cond.call("puts", ["\"Finalize "+this.struct.name+"\""])
                    if(this.destructor) cond.call(this.destructor.name, ["*ptr"])
                    cond.call("js_free_rt", ["rt","ptr"])
                })
            }) 
    }

    private declareGetterSetter(){
        // Add to funList
    }

    private buildClassDeclaration(){
        this.classDeclarationName = "js_declare_" + this.struct.name
        this.childFuncBody(new FunctionGenerator(this.classDeclarationName, "int", [{type: "JSContext *", name: "ctx"},{type: "JSModuleDef *", name: "m"}],true), body => {
            body.call("JS_NewClassID", ["&"+this.classId])
            const classDefName = `js_${this.struct.name}_def` 
            body.declare(classDefName, "JSClassDef", false, `{ .class_name = "${this.struct.name}", .finalizer = ${this.finalizerName} }`)
            body.call("JS_NewClass", ["JS_GetRuntime(ctx)",this.classId,"&"+classDefName])
            body.declare("proto", "JSValue", false, "JS_NewObject(ctx)")
            body.call("JS_SetPropertyFunctionList", ["ctx", "proto", this.funcList.name, `countof(${this.funcList.name})`])
            body.call("JS_SetClassProto", ["ctx",this.classId,"proto"])
            body.statement("return 0")
        })
    }
}