import { GenericCodeGenerator, FunctionArgument, CodeWriter } from "./generation"
import { writeFileSync } from "fs";
import { RayLibFunction, RayLibStruct } from "./interfaces";

export class TypeScriptDeclaration {
    root = new TypescriptGenerator()
    structs: TypescriptGenerator;
    functions: TypescriptGenerator;
    constants: TypescriptGenerator;

    constructor(){
        this.structs = this.root.child()
        this.functions = this.root.child()
        this.constants = this.root.child()
    }



    addFunction(name: string, api: RayLibFunction){
        const options = api.binding || {}
        const para = (api.params || []).filter(x => !x.binding?.ignore).map(x => ({ name: x.name, type: x.binding?.jsType ?? this.toJsType(x.type)}))
        const returnType = options.jsReturns ?? this.toJsType(api.returnType)
        this.functions.tsDeclareFunction(name, para, returnType, api.description)
    }

    addStruct(api: RayLibStruct){
        const options = api.binding || {}
        var fields = api.fields.filter(x => !!(options.properties || {})[x.name]).map(x => ({name: x.name, description: x.description, type: this.toJsType(x.type)}))
        this.structs.tsDeclareInterface(api.name, fields)
        this.structs.tsDeclareType(api.name, !!(options.createConstructor || options.createEmptyConstructor), options.createEmptyConstructor ? [] : fields)
    }

    private toJsType(type: string){
        switch(type){
            case "int":
            case "long":
            case "unsigned int":
            case "unsigned char":
            case "float":
            case "double":
                return "number"
            case "const unsigned char *":
            case "unsigned char *":
            case "unsigned short *":
            case "float *":
                return "ArrayBuffer"
            case "bool":
                return "boolean"
            case "const char *":
            case "char *":
                return "string | undefined | null"
            case "void *":
            case "const void *":
                return "any"
            case "Camera":
            case "Camera *":
                return "Camera3D"
            case "Texture2D":
            case "Texture2D *":
            case "TextureCubemap":
                return "Texture"
            case "RenderTexture2D":
            case "RenderTexture2D *":
                return "RenderTexture"
            case "Quaternion":
                return "Vector4"
            default:
                return type.replace(" *", "").replace("const ", "")
        }
    }

    public writeTo(filename: string){
        const writer = new CodeWriter()
        writer.writeGenerator(this.root)
        writeFileSync(filename, writer.toString())
    }
}

export abstract class GenericTypescriptGenerator<T extends TypescriptGenerator> extends GenericCodeGenerator<T> {

    tsDeclareFunction(name: string, parameters: FunctionArgument[], returnType: string, description: string){
        this.tsDocComment(description)
        this.statement(`declare function ${name}(${parameters.map(x => x.name + ': '+x.type).join(', ')}): ${returnType}`)
    }

    tsDeclareConstant(name: string, type: string, description: string){
        this.tsDocComment(description)
        this.statement(`declare var ${name}: ${type}`)
    }

    tsDeclareType(name: string, hasConstructor: boolean, parameters: FunctionArgument[]){
        this.line(`declare var ${name}: {`)
        this.indent()
        this.statement("prototype: "+name)
        if(hasConstructor) this.statement(`new(${parameters.map(x => x.name+": "+x.type).join(', ')}): ${name}`)
        this.unindent()
        this.line("}")
    }

    tsDeclareInterface(name: string, fields: FunctionArgument[]){
        this.line(`interface ${name} {`)
        this.indent()
        for (const field of fields) {
            if(field.description) this.tsDocComment(field.description)
            this.line(field.name + ": "+field.type+",")
        }
        this.unindent()
        this.line("}")
    }

    tsDocComment(comment: string){
        this.line(`/** ${comment} */`)
    }
}

export class TypescriptGenerator extends GenericTypescriptGenerator<TypescriptGenerator> {
    createGenerator(): TypescriptGenerator {
        return new TypescriptGenerator()
    }
}

