/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/generation.ts":
/*!***************************!*\
  !*** ./src/generation.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodeGenerator = exports.GenericCodeGenerator = exports.CodeWriter = exports.StringWriter = void 0;
class StringWriter {
    constructor() {
        this.buffer = '';
    }
    write(value) {
        this.buffer += value;
    }
    writeLine(value = '') {
        this.buffer += value + '\n';
    }
    toString() {
        return this.buffer;
    }
}
exports.StringWriter = StringWriter;
class CodeWriter extends StringWriter {
    constructor() {
        super(...arguments);
        this.indent = 0;
        this.needsIndent = true;
    }
    writeGenerator(generator) {
        const tokens = generator.iterateTokens();
        const text = generator.iterateText();
        const children = generator.iterateChildren();
        let result = tokens.next();
        while (!result.done) {
            switch (result.value) {
                case Token.STRING:
                    const str = text.next().value;
                    if (this.needsIndent) {
                        this.write("    ".repeat(this.indent));
                        this.needsIndent = false;
                    }
                    this.write(str);
                    break;
                case Token.GOSUB:
                    const sub = children.next().value;
                    this.writeGenerator(sub);
                    break;
                case Token.INDENT:
                    this.indent++;
                    break;
                case Token.UNINDENT:
                    this.indent = this.indent > 0 ? this.indent - 1 : 0;
                    break;
                case Token.NEWLINE:
                    this.write("\n");
                    this.needsIndent = true;
                    break;
                default:
                    break;
            }
            result = tokens.next();
        }
    }
}
exports.CodeWriter = CodeWriter;
var Token;
(function (Token) {
    Token[Token["STRING"] = 0] = "STRING";
    Token[Token["NEWLINE"] = 1] = "NEWLINE";
    Token[Token["INDENT"] = 2] = "INDENT";
    Token[Token["UNINDENT"] = 3] = "UNINDENT";
    Token[Token["GOSUB"] = 4] = "GOSUB";
})(Token || (Token = {}));
class GenericCodeGenerator {
    constructor() {
        this.children = [];
        this.text = [];
        this.tokens = [];
        this.tags = {};
    }
    getTag(key) {
        return this.tags[key];
    }
    setTag(key, value) {
        this.tags[key] = value;
    }
    iterateTokens() {
        return this.tokens[Symbol.iterator]();
    }
    iterateText() {
        return this.text[Symbol.iterator]();
    }
    iterateChildren() {
        return this.children[Symbol.iterator]();
    }
    line(text) {
        this.tokens.push(Token.STRING, Token.NEWLINE);
        this.text.push(text);
    }
    comment(text) {
        this.line("// " + text);
    }
    call(name, params, returnVal = null) {
        if (returnVal)
            this.inline(`${returnVal.type} ${returnVal.name} = `);
        this.inline(name + "(");
        this.inline(params.join(", "));
        this.statement(")");
    }
    declare(name, type, isStatic = false, initValue = null) {
        if (isStatic)
            this.inline("static ");
        this.inline(type + " " + name);
        if (initValue)
            this.inline(" = " + initValue);
        this.statement("");
    }
    child(sub) {
        if (!sub)
            sub = this.createGenerator();
        this.tokens.push(Token.GOSUB);
        this.children.push(sub);
        return sub;
    }
    inline(str) {
        this.tokens.push(Token.STRING);
        this.text.push(str);
    }
    statement(str) {
        this.line(str + ";");
    }
    breakLine() {
        this.tokens.push(Token.NEWLINE);
    }
    indent() {
        this.tokens.push(Token.INDENT);
    }
    unindent() {
        this.tokens.push(Token.UNINDENT);
    }
    function(name, returnType, args, isStatic, func) {
        const sub = this.createGenerator();
        sub.setTag("_type", "function-body");
        sub.setTag("_name", name);
        sub.setTag("_isStatic", isStatic);
        sub.setTag("_returnType", returnType);
        if (isStatic)
            this.inline("static ");
        this.inline(returnType + " " + name + "(");
        this.inline(args.map(x => x.type + " " + x.name).join(", "));
        this.inline(") {");
        this.breakLine();
        this.indent();
        this.child(sub);
        this.unindent();
        this.line("}");
        this.breakLine();
        if (func)
            func(sub);
        return sub;
    }
    if(condition, funIf) {
        this.line("if(" + condition + ") {");
        this.indent();
        const sub = this.createGenerator();
        sub.setTag("_type", "if-body");
        sub.setTag("_condition", condition);
        this.child(sub);
        this.unindent();
        this.line("}");
        if (funIf)
            funIf(sub);
        return sub;
    }
    else(funElse) {
        this.line("else {");
        this.indent();
        const sub = this.createGenerator();
        sub.setTag("_type", "else-body");
        this.child(sub);
        this.unindent();
        this.line("}");
        if (funElse)
            funElse(sub);
        return sub;
    }
    returnExp(exp) {
        this.statement("return " + exp);
    }
    include(name) {
        this.line("#include <" + name + ">");
    }
    for(indexVar, lengthVar) {
        this.line(`for(int ${indexVar}; i < ${lengthVar}; i++){`);
        this.indent();
        const child = this.child();
        this.unindent();
        this.line("}");
        return child;
    }
    header(guard, fun) {
        this.line("#ifndef " + guard);
        this.line("#define " + guard);
        this.breakLine();
        const sub = this.child();
        sub.setTag("_type", "header-body");
        sub.setTag("_guardName", guard);
        this.line("#endif // " + guard);
        if (fun)
            fun(sub);
        return sub;
    }
    declareStruct(structName, varName, values, isStatic = false) {
        if (isStatic)
            this.inline("static ");
        this.statement(`${structName} ${varName} = { ${values.join(', ')} }`);
    }
    switch(switchVar) {
        this.line(`switch(${switchVar}) {`);
        this.indent();
        const body = this.child();
        this.unindent();
        this.line("}");
        return body;
    }
    case(value) {
        this.line(`case ${value}:`);
    }
    defaultBreak() {
        this.line("default:");
        this.line("{");
        this.indent();
        const body = this.child();
        this.statement("break");
        this.unindent();
        this.line("}");
        return body;
    }
    caseBreak(value) {
        this.case(value);
        this.line("{");
        this.indent();
        const body = this.child();
        this.statement("break");
        this.unindent();
        this.line("}");
        return body;
    }
}
exports.GenericCodeGenerator = GenericCodeGenerator;
class CodeGenerator extends GenericCodeGenerator {
    createGenerator() {
        return new CodeGenerator();
    }
}
exports.CodeGenerator = CodeGenerator;


/***/ }),

