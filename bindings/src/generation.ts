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

export class CodeGenerator {
    private children: CodeGenerator[] = []
    private text: string[] = []
    private tokens: Token[] = []

    iterateTokens(){
        return this.tokens[Symbol.iterator]()
    }
    
    iterateText(){
        return this.text[Symbol.iterator]()
    }

    iterateChildren(){
        return this.children[Symbol.iterator]()
    }
    
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

    child(sub: CodeGenerator){
        this.tokens.push(Token.GOSUB)
        this.children.push(sub)
    }

    childFunc(sub: CodeGenerator, func: (gen: CodeGenerator) => void){
        this.child(sub)
        func(sub)
    }

    childFuncBody(sub: FunctionGenerator | ConditionGenerator, func: (gen: CodeGenerator) => void): void {
        this.child(sub)
        func(sub.body)
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
}

export class ConditionGenerator extends CodeGenerator {
    body = new CodeGenerator()

    constructor(condition: string){
       super() 
       this.line("if("+condition+") {")
       this.indent()
       this.child(this.body)
       this.unindent()
       this.line("}")
    }
}

export class HeaderGenerator extends CodeGenerator {
    guardStart(name: string){
       this.line("#ifndef " + name) 
       this.line("#define " + name) 
    }
    guardEnd(name: string){
        this.line("#endif // " + name)
    }
    include(name: string){
        this.line("#include <" + name + ">")
    }
}

export interface FunctionArgument {
    type: string,
    name: string
}

export class CustomFunctionGenerator<T extends CodeGenerator> extends CodeGenerator {
    constructor(public readonly name: string, returnType: string, args: FunctionArgument[], public readonly body: T, isStatic = false){
        super()
        if(isStatic) this.inline("static ")
        this.inline(returnType + " " + name + "(")
        this.inline(args.map(x => x.type + " " + x.name).join(", "))
        this.inline(") {")
        this.breakLine()
        this.indent()
        this.child(body)
        this.unindent()
        this.line("}")
    }
}

export class FunctionGenerator extends CustomFunctionGenerator<CodeGenerator> {
    constructor(name: string, returnType: string, args: FunctionArgument[], isStatic = false, body: CodeGenerator = new CodeGenerator()){
        super(name, returnType, args, body, isStatic)
    }
}