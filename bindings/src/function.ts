import { ApiFunction } from "./api"
import { FunctionGenerator } from "./generation"
import { RayLibParamDescription } from "./interfaces"

export class RayLibFunctionGenerator extends FunctionGenerator {
    constructor(public readonly jsName: string, public readonly func: ApiFunction){
        super("js_"+jsName, "JSValue", [
            {type: "JSContext *", name: "ctx"},
            {type: "JSValueConst", name: "this_val"},
            {type: "int", name: "argc"},
            {type: "JSValueConst *", name: "argv"},
        ], true)
        this.readParameters()
        this.callFunction()
        this.cleanUp()
        this.returnValue()            
    }
    
    readParameters() {
        for (let i = 0; i < this.func.params.length; i++) {
            const para = this.func.params[i]
            this.readParameter(para,i)
        }
    }

    callFunction() {
        this.body.call(this.func.name, this.func.params.map(x => x.name), this.func.returnType === "void" ? null : {type: this.func.returnType, name: "returnVal"})
    }
    
    cleanUp() {
        for (const param of this.func.params) {
            this.cleanUpParameter(param)
        }
    }

    returnValue() {
        if(this.func.returnType === "void"){
            this.body.statement("return JS_UNDEFINED")
        } else {
            this.body.statement("return retVal")
        }
    }     

    private readParameter(para: RayLibParamDescription, index: number){
        this.body.inline(`${para.type} ${para.name}`)
        switch (para.type) {
            case "const char *":
                this.body.statement(` = JS_ToCString(ctx, argv[${index}])`)
                this.body.statement(`if(${para.name} == NULL) return JS_EXCEPTION`)
                break;
            case "int":
                this.body.statement('')
                this.body.statement(`JS_ToInt32(ctx, &${para.name}, argv[${index}])`)
                break;
            default:
                throw new Error("Cannot handle parameter type: " + para.type)
        }
    }

    private cleanUpParameter(param: RayLibParamDescription) {
        switch (param.type) {
            case "const char *":
                this.body.statement(`JS_FreeCString(ctx, ${param.name})`)
                break;
            default:
                break;
        }
    }
}