/***/ "./src/header-parser.ts":
/*!******************************!*\
  !*** ./src/header-parser.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeaderParser = void 0;
class HeaderParser {
    parseEnums(input) {
        const matches = [...input.matchAll(/((?:\/\/.+\n)*)typedef enum {\n([^}]+)} ([^;]+)/gm)];
        return matches.map(groups => {
            return {
                description: this.parseComments(groups[1]),
                values: this.parseEnumValues(groups[2]),
                name: groups[3],
            };
        });
    }
    parseEnumValues(input) {
        let lastNumber = 0;
        return input.split('\n')
            .map(line => line.trim().match(/([^ ,]+)(?: = ([0-9]+))?,?(?: *)(?:\/\/ (.+))?/))
            .filter(x => x !== null && !x[0].startsWith("/"))
            .map(groups => {
            let val = lastNumber = groups[2] ? parseInt(groups[2]) : lastNumber;
            lastNumber++;
            return {
                name: groups[1],
                description: groups[3] || "",
                value: val
            };
        });
    }
    parseComments(input) {
        return input.split('\n').map(x => x.replace("// ", "")).join('\n').trim();
    }
    parseFunctionDefinitions(input) {
        const matches = [...input.matchAll(/^[A-Z]+ (.+?)(\w+)\(([^\)]+)\);(?: +\/\/ (.+))?$/gm)];
        return matches.map(groups => ({
            returnType: groups[1].trim(),
            name: groups[2],
            params: this.parseFunctionArgs(groups[3]),
            description: groups[4] || ""
        }));
    }
    parseFunctions(input, noPrefix = false) {
        const matches = noPrefix
            ? [...input.matchAll(/((?:\/\/.+\n)+)^(.+?)(\w+)\(([^\)]+)\)/gm)]
            : [...input.matchAll(/((?:\/\/.+\n)+)^[A-Z]+ (.+?)(\w+)\(([^\)]+)\)/gm)];
        return matches.map(groups => ({
            returnType: groups[2].trim(),
            name: groups[3],
            params: this.parseFunctionArgs(groups[4]),
            description: groups[1] ? this.parseComments(groups[1]) : ""
        }));
    }
    parseFunctionArgs(input) {
        return input.split(',').filter(x => x !== 'void').map(arg => {
            arg = arg.trim().replace(" *", "* ");
            const frags = arg.split(' ');
            const name = frags.pop();
            const type = frags.join(' ').replace("*", " *");
            return { name: name || "", type: type.trim() };
        });
    }
}
exports.HeaderParser = HeaderParser;


/***/ }),

