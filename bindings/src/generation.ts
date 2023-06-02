export class StringWriter {
    private buffer = ''

    write(value: string): void {
        this.buffer += value;
    }

    writeLine(value: string = ''): void {
        this.buffer += value + '\n';
    }

    toString(): string {
        return this.buffer;
    }
}

export class CodeWriter extends StringWriter {
    private indent = 0
    private needsIndent = true

    writeGenerator(generator: CodeGenerator){
        const tokens = generator.iterateTokens()
        const text = generator.iterateText()
        const children = generator.iterateChildren()
        let result = tokens.next();
        while (!result.done) {
            switch (result.value) {
                case Token.STRING:
                    const str = text.next().value
                    if(this.needsIndent){
                        this.write("    ".repeat(this.indent))
                        this.needsIndent = false
                    }
                    this.write(str)
                    break
                case Token.GOSUB:
                    const sub = children.next().value
                    this.writeGenerator(sub)
                    break
                case Token.INDENT:
                    this.indent++
                    break
                case Token.UNINDENT:
                    this.indent = this.indent > 0 ? this.indent-1 : 0
                    break
                case Token.NEWLINE:
                    this.write("\n")
                    this.needsIndent = true
                    break
                default:
                    break
            }
            result = tokens.next()
        }
    }
}

enum Token {
    STRING = 0,
    NEWLINE = 1,
    INDENT = 2,
    UNINDENT = 3,
    GOSUB = 4
}

export interface FunctionArgument {
    type: string,
    name: string,
    description?: string 
}

export abstract class GenericCodeGenerator<T extends CodeGenerator> {
    private children: CodeGenerator[] = []
    private text: string[] = []
    private tokens: Token[] = []

    private tags: {[key:string]:any} = {}

    getTag(key: string){
        return this.tags[key]
    }

    setTag(key: string, value: any){
        this.tags[key] = value
    }

    iterateTokens(){
        return this.tokens[Symbol.iterator]()
    }
    
    iterateText(){
        return this.text[Symbol.iterator]()
    }

    iterateChildren(){
        return this.children[Symbol.iterator]()
    }

    abstract createGenerator(): T;
    
    line(text: string){
        this.tokens.push(Token.STRING, Token.NEWLINE)
        this.text.push(text)
    }

    comment(text: string){
        this.line("// " + text)
    }

    call(name: string, params: string[], returnVal: FunctionArgument | null = null){
        if(returnVal) this.inline(`${returnVal.type} ${returnVal.name} = `)
        this.inline(name + "(")
        this.inline(params.join(", "))
        this.statement(")")
    }

    declare(name: string, type: string, isStatic = false, initValue: string | null = null){
        if(isStatic) this.inline("static ")
        this.inline(type + " " + name)
        if(initValue) this.inline(" = " + initValue)
        this.statement("")
    }

    child(sub?: T){
        if(!sub) sub = this.createGenerator()
        this.tokens.push(Token.GOSUB)
        this.children.push(sub)
        return sub
    }

    inline(str: string){
        this.tokens.push(Token.STRING)
        this.text.push(str)
    }

    statement(str: string){
        this.line(str+";")
    }

    breakLine(){
        this.tokens.push(Token.NEWLINE)
    }

    public indent(){
        this.tokens.push(Token.INDENT)
    }

    public unindent(){
        this.tokens.push(Token.UNINDENT)
    }

    public function(name: string, returnType: string, args: FunctionArgument[], isStatic: boolean, func?: (gen: T) => void): T {
        const sub = this.createGenerator();
        sub.setTag("_type", "function-body")
        sub.setTag("_name", name)
        sub.setTag("_isStatic", isStatic)
        sub.setTag("_returnType", returnType)
        if(isStatic) this.inline("static ")
        this.inline(returnType + " " + name + "(")
        this.inline(args.map(x => x.type + " " + x.name).join(", "))
        this.inline(") {")
        this.breakLine()
        this.indent()
        this.child(sub)
        this.unindent()
        this.line("}")
        this.breakLine()
        if(func) func(sub)
        return sub
    }

    public if(condition: string, funIf?: (gen: T) => void){
        this.line("if("+condition+") {")
        this.indent()
        const sub = this.createGenerator()
        sub.setTag("_type", "if-body")
        sub.setTag("_condition", condition)
        this.child(sub)
        this.unindent()
        this.line("}")
        if(funIf) funIf(sub)
        return sub
    }

    public else(funElse?: (gen: T) => void){
        this.line("else {")
        this.indent()
        const sub = this.createGenerator()
        sub.setTag("_type", "else-body")
        this.child(sub)
        this.unindent()
        this.line("}")
        if(funElse) funElse(sub)
        return sub
    }

    public returnExp(exp: string){
        this.statement("return "+exp)
    }

    public include(name: string){
        this.line("#include <" + name + ">")
    }

    public for(indexVar: string, lengthVar: string){
        this.line(`for(int ${indexVar}; i < ${lengthVar}; i++){`)
        this.indent()
        const child = this.child()
        this.unindent()
        this.line("}")
        return child;
    }

    public header(guard: string, fun?: (gen: T) => void){
        this.line("#ifndef " + guard) 
        this.line("#define " + guard) 
        this.breakLine()
        const sub = this.child()
        sub.setTag("_type", "header-body")
        sub.setTag("_guardName", guard)
        this.line("#endif // " + guard)
        if(fun) fun(sub)
        return sub
    }    

    public declareStruct(structName: string, varName: string, values: string[], isStatic: boolean = false){
        if(isStatic) this.inline("static ")
        this.statement(`${structName} ${varName} = { ${values.join(', ')} }`)
    }

    public switch(switchVar: string){
        this.line(`switch(${switchVar}) {`)
        this.indent()
        const body = this.child()
        this.unindent()
        this.line("}")
        return body
    }

    public case(value: string){
        this.line(`case ${value}:`)
    }

    public defaultBreak(){
        this.line("default:")
        this.line("{")
        this.indent()
        const body = this.child()
        this.statement("break")
        this.unindent()
        this.line("}")
        return body
    }

    public caseBreak(value: string){
        this.case(value)
        this.line("{")
        this.indent()
        const body = this.child()
        this.statement("break")
        this.unindent()
        this.line("}")
        return body
    }
}

export class CodeGenerator extends GenericCodeGenerator<CodeGenerator>{
    createGenerator(): CodeGenerator {
        return new CodeGenerator()
    }
    
}