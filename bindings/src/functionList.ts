import { CodeGenerator } from "./generation"

export class RayLibFunctionListGenerator extends CodeGenerator {


    private entries = new CodeGenerator()

    constructor(public readonly name: string){
        super()
        this.line("static const JSCFunctionListEntry "+ name + "[] = {")
        this.indent()
        this.child(this.entries)
        this.unindent()
        this.statement("}")
    }

    addFunction(jsName: string, numArgs: number, cName: string){
        this.entries.line(`JS_CFUNC_DEF("${jsName}",${numArgs},${cName}),`)
    }
    
    addPropertyString(key: string, value: string) {
        this.entries.line(`JS_PROP_STRING_DEF("${key}","${value}", JS_PROP_CONFIGURABLE),`)
    }
}