/***/ "./src/quickjs.ts":
/*!************************!*\
  !*** ./src/quickjs.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuickJsGenerator = exports.GenericQuickJsGenerator = exports.QuickJsHeader = void 0;
const fs_1 = __webpack_require__(/*! fs */ "fs");
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
class QuickJsHeader {
    constructor(name) {
        this.name = name;
        this.structLookup = {};
        const root = this.root = new QuickJsGenerator();
        const body = this.body = root.header("JS_" + this.name + "_GUARD");
        const includes = this.includes = body.child();
        includes.include("stdio.h");
        includes.include("stdlib.h");
        includes.include("string.h");
        includes.breakLine();
        includes.include("quickjs.h");
        body.breakLine();
        body.line("#ifndef countof");
        body.line("#define countof(x) (sizeof(x) / sizeof((x)[0]))");
        body.line("#endif");
        body.breakLine();
        this.definitions = body.child();
        body.breakLine();
        this.structs = body.child();
        this.functions = body.child();
        this.moduleFunctionList = body.jsFunctionList("js_" + name + "_funcs");
        const moduleInitFunc = body.function("js_" + this.name + "_init", "int", [{ type: "JSContext *", name: "ctx" }, { type: "JSModuleDef *", name: "m" }], true);
        const moduleInit = this.moduleInit = moduleInitFunc.child();
        moduleInit.statement(`JS_SetModuleExportList(ctx, m,${this.moduleFunctionList.getTag("_name")},countof(${this.moduleFunctionList.getTag("_name")}))`);
        moduleInitFunc.returnExp("0");
        const moduleEntryFunc = body.function("js_init_module_" + this.name, "JSModuleDef *", [{ type: "JSContext *", name: "ctx" }, { type: "const char *", name: "module_name" }], false);
        const moduleEntry = this.moduleEntry = moduleEntryFunc.child();
        moduleEntry.statement("JSModuleDef *m");
        moduleEntry.statement(`m = JS_NewCModule(ctx, module_name, ${moduleInitFunc.getTag("_name")})`);
        moduleEntry.statement("if(!m) return NULL");
        moduleEntry.statement(`JS_AddModuleExportList(ctx, m, ${this.moduleFunctionList.getTag("_name")}, countof(${this.moduleFunctionList.getTag("_name")}))`);
        moduleEntryFunc.statement("return m");
    }
    registerStruct(struct, classId) {
        this.structLookup[struct] = classId;
    }
    writeTo(filename) {
        const writer = new generation_1.CodeWriter();
        writer.writeGenerator(this.root);
        (0, fs_1.writeFileSync)(filename, writer.toString());
    }
}
exports.QuickJsHeader = QuickJsHeader;
class GenericQuickJsGenerator extends generation_1.GenericCodeGenerator {
    jsBindingFunction(jsName) {
        const args = [
            { type: "JSContext *", name: "ctx" },
            { type: "JSValueConst", name: "this_val" },
            { type: "int", name: "argc" },
            { type: "JSValueConst *", name: "argv" },
        ];
        const sub = this.function("js_" + jsName, "JSValue", args, true);
        return sub;
    }
    jsToC(type, name, src, classIds = {}, supressDeclaration = false, typeAlias) {
        switch (typeAlias ?? type) {
            // Array Buffer
            case "const void *":
            case "void *":
            case "float *":
            case "unsigned short *":
            case "unsigned char *":
            case "const unsigned char *":
                this.declare(name + "_size", "size_t");
                this.declare(name + "_js", "void *", false, `(void *)JS_GetArrayBuffer(ctx, &${name}_size, ${src})`);
                this.if(name + "_js == NULL").returnExp("JS_EXCEPTION");
                this.declare(name, type, false, "malloc(" + name + "_size)");
                this.call("memcpy", ["(void *)" + name, "(const void *)" + name + "_js", name + "_size"]);
                break;
            // String
            case "const char *":
                //case "char *":
                if (!supressDeclaration)
                    this.statement(`${type} ${name} = JS_IsNull(${src}) ? NULL : (${type})JS_ToCString(ctx, ${src})`);
                else
                    this.statement(`${name} = JS_IsNull(${src}) ? NULL : (${type})JS_ToCString(ctx, ${src})`);
                break;
            case "double":
                if (!supressDeclaration)
                    this.statement(`${type} ${name}`);
                this.statement(`JS_ToFloat64(ctx, &${name}, ${src})`);
                break;
            case "float":
                this.statement("double _double_" + name);
                this.statement(`JS_ToFloat64(ctx, &_double_${name}, ${src})`);
                if (!supressDeclaration)
                    this.statement(`${type} ${name} = (${type})_double_${name}`);
                else
                    this.statement(`${name} = (${type})_double_${name}`);
                break;
            case "int":
                if (!supressDeclaration)
                    this.statement(`${type} ${name}`);
                this.statement(`JS_ToInt32(ctx, &${name}, ${src})`);
                break;
            case "unsigned int":
                if (!supressDeclaration)
                    this.statement(`${type} ${name}`);
                this.statement(`JS_ToUint32(ctx, &${name}, ${src})`);
                break;
            case "unsigned char":
                this.statement("unsigned int _int_" + name);
                this.statement(`JS_ToUint32(ctx, &_int_${name}, ${src})`);
                if (!supressDeclaration)
                    this.statement(`${type} ${name} = (${type})_int_${name}`);
                else
                    this.statement(`${name} = (${type})_int_${name}`);
                break;
            case "bool":
                if (!supressDeclaration)
                    this.statement(`${type} ${name} = JS_ToBool(ctx, ${src})`);
                else
                    this.statement(`${name} = JS_ToBool(ctx, ${src})`);
                break;
            default:
                const isConst = type.startsWith('const');
                const isPointer = type.endsWith(' *');
                const classId = classIds[type.replace("const ", "").replace(" *", "")];
                if (!classId)
                    throw new Error("Cannot convert into parameter type: " + type);
                const suffix = isPointer ? "" : "_ptr";
                this.jsOpqToStructPtr(type.replace(" *", ""), name + suffix, src, classId);
                this.statement(`if(${name + suffix} == NULL) return JS_EXCEPTION`);
                if (!isPointer)
                    this.declare(name, type, false, `*${name}_ptr`);
        }
    }
    jsToJs(type, name, src, classIds = {}) {
        switch (type) {
            case "int":
            case "long":
                this.declare(name, 'JSValue', false, `JS_NewInt32(ctx, ${src})`);
                break;
            case "long":
                this.declare(name, 'JSValue', false, `JS_NewInt64(ctx, ${src})`);
                break;
            case "unsigned int":
            case "unsigned char":
                this.declare(name, 'JSValue', false, `JS_NewUint32(ctx, ${src})`);
                break;
            case "bool":
                this.declare(name, 'JSValue', false, `JS_NewBool(ctx, ${src})`);
                break;
            case "float":
            case "double":
                this.declare(name, 'JSValue', false, `JS_NewFloat64(ctx, ${src})`);
                break;
            case "const char *":
            case "char *":
                this.declare(name, 'JSValue', false, `JS_NewString(ctx, ${src})`);
                break;
            // case "unsigned char *":
            //     this.declare(name, 'JSValue', false, `JS_NewString(ctx, ${src})`)
            //     break;
            default:
                const classId = classIds[type];
                if (!classId)
                    throw new Error("Cannot convert parameter type to Javascript: " + type);
                this.jsStructToOpq(type, name, src, classId);
        }
    }
    jsStructToOpq(structType, jsVar, srcVar, classId) {
        this.declare(jsVar + "_ptr", structType + "*", false, `(${structType}*)js_malloc(ctx, sizeof(${structType}))`);
        this.statement("*" + jsVar + "_ptr = " + srcVar);
        this.declare(jsVar, "JSValue", false, `JS_NewObjectClass(ctx, ${classId})`);
        this.call("JS_SetOpaque", [jsVar, jsVar + "_ptr"]);
    }
    jsCleanUpParameter(type, name) {
        switch (type) {
            case "char *":
            case "const char *":
                this.statement(`JS_FreeCString(ctx, ${name})`);
                break;
            case "const void *":
            case "void *":
            case "float *":
            case "unsigned short *":
            case "unsigned char *":
            case "const unsigned char *":
                this.statement(`free((void *)${name})`);
                break;
            default:
                break;
        }
    }
    jsFunctionList(name) {
        this.line("static const JSCFunctionListEntry " + name + "[] = {");
        this.indent();
        const sub = this.createGenerator();
        sub.setTag("_type", "js-function-list");
        sub.setTag("_name", name);
        this.child(sub);
        this.unindent();
        this.statement("}");
        this.breakLine();
        return sub;
    }
    jsFuncDef(jsName, numArgs, cName) {
        this.line(`JS_CFUNC_DEF("${jsName}",${numArgs},${cName}),`);
    }
    jsClassId(id) {
        this.declare(id, "JSClassID", true);
        return id;
    }
    jsPropStringDef(key, value) {
        this.line(`JS_PROP_STRING_DEF("${key}","${value}", JS_PROP_CONFIGURABLE),`);
    }
    jsGetSetDef(key, getFunc, setFunc) {
        this.line(`JS_CGETSET_DEF("${key}",${getFunc || "NULL"},${setFunc || "NULL"}),`);
    }
    jsStructFinalizer(classId, structName, onFinalize) {
        const args = [{ type: "JSRuntime *", name: "rt" }, { type: "JSValue", name: "val" }];
        const body = this.function(`js_${structName}_finalizer`, "void", args, true);
        body.statement(`${structName}* ptr = JS_GetOpaque(val, ${classId})`);
        body.if("ptr", cond => {
            //cond.call("TraceLog", ["LOG_INFO",`"Finalize ${structName} %p"`,"ptr"])
            if (onFinalize)
                onFinalize(cond, "ptr");
            cond.call("js_free_rt", ["rt", "ptr"]);
        });
        return body;
    }
    jsClassDeclaration(structName, classId, finalizerName, funcListName) {
        const body = this.function("js_declare_" + structName, "int", [{ type: "JSContext *", name: "ctx" }, { type: "JSModuleDef *", name: "m" }], true);
        body.call("JS_NewClassID", ["&" + classId]);
        const classDefName = `js_${structName}_def`;
        body.declare(classDefName, "JSClassDef", false, `{ .class_name = "${structName}", .finalizer = ${finalizerName} }`);
        body.call("JS_NewClass", ["JS_GetRuntime(ctx)", classId, "&" + classDefName]);
        body.declare("proto", "JSValue", false, "JS_NewObject(ctx)");
        body.call("JS_SetPropertyFunctionList", ["ctx", "proto", funcListName, `countof(${funcListName})`]);
        body.call("JS_SetClassProto", ["ctx", classId, "proto"]);
        body.statement("return 0");
        return body;
    }
    jsStructGetter(structName, classId, field, type, classIds) {
        const args = [{ type: "JSContext*", name: "ctx" }, { type: "JSValueConst", name: "this_val" }];
        const fun = this.function(`js_${structName}_get_${field}`, "JSValue", args, true);
        fun.declare("ptr", structName + "*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`);
        fun.declare(field, type, false, "ptr->" + field);
        fun.jsToJs(type, "ret", field, classIds);
        fun.returnExp("ret");
        return fun;
    }
    jsStructSetter(structName, classId, field, type, classIds) {
        const args = [{ type: "JSContext*", name: "ctx" }, { type: "JSValueConst", name: "this_val" }, { type: "JSValueConst", name: "v" }];
        const fun = this.function(`js_${structName}_set_${field}`, "JSValue", args, true);
        fun.declare("ptr", structName + "*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`);
        fun.jsToC(type, "value", "v", classIds);
        fun.statement("ptr->" + field + " = value");
        fun.returnExp("JS_UNDEFINED");
        return fun;
    }
    jsOpqToStructPtr(structType, structVar, srcVar, classId) {
        this.declare(structVar, structType + "*", false, `(${structType}*)JS_GetOpaque2(ctx, ${srcVar}, ${classId})`);
    }
    jsStructConstructor(structName, fields, classId, classIds) {
        const body = this.jsBindingFunction(structName + "_constructor");
        for (let i = 0; i < fields.length; i++) {
            const para = fields[i];
            body.jsToC(para.type, para.name, "argv[" + i + "]", classIds);
        }
        body.declareStruct(structName, "_struct", fields.map(x => x.name));
        body.jsStructToOpq(structName, "_return", "_struct", classId);
        body.returnExp("_return");
        return body;
    }
}
exports.GenericQuickJsGenerator = GenericQuickJsGenerator;
class QuickJsGenerator extends GenericQuickJsGenerator {
    createGenerator() {
        return new QuickJsGenerator();
    }
}
exports.QuickJsGenerator = QuickJsGenerator;


/***/ }),

/***/ "./src/raylib-header.ts":
/*!******************************!*\
  !*** ./src/raylib-header.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayLibHeader = void 0;
const quickjs_1 = __webpack_require__(/*! ./quickjs */ "./src/quickjs.ts");
const typescript_1 = __webpack_require__(/*! ./typescript */ "./src/typescript.ts");
class RayLibHeader extends quickjs_1.QuickJsHeader {
    constructor(name) {
        super(name);
        this.typings = new typescript_1.TypeScriptDeclaration();
        this.includes.include("raylib.h");
        //this.includes.line("#define RAYMATH_IMPLEMENTATION")
    }
    addApiFunction(api) {
        const options = api.binding || {};
        if (options.ignore)
            return;
        const jName = options.jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1);
        console.log("Binding function " + api.name);
        const fun = this.functions.jsBindingFunction(jName);
        if (options.body) {
            options.body(fun);
        }
        else {
            if (options.before)
                options.before(fun);
            // read parameters
            api.params = api.params || [];
            for (let i = 0; i < api.params.length; i++) {
                if (api.params[i]?.binding?.ignore)
                    continue;
                const para = api.params[i];
                if (para.binding?.customConverter)
                    para.binding.customConverter(fun);
                else
                    fun.jsToC(para.type, para.name, "argv[" + i + "]", this.structLookup, false, para.binding?.typeAlias);
            }
            // call c function
            if (options.customizeCall)
                fun.line(options.customizeCall);
            else
                fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : { type: api.returnType, name: "returnVal" });
            // clean up parameters
            for (const param of api.params) {
                if (param.binding?.customCleanup)
                    param.binding.customCleanup(fun);
                else
                    fun.jsCleanUpParameter(param.type, param.name);
            }
            // return result
            if (api.returnType === "void") {
                if (options.after)
                    options.after(fun);
                fun.statement("return JS_UNDEFINED");
            }
            else {
                fun.jsToJs(api.returnType, "ret", "returnVal", this.structLookup);
                if (options.after)
                    options.after(fun);
                fun.returnExp("ret");
            }
        }
        // add binding to function declaration
        this.moduleFunctionList.jsFuncDef(jName, (api.params || []).filter(x => !x.binding?.ignore).length, fun.getTag("_name"));
        this.typings.addFunction(jName, api);
    }
    addEnum(renum) {
        console.log("Binding enum " + renum.name);
        renum.values.forEach(x => this.exportGlobalConstant(x.name, x.description));
    }
    addApiStruct(struct) {
        const options = struct.binding || {};
        console.log("Binding struct " + struct.name);
        const classId = this.definitions.jsClassId(`js_${struct.name}_class_id`);
        this.registerStruct(struct.name, classId);
        options.aliases?.forEach(x => this.registerStruct(x, classId));
        const finalizer = this.structs.jsStructFinalizer(classId, struct.name, (gen, ptr) => options.destructor && gen.call(options.destructor.name, ["*" + ptr]));
        const propDeclarations = this.structs.createGenerator();
        if (options && options.properties) {
            for (const field of Object.keys(options.properties)) {
                const type = struct.fields.find(x => x.name === field)?.type;
                if (!type)
                    throw new Error(`Struct ${struct.name} does not contain field ${field}`);
                const el = options.properties[field];
                let _get = undefined;
                let _set = undefined;
                if (el.get)
                    _get = this.structs.jsStructGetter(struct.name, classId, field, type, /*Be carefull when allocating memory in a getter*/ this.structLookup);
                if (el.set)
                    _set = this.structs.jsStructSetter(struct.name, classId, field, type, this.structLookup);
                propDeclarations.jsGetSetDef(field, _get?.getTag("_name"), _set?.getTag("_name"));
            }
        }
        const classFuncList = this.structs.jsFunctionList(`js_${struct.name}_proto_funcs`);
        classFuncList.child(propDeclarations);
        classFuncList.jsPropStringDef("[Symbol.toStringTag]", struct.name);
        const classDecl = this.structs.jsClassDeclaration(struct.name, classId, finalizer.getTag("_name"), classFuncList.getTag("_name"));
        this.moduleInit.call(classDecl.getTag("_name"), ["ctx", "m"]);
        if (options?.createConstructor || options?.createEmptyConstructor) {
            const body = this.functions.jsStructConstructor(struct.name, options?.createEmptyConstructor ? [] : struct.fields, classId, this.structLookup);
            this.moduleInit.statement(`JSValue ${struct.name}_constr = JS_NewCFunction2(ctx, ${body.getTag("_name")},"${struct.name})", ${struct.fields.length}, JS_CFUNC_constructor_or_func, 0)`);
            this.moduleInit.call("JS_SetModuleExport", ["ctx", "m", `"${struct.name}"`, struct.name + "_constr"]);
            this.moduleEntry.call("JS_AddModuleExport", ["ctx", "m", '"' + struct.name + '"']);
        }
        this.typings.addStruct(struct);
    }
    exportGlobalStruct(structName, exportName, values, description) {
        this.moduleInit.declareStruct(structName, exportName + "_struct", values);
        const classId = this.structLookup[structName];
        if (!classId)
            throw new Error("Struct " + structName + " not found in register");
        this.moduleInit.jsStructToOpq(structName, exportName + "_js", exportName + "_struct", classId);
        this.moduleInit.call("JS_SetModuleExport", ["ctx", "m", `"${exportName}"`, exportName + "_js"]);
        this.moduleEntry.call("JS_AddModuleExport", ["ctx", "m", `"${exportName}"`]);
        this.typings.constants.tsDeclareConstant(exportName, structName, description);
    }
    exportGlobalConstant(name, description) {
        this.moduleInit.statement(`JS_SetModuleExport(ctx, m, "${name}", JS_NewInt32(ctx, ${name}))`);
        this.moduleEntry.statement(`JS_AddModuleExport(ctx, m, "${name}")`);
        this.typings.constants.tsDeclareConstant(name, "number", description);
    }
}
exports.RayLibHeader = RayLibHeader;


/***/ }),

/***/ "./src/typescript.ts":
/*!***************************!*\
  !*** ./src/typescript.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypescriptGenerator = exports.GenericTypescriptGenerator = exports.TypeScriptDeclaration = void 0;
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
const fs_1 = __webpack_require__(/*! fs */ "fs");
class TypeScriptDeclaration {
    constructor() {
        this.root = new TypescriptGenerator();
        this.structs = this.root.child();
        this.functions = this.root.child();
        this.constants = this.root.child();
    }
    addFunction(name, api) {
        const options = api.binding || {};
        const para = (api.params || []).filter(x => !x.binding?.ignore).map(x => ({ name: x.name, type: x.binding?.jsType ?? this.toJsType(x.type) }));
        const returnType = options.jsReturns ?? this.toJsType(api.returnType);
        this.functions.tsDeclareFunction(name, para, returnType, api.description);
    }
    addStruct(api) {
        const options = api.binding || {};
        var fields = api.fields.filter(x => !!(options.properties || {})[x.name]).map(x => ({ name: x.name, description: x.description, type: this.toJsType(x.type) }));
        this.structs.tsDeclareInterface(api.name, fields);
        this.structs.tsDeclareType(api.name, !!(options.createConstructor || options.createEmptyConstructor), options.createEmptyConstructor ? [] : fields);
    }
    toJsType(type) {
        switch (type) {
            case "int":
            case "long":
            case "unsigned int":
            case "unsigned char":
            case "float":
            case "double":
                return "number";
            case "const unsigned char *":
            case "unsigned char *":
            case "unsigned short *":
            case "float *":
                return "ArrayBuffer";
            case "bool":
                return "boolean";
            case "const char *":
            case "char *":
                return "string";
            case "void *":
            case "const void *":
                return "any";
            case "Camera":
            case "Camera *":
                return "Camera3D";
            case "Texture2D":
            case "Texture2D *":
            case "TextureCubemap":
                return "Texture";
            case "RenderTexture2D":
            case "RenderTexture2D *":
                return "RenderTexture";
            case "Quaternion":
                return "Vector4";
            default:
                return type.replace(" *", "").replace("const ", "");
        }
    }
    writeTo(filename) {
        const writer = new generation_1.CodeWriter();
        writer.writeGenerator(this.root);
        (0, fs_1.writeFileSync)(filename, writer.toString());
    }
}
exports.TypeScriptDeclaration = TypeScriptDeclaration;
class GenericTypescriptGenerator extends generation_1.GenericCodeGenerator {
    tsDeclareFunction(name, parameters, returnType, description) {
        this.tsDocComment(description);
        this.statement(`declare function ${name}(${parameters.map(x => x.name + ': ' + x.type).join(', ')}): ${returnType}`);
    }
    tsDeclareConstant(name, type, description) {
        this.tsDocComment(description);
        this.statement(`declare var ${name}: ${type}`);
    }
    tsDeclareType(name, hasConstructor, parameters) {
        this.line(`declare var ${name}: {`);
        this.indent();
        this.statement("prototype: " + name);
        if (hasConstructor)
            this.statement(`new(${parameters.map(x => x.name + ": " + x.type).join(', ')}): ${name}`);
        this.unindent();
        this.line("}");
    }
    tsDeclareInterface(name, fields) {
        this.line(`interface ${name} {`);
        this.indent();
        for (const field of fields) {
            if (field.description)
                this.tsDocComment(field.description);
            this.line(field.name + ": " + field.type + ",");
        }
        this.unindent();
        this.line("}");
    }
    tsDocComment(comment) {
        this.line(`/** ${comment} */`);
    }
}
exports.GenericTypescriptGenerator = GenericTypescriptGenerator;
class TypescriptGenerator extends GenericTypescriptGenerator {
    createGenerator() {
        return new TypescriptGenerator();
    }
}
exports.TypescriptGenerator = TypescriptGenerator;


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __webpack_require__(/*! fs */ "fs");
const raylib_header_1 = __webpack_require__(/*! ./raylib-header */ "./src/raylib-header.ts");
const header_parser_1 = __webpack_require__(/*! ./header-parser */ "./src/header-parser.ts");
let api;
function getFunction(funList, name) {
    return funList.find(x => x.name === name);
}
function getStruct(strList, name) {
    return strList.find(x => x.name === name);
}
function getAliases(aliasList, name) {
    return aliasList.filter(x => x.type === name).map(x => x.name);
}
function ignore(name) {
    getFunction(api.functions, name).binding = { ignore: true };
}
function main() {
    // Load the pre-generated raylib api
    api = JSON.parse((0, fs_1.readFileSync)("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'));
    const parser = new header_parser_1.HeaderParser();
    const rmathHeader = (0, fs_1.readFileSync)("thirdparty/raylib/src/raymath.h", "utf8");
    const mathApi = parser.parseFunctions(rmathHeader);
    mathApi.forEach(x => api.functions.push(x));
    const rcameraHeader = (0, fs_1.readFileSync)("thirdparty/raylib/src/rcamera.h", "utf8");
    const cameraApi = parser.parseFunctionDefinitions(rcameraHeader);
    cameraApi.forEach(x => api.functions.push(x));
    const rguiHeader = (0, fs_1.readFileSync)("thirdparty/raygui/src/raygui.h", "utf8");
    const rguiFunctions = parser.parseFunctionDefinitions(rguiHeader);
    const rguiEnums = parser.parseEnums(rguiHeader);
    //rguiApi.forEach(x => console.log(`core.addApiFunctionByName("${x.name}")`))
    rguiFunctions.forEach(x => api.functions.push(x));
    rguiEnums.forEach(x => api.enums.push(x));
    const rlightsHeader = (0, fs_1.readFileSync)("include/rlights.h", "utf8");
    const rlightsFunctions = parser.parseFunctions(rlightsHeader, true);
    api.functions.push(rlightsFunctions[0]);
    api.functions.push(rlightsFunctions[1]);
    const reasingsHeader = (0, fs_1.readFileSync)("include/reasings.h", "utf8");
    const reasingsFunctions = parser.parseFunctions(reasingsHeader);
    reasingsFunctions.forEach(x => api.functions.push(x));
    // Custom Rayjs functions
    api.functions.push({
        name: "SetModelMaterial",
        description: "Replace material in slot materialIndex",
        returnType: "void",
        params: [{ type: "Model *", name: "model" }, { type: "int", name: "materialIndex" }, { type: "Material", name: "material" }]
    });
    // Define a new header
    const core = new raylib_header_1.RayLibHeader("raylib_core");
    core.includes.include("raymath.h");
    core.includes.include("rcamera.h");
    core.includes.line("#define RAYGUI_IMPLEMENTATION");
    core.includes.include("raygui.h");
    core.includes.line("#define RLIGHTS_IMPLEMENTATION");
    core.includes.include("rlights.h");
    core.includes.include("reasings.h");
    getStruct(api.structs, "Color").binding = {
        properties: {
            r: { get: true, set: true },
            g: { get: true, set: true },
            b: { get: true, set: true },
            a: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Rectangle").binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            width: { get: true, set: true },
            height: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Vector2").binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Vector3").binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Vector4").binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
            w: { get: true, set: true },
        },
        createConstructor: true,
        aliases: getAliases(api.aliases, "Vector4")
    };
    getStruct(api.structs, "Ray").binding = {
        properties: {
            position: { get: false, set: true },
            direction: { get: false, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "RayCollision").binding = {
        properties: {
            hit: { get: true, set: false },
            distance: { get: true, set: false },
            point: { get: true, set: false },
            normal: { get: true, set: false },
        },
        createConstructor: false
    };
    getStruct(api.structs, "Camera2D").binding = {
        properties: {
            offset: { get: true, set: true },
            target: { get: true, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Camera3D").binding = {
        properties: {
            position: { get: true, set: true },
            target: { get: true, set: true },
            up: { get: false, set: true },
            fovy: { get: true, set: true },
            projection: { get: true, set: true },
        },
        createConstructor: true,
        aliases: getAliases(api.aliases, "Camera3D")
    };
    getStruct(api.structs, "BoundingBox").binding = {
        properties: {
            min: { get: true, set: true },
            max: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Matrix").binding = {
        properties: {},
        createConstructor: false
    };
    getStruct(api.structs, "NPatchInfo").binding = {
        properties: {
            source: { get: true, set: true },
            left: { get: true, set: true },
            top: { get: true, set: true },
            right: { get: true, set: true },
            bottom: { get: true, set: true },
            layout: { get: true, set: true },
        },
        createConstructor: true
    };
    getStruct(api.structs, "Image").binding = {
        properties: {
            //data: { set: true },
            width: { get: true },
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true }
        },
        //destructor: "UnloadImage"
    };
    getStruct(api.structs, "Wave").binding = {
        properties: {
            frameCount: { get: true },
            sampleRate: { get: true },
            sampleSize: { get: true },
            channels: { get: true }
        },
        //destructor: "UnloadWave"
    };
    getStruct(api.structs, "Sound").binding = {
        properties: {
            frameCount: { get: true }
        },
        //destructor: "UnloadSound"
    };
    getStruct(api.structs, "Music").binding = {
        properties: {
            frameCount: { get: true },
            looping: { get: true, set: true },
            ctxType: { get: true },
        },
        //destructor: "UnloadMusicStream"
    };
    getStruct(api.structs, "Model").binding = {
        properties: {
            transform: { get: true, set: true },
            meshCount: { get: true },
            materialCount: { get: true },
            boneCount: { get: true },
        },
        //destructor: "UnloadModel"
    };
    getStruct(api.structs, "Mesh").binding = {
        properties: {
            vertexCount: { get: true, set: true },
            triangleCount: { get: true, set: true },
            // TODO: Free previous pointers before overwriting
            vertices: { set: true },
            texcoords: { set: true },
            texcoords2: { set: true },
            normals: { set: true },
            tangents: { set: true },
            colors: { set: true },
            indices: { set: true },
            animVertices: { set: true },
            animNormals: { set: true },
            boneIds: { set: true },
            boneWeights: { set: true },
        },
        createEmptyConstructor: true
        //destructor: "UnloadMesh"
    };
    getStruct(api.structs, "Shader").binding = {
        properties: {
            id: { get: true }
        },
        //destructor: "UnloadShader"
    };
    getStruct(api.structs, "Texture").binding = {
        properties: {
            width: { get: true },
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true },
        },
        aliases: getAliases(api.aliases, "Texture")
        //destructor: "UnloadTexture"
    };
    getStruct(api.structs, "Font").binding = {
        properties: {
            baseSize: { get: true },
            glyphCount: { get: true },
            glyphPadding: { get: true },
        },
        //destructor: "UnloadFont"
    };
    getStruct(api.structs, "RenderTexture").binding = {
        properties: {
            id: { get: true }
        },
        aliases: getAliases(api.aliases, "RenderTexture")
        //destructor: "UnloadRenderTexture"
    };
    getStruct(api.structs, "MaterialMap").binding = {
        properties: {
            texture: { set: true },
            color: { set: true, get: true },
            value: { get: true, set: true }
        },
        //destructor: "UnloadMaterialMap"
    };
    getStruct(api.structs, "Material").binding = {
        properties: {
            shader: { set: true }
        },
        //destructor: "UnloadMaterial"
    };
    ignore("SetWindowIcons");
    ignore("GetWindowHandle");
    // Custom frame control functions
    // NOT SUPPORTED BECAUSE NEEDS COMPILER FLAG
    ignore("SwapScreenBuffer");
    ignore("PollInputEvents");
    ignore("WaitTime");
    ignore("BeginVrStereoMode");
    ignore("EndVrStereoMode");
    ignore("LoadVrStereoConfig");
    ignore("UnloadVrStereoConfig");
    getFunction(api.functions, "SetShaderValue").binding = { body: (gen) => {
            gen.jsToC("Shader", "shader", "argv[0]", core.structLookup);
            gen.jsToC("int", "locIndex", "argv[1]", core.structLookup);
            gen.declare("value", "void *", false, "NULL");
            gen.declare("valueFloat", "float");
            gen.declare("valueInt", "int");
            gen.jsToC("int", "uniformType", "argv[3]", core.structLookup);
            const sw = gen.switch("uniformType");
            let b = sw.caseBreak("SHADER_UNIFORM_FLOAT");
            b.jsToC("float", "valueFloat", "argv[2]", core.structLookup, true);
            b.statement("value = (void *)&valueFloat");
            b = sw.caseBreak("SHADER_UNIFORM_VEC2");
            b.jsToC("Vector2 *", "valueV2", "argv[2]", core.structLookup);
            b.statement("value = (void*)valueV2");
            b = sw.caseBreak("SHADER_UNIFORM_VEC3");
            b.jsToC("Vector3 *", "valueV3", "argv[2]", core.structLookup);
            b.statement("value = (void*)valueV3");
            b = sw.caseBreak("SHADER_UNIFORM_VEC4");
            b.jsToC("Vector4 *", "valueV4", "argv[2]", core.structLookup);
            b.statement("value = (void*)valueV4");
            b = sw.caseBreak("SHADER_UNIFORM_INT");
            b.jsToC("int", "valueInt", "argv[2]", core.structLookup, true);
            b.statement("value = (void*)&valueInt");
            b = sw.defaultBreak();
            b.returnExp("JS_EXCEPTION");
            gen.call("SetShaderValue", ["shader", "locIndex", "value", "uniformType"]);
            gen.returnExp("JS_UNDEFINED");
        } };
    ignore("SetShaderValueV");
    const traceLog = getFunction(api.functions, "TraceLog");
    traceLog.params?.pop();
    // Memory functions not supported on JS, just use ArrayBuffer
    ignore("MemAlloc");
    ignore("MemRealloc");
    ignore("MemFree");
    // Callbacks not supported on JS
    ignore("SetTraceLogCallback");
    ignore("SetLoadFileDataCallback");
    ignore("SetSaveFileDataCallback");
    ignore("SetLoadFileTextCallback");
    ignore("SetSaveFileTextCallback");
    // Files management functions
    const lfd = getFunction(api.functions, "LoadFileData");
    lfd.params[lfd.params.length - 1].binding = { ignore: true };
    lfd.binding = {
        body: gen => {
            gen.jsToC("const char *", "fileName", "argv[0]");
            gen.declare("bytesRead", "unsigned int");
            gen.call("LoadFileData", ["fileName", "&bytesRead"], { type: "unsigned char *", name: "retVal" });
            gen.statement("JSValue buffer = JS_NewArrayBufferCopy(ctx, (const uint8_t*)retVal, bytesRead)");
            gen.call("UnloadFileData", ["retVal"]);
            gen.jsCleanUpParameter("const char*", "fileName");
            gen.returnExp("buffer");
        }
    };
    ignore("UnloadFileData");
    // TODO: SaveFileData works but unnecessary makes copy of memory
    getFunction(api.functions, "SaveFileData").binding = {};
    ignore("ExportDataAsCode");
    getFunction(api.functions, "LoadFileText").binding = { after: gen => gen.call("UnloadFileText", ["returnVal"]) };
    getFunction(api.functions, "SaveFileText").params[1].binding = { typeAlias: "const char *" };
    ignore("UnloadFileText");
    const createFileList = (gen, loadName, unloadName, args) => {
        gen.call(loadName, args, { type: "FilePathList", name: "files" });
        gen.call("JS_NewArray", ["ctx"], { type: "JSValue", name: "ret" });
        const f = gen.for("i", "files.count");
        f.call("JS_SetPropertyUint32", ["ctx", "ret", "i", "JS_NewString(ctx,files.paths[i])"]);
        gen.call(unloadName, ["files"]);
    };
    getFunction(api.functions, "LoadDirectoryFiles").binding = {
        jsReturns: "string[]",
        body: gen => {
            gen.jsToC("const char *", "dirPath", "argv[0]");
            createFileList(gen, "LoadDirectoryFiles", "UnloadDirectoryFiles", ["dirPath"]);
            gen.jsCleanUpParameter("const char *", "dirPath");
            gen.returnExp("ret");
        }
    };
    getFunction(api.functions, "LoadDirectoryFilesEx").binding = {
        jsReturns: "string[]",
        body: gen => {
            gen.jsToC("const char *", "basePath", "argv[0]");
            gen.jsToC("const char *", "filter", "argv[1]");
            gen.jsToC("bool", "scanSubdirs", "argv[2]");
            createFileList(gen, "LoadDirectoryFilesEx", "UnloadDirectoryFiles", ["basePath", "filter", "scanSubdirs"]);
            gen.jsCleanUpParameter("const char *", "basePath");
            gen.jsCleanUpParameter("const char *", "filter");
            gen.returnExp("ret");
        }
    };
    ignore("UnloadDirectoryFiles");
    getFunction(api.functions, "LoadDroppedFiles").binding = {
        jsReturns: "string[]",
        body: gen => {
            createFileList(gen, "LoadDroppedFiles", "UnloadDroppedFiles", []);
            gen.returnExp("ret");
        }
    };
    ignore("UnloadDroppedFiles");
    // Compression/encoding functionality
    ignore("CompressData");
    ignore("DecompressData");
    ignore("EncodeDataBase64");
    ignore("DecodeDataBase64");
    ignore("DrawLineStrip");
    ignore("DrawTriangleFan");
    ignore("DrawTriangleStrip");
    ignore("CheckCollisionPointPoly");
    ignore("CheckCollisionLines");
    ignore("LoadImageAnim");
    ignore("ExportImageAsCode");
    getFunction(api.functions, "LoadImageColors").binding = {
        jsReturns: "ArrayBuffer",
        body: gen => {
            gen.jsToC("Image", "image", "argv[0]", core.structLookup);
            gen.call("LoadImageColors", ["image"], { name: "colors", type: "Color *" });
            gen.statement("JSValue retVal = JS_NewArrayBufferCopy(ctx, (const uint8_t*)colors, image.width*image.height*sizeof(Color))");
            gen.call("UnloadImageColors", ["colors"]);
            gen.returnExp("retVal");
        }
    };
    ignore("LoadImagePalette");
    ignore("UnloadImageColors");
    ignore("UnloadImagePalette");
    ignore("GetPixelColor");
    ignore("SetPixelColor");
    const lfx = getFunction(api.functions, "LoadFontEx");
    lfx.params[2].binding = { ignore: true };
    lfx.params[3].binding = { ignore: true };
    lfx.binding = { customizeCall: "Font returnVal = LoadFontEx(fileName, fontSize, NULL, 0);" };
    ignore("LoadFontFromMemory");
    ignore("LoadFontData");
    ignore("GenImageFontAtlas");
    ignore("UnloadFontData");
    ignore("ExportFontAsCode");
    ignore("DrawTextCodepoints");
    ignore("GetGlyphInfo");
    ignore("LoadUTF8");
    ignore("UnloadUTF8");
    ignore("LoadCodepoints");
    ignore("UnloadCodepoints");
    ignore("GetCodepointCount");
    ignore("GetCodepoint");
    ignore("GetCodepointNext");
    ignore("GetCodepointPrevious");
    ignore("CodepointToUTF8");
    // Not supported, use JS Stdlib instead
    api.functions.filter(x => x.name.startsWith("Text")).forEach(x => ignore(x.name));
    ignore("DrawTriangleStrip3D");
    ignore("LoadMaterials");
    ignore("LoadModelAnimations");
    ignore("UpdateModelAnimation");
    ignore("UnloadModelAnimation");
    ignore("UnloadModelAnimations");
    ignore("IsModelAnimationValid");
    ignore("ExportWaveAsCode");
    // Wave/Sound management functions
    ignore("LoadWaveSamples");
    ignore("UnloadWaveSamples");
    ignore("LoadMusicStreamFromMemory");
    ignore("LoadAudioStream");
    ignore("IsAudioStreamReady");
    ignore("UnloadAudioStream");
    ignore("UpdateAudioStream");
    ignore("IsAudioStreamProcessed");
    ignore("PlayAudioStream");
    ignore("PauseAudioStream");
    ignore("ResumeAudioStream");
    ignore("IsAudioStreamPlaying");
    ignore("StopAudioStream");
    ignore("SetAudioStreamVolume");
    ignore("SetAudioStreamPitch");
    ignore("SetAudioStreamPan");
    ignore("SetAudioStreamBufferSizeDefault");
    ignore("SetAudioStreamCallback");
    ignore("AttachAudioStreamProcessor");
    ignore("DetachAudioStreamProcessor");
    ignore("AttachAudioMixedProcessor");
    ignore("DetachAudioMixedProcessor");
    ignore("Vector3OrthoNormalize");
    ignore("Vector3ToFloatV");
    ignore("MatrixToFloatV");
    ignore("QuaternionToAxisAngle");
    core.exportGlobalConstant("DEG2RAD", "(PI/180.0)");
    core.exportGlobalConstant("RAD2DEG", "(180.0/PI)");
    const setOutParam = (fun, index) => {
        const param = fun.params[index];
        param.binding = {
            jsType: `{ ${param.name}: number }`,
            customConverter: gen => {
                gen.declare(param.name + "_out", param.type.replace(" *", ""));
                gen.declare(param.name, param.type, false, "&" + param.name + "_out");
                gen.call("JS_GetPropertyStr", ["ctx", "argv[" + index + "]", '"' + param.name + '"'], { name: param.name + "_js", type: "JSValue" });
                gen.call("JS_ToInt32", ["ctx", param.name, param.name + "_js"]);
            },
            customCleanup: gen => {
                gen.call("JS_SetPropertyStr", ["ctx", "argv[" + index + "]", `"${param.name}"`, "JS_NewInt32(ctx," + param.name + "_out)"]);
            }
        };
    };
    const setOutParamString = (fun, index, indexLen) => {
        const lenParam = fun.params[indexLen];
        lenParam.binding = { ignore: true };
        const param = fun.params[index];
        param.binding = {
            jsType: `{ ${param.name}: string }`,
            customConverter: gen => {
                gen.call("JS_GetPropertyStr", ["ctx", "argv[" + index + "]", '"' + param.name + '"'], { name: param.name + "_js", type: "JSValue" });
                gen.declare(param.name + "_len", "size_t");
                gen.call("JS_ToCStringLen", ["ctx", "&" + param.name + "_len", param.name + "_js"], { name: param.name + "_val", type: "const char *" });
                gen.call("memcpy", ["(void *)textbuffer", param.name + "_val", param.name + "_len"]);
                gen.statement("textbuffer[" + param.name + "_len] = 0");
                gen.declare(param.name, param.type, false, "textbuffer");
                gen.declare(lenParam.name, lenParam.type, false, "4096");
            },
            customCleanup: gen => {
                gen.jsCleanUpParameter("const char *", param.name + "_val");
                gen.call("JS_SetPropertyStr", ["ctx", "argv[" + index + "]", `"${param.name}"`, "JS_NewString(ctx," + param.name + ")"]);
            }
        };
    };
    core.definitions.declare("textbuffer[4096]", "char", true);
    setOutParam(getFunction(api.functions, "GuiDropdownBox"), 2);
    setOutParam(getFunction(api.functions, "GuiSpinner"), 2);
    setOutParam(getFunction(api.functions, "GuiValueBox"), 2);
    setOutParam(getFunction(api.functions, "GuiListView"), 2);
    ignore("GuiListViewEx");
    setOutParamString(getFunction(api.functions, "GuiTextBox"), 1, 2);
    //ignore("GuiTextBox")
    ignore("GuiTextInputBox");
    //setOutParam(getFunction(api.functions, "GuiTextInputBox")!, 6)
    ignore("GuiTabBar");
    ignore("GuiGetIcons");
    ignore("GuiLoadIcons");
    // TODO: Parse and support light struct
    ignore("CreateLight");
    ignore("UpdateLightValues");
    api.structs.forEach(x => core.addApiStruct(x));
    api.functions.forEach(x => core.addApiFunction(x));
    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, description: x.description, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core.exportGlobalStruct("Color", x.name, x.values, x.description);
    });
    api.enums.forEach(x => core.addEnum(x));
    core.exportGlobalConstant("MATERIAL_MAP_DIFFUSE", "Albedo material (same as: MATERIAL_MAP_DIFFUSE");
    core.exportGlobalConstant("MATERIAL_MAP_SPECULAR", "Metalness material (same as: MATERIAL_MAP_SPECULAR)");
    core.writeTo("src/bindings/js_raylib_core.h");
    core.typings.writeTo("examples/lib.raylib.d.ts");
    const ignored = api.functions.filter(x => x.binding?.ignore).length;
    console.log(`Converted ${api.functions.length - ignored} function. ${ignored} ignored`);
    console.log("Success!");
}
main();

})();

/******/ })()
;