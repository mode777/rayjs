/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.ts":
/*!********************!*\
  !*** ./src/api.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiDescription = exports.ApiStruct = exports.ApiFunction = void 0;
class ApiFunction {
    constructor(api) {
        this.api = api;
        api.params = api.params || [];
    }
    get name() { return this.api.name; }
    get argc() { return this.api.params?.length || 0; }
    get params() { return this.api.params || []; }
    get returnType() { return this.api.returnType; }
    get description() { return this.api.description; }
}
exports.ApiFunction = ApiFunction;
class ApiStruct {
    constructor(api) {
        this.api = api;
    }
    get name() { return this.api.name; }
    get fields() { return this.api.fields || []; }
}
exports.ApiStruct = ApiStruct;
class ApiDescription {
    constructor(api) {
        this.api = api;
    }
    getAliases(name) {
        return this.api.aliases.filter(x => x.type === name).map(x => x.name);
    }
    getFunction(name) {
        const f = this.api.functions.find(x => x.name === name);
        if (!f)
            return null;
        return new ApiFunction(f);
    }
    getStruct(name) {
        const s = this.api.structs.find(x => x.name === name);
        if (!s)
            return null;
        return new ApiStruct(s);
    }
}
exports.ApiDescription = ApiDescription;


/***/ }),

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
}
exports.GenericCodeGenerator = GenericCodeGenerator;
class CodeGenerator extends GenericCodeGenerator {
    createGenerator() {
        return new CodeGenerator();
    }
}
exports.CodeGenerator = CodeGenerator;


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
    jsToC(type, name, src, classIds = {}) {
        switch (type) {
            case "const char *":
            case "char *":
                this.statement(`${type} ${name} = (${type})JS_ToCString(ctx, ${src})`);
                this.statement(`if(${name} == NULL) return JS_EXCEPTION`);
                break;
            case "double":
                this.statement(`${type} ${name}`);
                this.statement(`JS_ToFloat64(ctx, &${name}, ${src})`);
                break;
            case "float":
                this.statement("double _double_" + name);
                this.statement(`JS_ToFloat64(ctx, &_double_${name}, ${src})`);
                this.statement(`${type} ${name} = (${type})_double_${name}`);
                break;
            case "int":
                this.statement(`${type} ${name}`);
                this.statement(`JS_ToInt32(ctx, &${name}, ${src})`);
                break;
            case "unsigned int":
                this.statement(`${type} ${name}`);
                this.statement(`JS_ToUint32(ctx, &${name}, ${src})`);
                break;
            case "unsigned char":
                this.statement("unsigned int _int_" + name);
                this.statement(`JS_ToUint32(ctx, &_int_${name}, ${src})`);
                this.statement(`${type} ${name} = (${type})_int_${name}`);
                break;
            case "bool":
                this.statement(`${type} ${name} = JS_ToBool(ctx, ${src})`);
                break;
            default:
                const isConst = type.startsWith('const');
                const classId = classIds[type.replace("const ", "")];
                if (!classId)
                    throw new Error("Cannot convert into parameter type: " + type);
                this.jsOpqToStructPtr(type, name + "_ptr", src, classId);
                this.statement(`if(${name}_ptr == NULL) return JS_EXCEPTION`);
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
            case "const char *":
                this.statement(`JS_FreeCString(ctx, ${name})`);
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
            //cond.call("TraceLog", ["LOG_INFO",`"Finalize ${structName}"`])
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
        fun.if("!ptr", cond => {
            cond.returnExp("JS_EXCEPTION");
        });
        fun.declare(field, type, false, "ptr->" + field);
        fun.jsToJs(type, "ret", field, classIds);
        fun.returnExp("ret");
        return fun;
    }
    jsStructSetter(structName, classId, field, type, classIds) {
        const args = [{ type: "JSContext*", name: "ctx" }, { type: "JSValueConst", name: "this_val" }, { type: "JSValueConst", name: "v" }];
        const fun = this.function(`js_${structName}_set_${field}`, "JSValue", args, true);
        fun.declare("ptr", structName + "*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`);
        fun.if("!ptr", cond => {
            cond.returnExp("JS_EXCEPTION");
        });
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
    constructor(name, api) {
        super(name);
        this.api = api;
        this.typings = new typescript_1.TypeScriptDeclaration();
        this.includes.include("raylib.h");
        //this.includes.line("#define RAYMATH_IMPLEMENTATION")
        this.includes.include("raymath.h");
    }
    addApiFunction(api, jsName = null, options = {}) {
        const jName = jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1);
        const fun = this.functions.jsBindingFunction(jName);
        if (options.before)
            options.before(fun);
        // read parameters
        for (let i = 0; i < api.params.length; i++) {
            const para = api.params[i];
            fun.jsToC(para.type, para.name, "argv[" + i + "]", this.structLookup);
        }
        // call c function
        fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : { type: api.returnType, name: "returnVal" });
        // clean up parameters
        for (const param of api.params) {
            fun.jsCleanUpParameter(param.type, param.name);
        }
        if (options.after)
            options.after(fun);
        // return result
        if (api.returnType === "void") {
            fun.statement("return JS_UNDEFINED");
        }
        else {
            fun.jsToJs(api.returnType, "ret", "returnVal", this.structLookup);
            fun.returnExp("ret");
        }
        // add binding to function declaration
        this.moduleFunctionList.jsFuncDef(jName, api.argc, fun.getTag("_name"));
        this.typings.addFunction(jName, api);
    }
    addApiFunctionByName(name, jsName = null, options = {}) {
        const func = this.api.getFunction(name);
        if (func === null)
            throw new Error("Function not in API: " + name);
        this.addApiFunction(func, jsName, options);
    }
    addApiStruct(struct, destructor, options) {
        const classId = this.definitions.jsClassId(`js_${struct.name}_class_id`);
        this.registerStruct(struct.name, classId);
        this.api.getAliases(struct.name).forEach(x => this.registerStruct(x, classId));
        const finalizer = this.structs.jsStructFinalizer(classId, struct.name, (gen, ptr) => destructor && gen.call(destructor.name, ["*" + ptr]));
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
                    _get = this.structs.jsStructGetter(struct.name, classId, field, type, /*Be carefull when allocating memory in a getter*/ {});
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
        if (options?.createConstructor) {
            const body = this.functions.jsStructConstructor(struct.name, struct.fields, classId, this.structLookup);
            this.moduleInit.statement(`JSValue ${struct.name}_constr = JS_NewCFunction2(ctx, ${body.getTag("_name")},"${struct.name})", ${struct.fields.length}, JS_CFUNC_constructor_or_func, 0)`);
            this.moduleInit.call("JS_SetModuleExport", ["ctx", "m", `"${struct.name}"`, struct.name + "_constr"]);
            this.moduleEntry.call("JS_AddModuleExport", ["ctx", "m", '"' + struct.name + '"']);
        }
        this.typings.addStruct(struct, options || {});
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
    addApiStructByName(structName, options) {
        const struct = this.api.getStruct(structName);
        if (!struct)
            throw new Error("Struct not in API: " + structName);
        let destructor = null;
        if (options?.destructor) {
            destructor = this.api.getFunction(options.destructor);
            if (!destructor)
                throw new Error("Destructor func not in API: " + options.destructor);
        }
        this.addApiStruct(struct, destructor, options);
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
        const para = api.params.map(x => ({ name: x.name, type: this.toJsType(x.type) }));
        const returnType = this.toJsType(api.returnType);
        this.functions.tsDeclareFunction(name, para, returnType, api.description);
    }
    addStruct(api, options) {
        var fields = api.fields.filter(x => !!(options.properties || {})[x.name]).map(x => ({ name: x.name, description: x.description, type: this.toJsType(x.type) }));
        this.structs.tsDeclareInterface(api.name, fields);
        this.structs.tsDeclareType(api.name, !!options.createConstructor, fields);
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
            case "bool":
                return "boolean";
            case "const char *":
            case "char *":
                return "string";
            default:
                return type;
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
const api_1 = __webpack_require__(/*! ./api */ "./src/api.ts");
const raylib_header_1 = __webpack_require__(/*! ./raylib-header */ "./src/raylib-header.ts");
function parseMathHeader() {
    return (0, fs_1.readFileSync)("thirdparty/raylib/src/raymath.h", 'utf8')
        .split("\n")
        .filter(x => x.startsWith("RMAPI"))
        .map(inputString => {
        const matches = inputString.match(/^RMAPI\s+([\w<>]+)\s+([\w<>]+)\((.*)\)$/);
        if (!matches)
            throw new Error("Unable to match " + inputString);
        const args = matches[3].split(',').filter(x => x !== 'void').map(arg => {
            arg = arg.trim().replace(" *", "* ");
            const frags = arg.split(' ');
            const name = frags.pop();
            const type = frags.join(' ').replace("*", " *");
            return { name: name || "", type: type };
        });
        return {
            name: matches[2],
            returnType: matches[1],
            params: args,
            description: ""
        };
    });
}
function main() {
    const mathApi = parseMathHeader();
    (0, fs_1.writeFileSync)("bindings/raylib_math_api.json", JSON.stringify(mathApi));
    const api = JSON.parse((0, fs_1.readFileSync)("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'));
    mathApi.forEach(x => api.functions.push(x));
    const apiDesc = new api_1.ApiDescription(api);
    const core = new raylib_header_1.RayLibHeader("raylib_core", apiDesc);
    core.addApiStructByName("Color", {
        properties: {
            r: { get: true, set: true },
            g: { get: true, set: true },
            b: { get: true, set: true },
            a: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Rectangle", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            width: { get: true, set: true },
            height: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Vector2", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Vector3", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Vector4", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
            w: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Ray", {
        properties: {
            position: { get: false, set: true },
            direction: { get: false, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("RayCollision", {
        properties: {
            hit: { get: true, set: false },
            distance: { get: true, set: false },
            //point: { get: true, set: false },
            //normal: { get: true, set: false },
        },
        createConstructor: false
    });
    core.addApiStructByName("Camera2D", {
        properties: {
            offset: { get: false, set: true },
            target: { get: false, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("Camera3D", {
        properties: {
            position: { get: false, set: true },
            target: { get: false, set: true },
            up: { get: false, set: true },
            fovy: { get: true, set: true },
            projection: { get: true, set: true },
        },
        createConstructor: true
    });
    core.addApiStructByName("BoundingBox", {
        properties: {},
        createConstructor: true
    });
    core.addApiStructByName("Matrix", {
        properties: {},
        createConstructor: false
    });
    core.addApiStructByName("Image", {
        properties: {
            width: { get: true },
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true }
        },
        destructor: "UnloadImage"
    });
    core.addApiStructByName("Wave", {
        properties: {
            frameCount: { get: true },
            sampleRate: { get: true },
            sampleSize: { get: true },
            channels: { get: true }
        },
        destructor: "UnloadWave"
    });
    core.addApiStructByName("Sound", {
        properties: {
            frameCount: { get: true }
        },
        destructor: "UnloadSound"
    });
    core.addApiStructByName("Music", {
        properties: {
            frameCount: { get: true },
            looping: { get: true, set: true }
        },
        destructor: "UnloadMusicStream"
    });
    core.addApiStructByName("Model", {
        properties: {},
        destructor: "UnloadModel"
    });
    core.addApiStructByName("Mesh", {
        properties: {},
        destructor: "UnloadMesh"
    });
    core.addApiStructByName("Shader", {
        properties: {},
        destructor: "UnloadShader"
    });
    core.addApiStructByName("Texture", {
        properties: {
            width: { get: true },
            height: { get: true }
        },
        destructor: "UnloadTexture"
    });
    core.addApiStructByName("Font", {
        properties: {
            baseSize: { get: true }
        },
        destructor: "UnloadFont"
    });
    // Window-related functions
    core.addApiFunctionByName("InitWindow");
    core.addApiFunctionByName("WindowShouldClose");
    core.addApiFunctionByName("CloseWindow");
    core.addApiFunctionByName("IsWindowReady");
    core.addApiFunctionByName("IsWindowFullscreen");
    core.addApiFunctionByName("IsWindowHidden");
    core.addApiFunctionByName("IsWindowMinimized");
    core.addApiFunctionByName("IsWindowMaximized");
    core.addApiFunctionByName("IsWindowFocused");
    core.addApiFunctionByName("IsWindowResized");
    core.addApiFunctionByName("IsWindowState");
    core.addApiFunctionByName("SetWindowState");
    core.addApiFunctionByName("ClearWindowState");
    core.addApiFunctionByName("ToggleFullscreen");
    core.addApiFunctionByName("MaximizeWindow");
    core.addApiFunctionByName("MinimizeWindow");
    core.addApiFunctionByName("RestoreWindow");
    // SetWindowIcon
    // SetWindowIcons
    core.addApiFunctionByName("SetWindowTitle");
    core.addApiFunctionByName("SetWindowPosition");
    core.addApiFunctionByName("SetWindowMonitor");
    core.addApiFunctionByName("SetWindowMinSize");
    core.addApiFunctionByName("SetWindowSize");
    core.addApiFunctionByName("SetWindowOpacity");
    // GetWindowHandle
    core.addApiFunctionByName("GetScreenWidth");
    core.addApiFunctionByName("GetScreenHeight");
    core.addApiFunctionByName("GetRenderWidth");
    core.addApiFunctionByName("GetRenderHeight");
    core.addApiFunctionByName("GetMonitorCount");
    core.addApiFunctionByName("GetCurrentMonitor");
    core.addApiFunctionByName("GetMonitorPosition");
    core.addApiFunctionByName("GetMonitorWidth");
    core.addApiFunctionByName("GetMonitorHeight");
    core.addApiFunctionByName("GetMonitorPhysicalWidth");
    core.addApiFunctionByName("GetMonitorPhysicalHeight");
    core.addApiFunctionByName("GetMonitorRefreshRate");
    core.addApiFunctionByName("GetWindowPosition");
    core.addApiFunctionByName("GetWindowScaleDPI");
    core.addApiFunctionByName("GetMonitorName");
    core.addApiFunctionByName("SetClipboardText");
    core.addApiFunctionByName("GetClipboardText");
    core.addApiFunctionByName("EnableEventWaiting");
    core.addApiFunctionByName("DisableEventWaiting");
    // Custom frame control functions
    // NOT SUPPORTED BECAUSE NEEDS COMPILER FLAG
    // Cursor-related functions
    core.addApiFunctionByName("ShowCursor");
    core.addApiFunctionByName("HideCursor");
    core.addApiFunctionByName("IsCursorHidden");
    core.addApiFunctionByName("EnableCursor");
    core.addApiFunctionByName("DisableCursor");
    core.addApiFunctionByName("IsCursorOnScreen");
    // Drawing related functions
    core.addApiFunctionByName("ClearBackground");
    core.addApiFunctionByName("BeginDrawing");
    core.addApiFunctionByName("EndDrawing", null, { before: fun => fun.call("app_update_quickjs", []) });
    core.addApiFunctionByName("BeginMode2D");
    core.addApiFunctionByName("EndMode2D");
    core.addApiFunctionByName("BeginMode3D");
    core.addApiFunctionByName("EndMode3D");
    //core.addApiFunctionByName("BeginTextureMode")
    //core.addApiFunctionByName("EndTextureMode")
    //core.addApiFunctionByName("BeginShaderMode")
    //core.addApiFunctionByName("EndShaderMode")
    core.addApiFunctionByName("BeginBlendMode");
    core.addApiFunctionByName("EndBlendMode");
    core.addApiFunctionByName("BeginScissorMode");
    core.addApiFunctionByName("EndScissorMode");
    //core.addApiFunctionByName("BeginVrStereoMode")
    //core.addApiFunctionByName("EndVrStereoMode")
    // VR Stereo config options
    //core.addApiFunctionByName("LoadVrStereoConfig")
    //core.addApiFunctionByName("UnloadVrStereoConfig")
    // Shader Management
    // core.addApiFunctionByName("LoadShader")
    // core.addApiFunctionByName("LoadShaderFromMemory")
    // core.addApiFunctionByName("IsShaderReady")
    // core.addApiFunctionByName("GetShaderLocation")
    // core.addApiFunctionByName("GetShaderLocationAttrib")
    // core.addApiFunctionByName("SetShaderValue")
    // core.addApiFunctionByName("SetShaderValueV")
    // core.addApiFunctionByName("SetShaderValueMatrix")
    // core.addApiFunctionByName("SetShaderValueTexture")
    // // "UnloadShader" is destructor
    // ScreenSpaceRelatedFunctions
    //core.addApiFunctionByName("GetMouseRay")
    //core.addApiFunctionByName("GetCameraMatrix")
    core.addApiFunctionByName("GetCameraMatrix2D");
    //core.addApiFunctionByName("GetWorldToScreen")
    core.addApiFunctionByName("GetScreenToWorld2D");
    //core.addApiFunctionByName("GetScreenToWorldEx")
    core.addApiFunctionByName("GetWorldToScreen2D");
    // Timing related functions
    core.addApiFunctionByName("SetTargetFPS");
    core.addApiFunctionByName("GetFPS");
    core.addApiFunctionByName("GetFrameTime");
    core.addApiFunctionByName("GetTime");
    // Misc functions
    core.addApiFunctionByName("GetRandomValue");
    core.addApiFunctionByName("SetRandomSeed");
    core.addApiFunctionByName("TakeScreenshot");
    core.addApiFunctionByName("SetConfigFlags");
    const traceLog = apiDesc.getFunction("TraceLog");
    if (!traceLog)
        throw new Error("TraceLog not found");
    traceLog.params.pop();
    core.addApiFunction(traceLog);
    core.addApiFunctionByName("SetTraceLogLevel");
    // Memory functions not supported on JS
    core.addApiFunctionByName("OpenURL");
    // Callbacks not supported on JS
    // Files management functions
    //core.addApiFunctionByName("LoadFileData")
    //core.addApiFunctionByName("UnloadLoadFileData")
    //core.addApiFunctionByName("SaveFileData")
    // Export data as code not needed
    core.addApiFunctionByName("LoadFileText", null, { after: gen => gen.call("UnloadFileText", ["returnVal"]) });
    core.addApiFunctionByName("SaveFileText");
    core.addApiFunctionByName("FileExists");
    core.addApiFunctionByName("DirectoryExists");
    core.addApiFunctionByName("IsFileExtension");
    // TODO: Who needs to clean memory here?
    core.addApiFunctionByName("GetFileLength");
    core.addApiFunctionByName("GetFileExtension");
    core.addApiFunctionByName("GetFileName");
    core.addApiFunctionByName("GetFileNameWithoutExt");
    core.addApiFunctionByName("GetDirectoryPath");
    core.addApiFunctionByName("GetPrevDirectoryPath");
    core.addApiFunctionByName("GetWorkingDirectory");
    core.addApiFunctionByName("GetApplicationDirectory");
    core.addApiFunctionByName("ChangeDirectory");
    core.addApiFunctionByName("IsPathFile");
    //core.addApiFunctionByName("LoadPathFiles")
    //core.addApiFunctionByName("LoadPathFilesEx")
    // UnloadDirectoryFiles
    core.addApiFunctionByName("IsFileDropped");
    //core.addApiFunctionByName("LoadDroppedFiles")
    // UnloadDroppedFiles
    core.addApiFunctionByName("GetFileModTime");
    // Compression/encodeing functionality
    //core.addApiFunctionByName("CompressData")
    //core.addApiFunctionByName("DecompressData")
    //core.addApiFunctionByName("EncodeDataBase64")
    //core.addApiFunctionByName("DecodeDataBase64")
    // input handling functions
    core.addApiFunctionByName("IsKeyPressed");
    core.addApiFunctionByName("IsKeyDown");
    core.addApiFunctionByName("IsKeyReleased");
    core.addApiFunctionByName("IsKeyUp");
    core.addApiFunctionByName("SetExitKey");
    core.addApiFunctionByName("GetKeyPressed");
    core.addApiFunctionByName("GetCharPressed");
    // input-related functions: gamepads
    core.addApiFunctionByName("IsGamepadAvailable");
    core.addApiFunctionByName("GetGamepadName");
    core.addApiFunctionByName("IsGamepadButtonPressed");
    core.addApiFunctionByName("IsGamepadButtonDown");
    core.addApiFunctionByName("IsGamepadButtonReleased");
    core.addApiFunctionByName("IsGamepadButtonUp");
    core.addApiFunctionByName("GetGamepadButtonPressed");
    core.addApiFunctionByName("GetGamepadAxisCount");
    core.addApiFunctionByName("GetGamepadAxisMovement");
    core.addApiFunctionByName("SetGamepadMappings");
    // input-related functions: mouse
    core.addApiFunctionByName("IsMouseButtonPressed");
    core.addApiFunctionByName("IsMouseButtonDown");
    core.addApiFunctionByName("IsMouseButtonReleased");
    core.addApiFunctionByName("IsMouseButtonUp");
    core.addApiFunctionByName("GetMouseX");
    core.addApiFunctionByName("GetMouseY");
    core.addApiFunctionByName("GetMousePosition");
    core.addApiFunctionByName("GetMouseDelta");
    core.addApiFunctionByName("SetMousePosition");
    core.addApiFunctionByName("SetMouseOffset");
    core.addApiFunctionByName("SetMouseScale");
    core.addApiFunctionByName("GetMouseWheelMove");
    core.addApiFunctionByName("GetMouseWheelMoveV");
    core.addApiFunctionByName("SetMouseCursor");
    // input-related functions: touch
    core.addApiFunctionByName("GetTouchX");
    core.addApiFunctionByName("GetTouchY");
    core.addApiFunctionByName("GetTouchPosition");
    core.addApiFunctionByName("GetTouchPointId");
    core.addApiFunctionByName("GetTouchPointCount");
    // Gesture and touch handling functions
    core.addApiFunctionByName("SetGesturesEnabled");
    core.addApiFunctionByName("IsGestureDetected");
    core.addApiFunctionByName("GetGestureDetected");
    core.addApiFunctionByName("GetGestureHoldDuration");
    core.addApiFunctionByName("GetGestureDragVector");
    core.addApiFunctionByName("GetGestureDragAngle");
    core.addApiFunctionByName("GetGesturePinchVector");
    core.addApiFunctionByName("GetGesturePinchAngle");
    // Camera system functions
    // core.addApiFunctionByName("UpdateCamera")
    // core.addApiFunctionByName("UpdateCameraPro")
    //api.functions.forEach(x => console.log(`core.addApiFunctionByName("${x.name}")`))
    // module: rshapes
    // TODO: Do we need ref-counting here?
    //core.addApiFunctionByName("SetShapesTexture")
    // Basic shapes drawing functions
    core.addApiFunctionByName("DrawPixel");
    core.addApiFunctionByName("DrawPixelV");
    core.addApiFunctionByName("DrawLine");
    core.addApiFunctionByName("DrawLineV");
    core.addApiFunctionByName("DrawLineEx");
    core.addApiFunctionByName("DrawLineBezier");
    core.addApiFunctionByName("DrawLineBezierQuad");
    core.addApiFunctionByName("DrawLineBezierCubic");
    // core.addApiFunctionByName("DrawLineStrip")
    core.addApiFunctionByName("DrawCircle");
    core.addApiFunctionByName("DrawCircleSector");
    core.addApiFunctionByName("DrawCircleSectorLines");
    core.addApiFunctionByName("DrawCircleGradient");
    core.addApiFunctionByName("DrawCircleV");
    core.addApiFunctionByName("DrawCircleLines");
    core.addApiFunctionByName("DrawEllipse");
    core.addApiFunctionByName("DrawEllipseLines");
    core.addApiFunctionByName("DrawRing");
    core.addApiFunctionByName("DrawRingLines");
    core.addApiFunctionByName("DrawRectangle");
    core.addApiFunctionByName("DrawRectangleV");
    core.addApiFunctionByName("DrawRectangleRec");
    core.addApiFunctionByName("DrawRectanglePro");
    core.addApiFunctionByName("DrawRectangleGradientV");
    core.addApiFunctionByName("DrawRectangleGradientH");
    core.addApiFunctionByName("DrawRectangleGradientEx");
    core.addApiFunctionByName("DrawRectangleLines");
    core.addApiFunctionByName("DrawRectangleLinesEx");
    core.addApiFunctionByName("DrawRectangleRounded");
    core.addApiFunctionByName("DrawRectangleRoundedLines");
    core.addApiFunctionByName("DrawTriangle");
    core.addApiFunctionByName("DrawTriangleLines");
    //core.addApiFunctionByName("DrawTriangleFan")
    //core.addApiFunctionByName("DrawTriangleStrip")
    core.addApiFunctionByName("DrawPoly");
    core.addApiFunctionByName("DrawPolyLines");
    core.addApiFunctionByName("DrawPolyLinesEx");
    // Basic shapes collision detection functions
    core.addApiFunctionByName("CheckCollisionRecs");
    core.addApiFunctionByName("CheckCollisionCircles");
    core.addApiFunctionByName("CheckCollisionCircleRec");
    core.addApiFunctionByName("CheckCollisionPointRec");
    core.addApiFunctionByName("CheckCollisionPointCircle");
    core.addApiFunctionByName("CheckCollisionPointTriangle");
    // core.addApiFunctionByName("CheckCollisionPointPoly")
    // core.addApiFunctionByName("CheckCollisionLines")
    core.addApiFunctionByName("CheckCollisionPointLine");
    core.addApiFunctionByName("GetCollisionRec");
    // Image loading functions
    core.addApiFunctionByName("LoadImage");
    core.addApiFunctionByName("LoadImageRaw");
    // core.addApiFunctionByName("LoadImageAnim")
    // core.addApiFunctionByName("LoadImageFromMemory")
    core.addApiFunctionByName("LoadImageFromTexture");
    core.addApiFunctionByName("LoadImageFromScreen");
    core.addApiFunctionByName("IsImageReady");
    // UnloadImage called by destructor
    core.addApiFunctionByName("ExportImage");
    // needed?
    // core.addApiFunctionByName("ExportImageAsCode")
    // Image generation functions
    core.addApiFunctionByName("GenImageColor");
    core.addApiFunctionByName("GenImageGradientV");
    core.addApiFunctionByName("GenImageGradientH");
    core.addApiFunctionByName("GenImageGradientRadial");
    core.addApiFunctionByName("GenImageChecked");
    core.addApiFunctionByName("GenImageWhiteNoise");
    core.addApiFunctionByName("GenImagePerlinNoise");
    core.addApiFunctionByName("GenImageCellular");
    core.addApiFunctionByName("GenImageText");
    // Image manipulations functions
    core.addApiFunctionByName("ImageCopy");
    core.addApiFunctionByName("ImageFromImage");
    core.addApiFunctionByName("ImageText");
    // core.addApiFunctionByName("ImageTextEx")
    // core.addApiFunctionByName("ImageFormat")
    // core.addApiFunctionByName("ImageToPOT")
    // core.addApiFunctionByName("ImageCrop")
    // core.addApiFunctionByName("ImageAlphaCrop")
    // core.addApiFunctionByName("ImageAlphaClear")
    // core.addApiFunctionByName("ImageAlphaMask")
    // core.addApiFunctionByName("ImageAlphaPremultiply")
    // core.addApiFunctionByName("ImageBlurGaussian")
    // core.addApiFunctionByName("ImageResize")
    // core.addApiFunctionByName("ImageResizeNN")
    // core.addApiFunctionByName("ImageResizeCanvas")
    // core.addApiFunctionByName("ImageMipmaps")
    // core.addApiFunctionByName("ImageDither")
    // core.addApiFunctionByName("ImageFlipVertical")
    // core.addApiFunctionByName("ImageFlipHorizontal")
    // core.addApiFunctionByName("ImageRotateCW")
    // core.addApiFunctionByName("ImageRotateCCW")
    // core.addApiFunctionByName("ImageColorTint")
    // core.addApiFunctionByName("ImageColorInvert")
    // core.addApiFunctionByName("ImageColorGrayscale")
    // core.addApiFunctionByName("ImageColorContrast")
    // core.addApiFunctionByName("ImageColorBrightness")
    // core.addApiFunctionByName("ImageColorReplace")
    // core.addApiFunctionByName("LoadImageColors")
    // core.addApiFunctionByName("LoadImagePalette")
    // core.addApiFunctionByName("UnloadImageColors")
    // core.addApiFunctionByName("UnloadImagePalette")
    core.addApiFunctionByName("GetImageAlphaBorder");
    core.addApiFunctionByName("GetImageColor");
    // Image drawing functions
    // core.addApiFunctionByName("ImageClearBackground")
    // core.addApiFunctionByName("ImageDrawPixel")
    // core.addApiFunctionByName("ImageDrawPixelV")
    // core.addApiFunctionByName("ImageDrawLine")
    // core.addApiFunctionByName("ImageDrawLineV")
    // core.addApiFunctionByName("ImageDrawCircle")
    // core.addApiFunctionByName("ImageDrawCircleV")
    // core.addApiFunctionByName("ImageDrawCircleLines")
    // core.addApiFunctionByName("ImageDrawCircleLinesV")
    // core.addApiFunctionByName("ImageDrawRectangle")
    // core.addApiFunctionByName("ImageDrawRectangleV")
    // core.addApiFunctionByName("ImageDrawRectangleRec")
    // core.addApiFunctionByName("ImageDrawRectangleLines")
    // core.addApiFunctionByName("ImageDraw")
    // core.addApiFunctionByName("ImageDrawText")
    // core.addApiFunctionByName("ImageDrawTextEx")
    // Texture loading functions
    core.addApiFunctionByName("LoadTexture");
    core.addApiFunctionByName("LoadTextureFromImage");
    core.addApiFunctionByName("LoadTextureCubemap");
    // core.addApiFunctionByName("LoadRenderTexture")
    core.addApiFunctionByName("IsTextureReady");
    // "UnloadTexture" called by finalizer
    // core.addApiFunctionByName("IsRenderTextureReady")
    // core.addApiFunctionByName("UnloadRenderTexture")
    // core.addApiFunctionByName("UpdateTexture")
    // core.addApiFunctionByName("UpdateTextureRec")
    // Texture configuration functions
    // core.addApiFunctionByName("GenTextureMipmaps")
    core.addApiFunctionByName("SetTextureFilter");
    core.addApiFunctionByName("SetTextureWrap");
    // Texture drawing functions
    core.addApiFunctionByName("DrawTexture");
    core.addApiFunctionByName("DrawTextureV");
    core.addApiFunctionByName("DrawTextureEx");
    core.addApiFunctionByName("DrawTextureRec");
    core.addApiFunctionByName("DrawTexturePro");
    // core.addApiFunctionByName("DrawTextureNPatch")
    // Color/pixel related functions
    core.addApiFunctionByName("Fade");
    core.addApiFunctionByName("ColorToInt");
    core.addApiFunctionByName("ColorNormalize");
    core.addApiFunctionByName("ColorFromNormalized");
    core.addApiFunctionByName("ColorToHSV");
    core.addApiFunctionByName("ColorFromHSV");
    core.addApiFunctionByName("ColorTint");
    core.addApiFunctionByName("ColorBrightness");
    core.addApiFunctionByName("ColorContrast");
    core.addApiFunctionByName("ColorAlpha");
    core.addApiFunctionByName("ColorAlphaBlend");
    core.addApiFunctionByName("GetColor");
    // core.addApiFunctionByName("GetPixelColor")
    // core.addApiFunctionByName("SetPixelColor")
    core.addApiFunctionByName("GetPixelDataSize");
    // module: rtext
    // Font loading/unloading
    core.addApiFunctionByName("GetFontDefault");
    core.addApiFunctionByName("LoadFont");
    // core.addApiFunctionByName("LoadFontEx")
    core.addApiFunctionByName("LoadFontFromImage");
    // core.addApiFunctionByName("LoadFontFromMemory")
    core.addApiFunctionByName("IsFontReady");
    // core.addApiFunctionByName("LoadFontData")
    // core.addApiFunctionByName("GenImageFontAtlas")
    // core.addApiFunctionByName("UnloadFontData")
    // "UnloadFont" called by finalizer
    // core.addApiFunctionByName("ExportFontAsCode")
    // Text drawing functions
    core.addApiFunctionByName("DrawFPS");
    core.addApiFunctionByName("DrawText");
    core.addApiFunctionByName("DrawTextEx");
    core.addApiFunctionByName("DrawTextPro");
    core.addApiFunctionByName("DrawTextCodepoint");
    //core.addApiFunctionByName("DrawTextCodepoints")
    // Text font info functions
    core.addApiFunctionByName("MeasureText");
    core.addApiFunctionByName("MeasureTextEx");
    core.addApiFunctionByName("GetGlyphIndex");
    // core.addApiFunctionByName("GetGlyphInfo")
    core.addApiFunctionByName("GetGlyphAtlasRec");
    // Text codepoints management functions (unicode characters)
    // Is this needed?
    // core.addApiFunctionByName("LoadUTF8")
    // core.addApiFunctionByName("UnloadUTF8")
    // core.addApiFunctionByName("LoadCodepoints")
    // core.addApiFunctionByName("UnloadCodepoints")
    // core.addApiFunctionByName("GetCodepointCount")
    // core.addApiFunctionByName("GetCodepoint")
    // core.addApiFunctionByName("GetCodepointNext")
    // core.addApiFunctionByName("GetCodepointPrevious")
    // core.addApiFunctionByName("CodepointToUTF8")
    // Text strings management functions (no UTF-8 strings, only byte chars)
    // Probably not needed
    // core.addApiFunctionByName("TextCopy")
    // core.addApiFunctionByName("TextIsEqual")
    // core.addApiFunctionByName("TextLength")
    // core.addApiFunctionByName("TextFormat")
    // core.addApiFunctionByName("TextSubtext")
    // core.addApiFunctionByName("TextReplace")
    // core.addApiFunctionByName("TextInsert")
    // core.addApiFunctionByName("TextJoin")
    // core.addApiFunctionByName("TextSplit")
    // core.addApiFunctionByName("TextAppend")
    // core.addApiFunctionByName("TextFindIndex")
    // core.addApiFunctionByName("TextToUpper")
    // core.addApiFunctionByName("TextToLower")
    // core.addApiFunctionByName("TextToPascal")
    // core.addApiFunctionByName("TextToInteger")
    // module: rmodels
    // Basic geometric 3D shapes drawing functions
    core.addApiFunctionByName("DrawLine3D");
    core.addApiFunctionByName("DrawPoint3D");
    core.addApiFunctionByName("DrawCircle3D");
    core.addApiFunctionByName("DrawTriangle3D");
    //core.addApiFunctionByName("DrawTriangleStrip3D")
    core.addApiFunctionByName("DrawCube");
    core.addApiFunctionByName("DrawCubeV");
    core.addApiFunctionByName("DrawCubeWires");
    core.addApiFunctionByName("DrawCubeWiresV");
    core.addApiFunctionByName("DrawSphere");
    core.addApiFunctionByName("DrawSphereEx");
    core.addApiFunctionByName("DrawSphereWires");
    core.addApiFunctionByName("DrawCylinder");
    core.addApiFunctionByName("DrawCylinderEx");
    core.addApiFunctionByName("DrawCylinderWires");
    core.addApiFunctionByName("DrawCylinderWiresEx");
    core.addApiFunctionByName("DrawCapsule");
    core.addApiFunctionByName("DrawCapsuleWires");
    core.addApiFunctionByName("DrawPlane");
    core.addApiFunctionByName("DrawRay");
    core.addApiFunctionByName("DrawGrid");
    // model management functions
    core.addApiFunctionByName("LoadModel");
    core.addApiFunctionByName("LoadModelFromMesh");
    core.addApiFunctionByName("IsModelReady");
    // "UnloadModel" called by finalizer
    core.addApiFunctionByName("GetModelBoundingBox");
    // model drawing functions
    core.addApiFunctionByName("DrawModel");
    core.addApiFunctionByName("DrawModelEx");
    core.addApiFunctionByName("DrawModelWires");
    core.addApiFunctionByName("DrawModelWiresEx");
    core.addApiFunctionByName("DrawBoundingBox");
    core.addApiFunctionByName("DrawBillboard");
    core.addApiFunctionByName("DrawBillboardRec");
    core.addApiFunctionByName("DrawBillboardPro");
    // Mesh management functions
    // core.addApiFunctionByName("UploadMesh")
    // core.addApiFunctionByName("UpdateMeshBuffer")
    // "UnloadMesh" called by finalizer
    //core.addApiFunctionByName("DrawMesh")
    // core.addApiFunctionByName("DrawMeshInstanced")
    core.addApiFunctionByName("ExportMesh");
    core.addApiFunctionByName("GetMeshBoundingBox");
    // core.addApiFunctionByName("GenMeshTangents")
    // Mesh generation functions
    core.addApiFunctionByName("GenMeshPoly");
    core.addApiFunctionByName("GenMeshPlane");
    core.addApiFunctionByName("GenMeshCube");
    core.addApiFunctionByName("GenMeshSphere");
    core.addApiFunctionByName("GenMeshHemiSphere");
    core.addApiFunctionByName("GenMeshCylinder");
    core.addApiFunctionByName("GenMeshCone");
    core.addApiFunctionByName("GenMeshTorus");
    core.addApiFunctionByName("GenMeshKnot");
    core.addApiFunctionByName("GenMeshHeightmap");
    core.addApiFunctionByName("GenMeshCubicmap");
    // Material loading/unloading functions
    // core.addApiFunctionByName("LoadMaterials")
    // core.addApiFunctionByName("LoadMaterialDefault")
    // core.addApiFunctionByName("IsMaterialReady")
    // core.addApiFunctionByName("UnloadMaterial")
    // core.addApiFunctionByName("SetMaterialTexture")
    // core.addApiFunctionByName("SetModelMeshMaterial")
    // Model animations loading/unloading functions
    // core.addApiFunctionByName("LoadModelAnimations")
    // core.addApiFunctionByName("UpdateModelAnimation")
    // core.addApiFunctionByName("UnloadModelAnimation")
    // core.addApiFunctionByName("UnloadModelAnimations")
    // core.addApiFunctionByName("IsModelAnimationValid")
    // Collision detection functions
    core.addApiFunctionByName("CheckCollisionSpheres");
    core.addApiFunctionByName("CheckCollisionBoxes");
    core.addApiFunctionByName("CheckCollisionBoxSphere");
    core.addApiFunctionByName("GetRayCollisionSphere");
    core.addApiFunctionByName("GetRayCollisionBox");
    core.addApiFunctionByName("GetRayCollisionMesh");
    core.addApiFunctionByName("GetRayCollisionTriangle");
    core.addApiFunctionByName("GetRayCollisionQuad");
    // module: raudio
    // Audio device management functions
    core.addApiFunctionByName("InitAudioDevice");
    core.addApiFunctionByName("CloseAudioDevice");
    core.addApiFunctionByName("IsAudioDeviceReady");
    core.addApiFunctionByName("SetMasterVolume");
    // Wave/Sound loading/unloading functions
    core.addApiFunctionByName("LoadWave");
    // core.addApiFunctionByName("LoadWaveFromMemory")
    core.addApiFunctionByName("IsWaveReady");
    core.addApiFunctionByName("LoadSound");
    core.addApiFunctionByName("LoadSoundFromWave");
    core.addApiFunctionByName("IsSoundReady");
    // core.addApiFunctionByName("UpdateSound")
    // "UnloadWave" called by finalizer
    // "UnloadSound" called by finalizer
    core.addApiFunctionByName("ExportWave");
    // core.addApiFunctionByName("ExportWaveAsCode")
    // Wave/Sound management functions
    core.addApiFunctionByName("PlaySound");
    core.addApiFunctionByName("StopSound");
    core.addApiFunctionByName("PauseSound");
    core.addApiFunctionByName("ResumeSound");
    core.addApiFunctionByName("IsSoundPlaying");
    core.addApiFunctionByName("SetSoundVolume");
    core.addApiFunctionByName("SetSoundPitch");
    core.addApiFunctionByName("SetSoundPan");
    core.addApiFunctionByName("WaveCopy");
    // core.addApiFunctionByName("WaveCrop")
    // core.addApiFunctionByName("WaveFormat")
    // core.addApiFunctionByName("LoadWaveSamples")
    // core.addApiFunctionByName("UnloadWaveSamples")
    // Music management functions
    core.addApiFunctionByName("LoadMusicStream");
    // core.addApiFunctionByName("LoadMusicStreamFromMemory")
    core.addApiFunctionByName("IsMusicReady");
    // "UnloadMusicStream" called by finalizer
    core.addApiFunctionByName("PlayMusicStream");
    core.addApiFunctionByName("IsMusicStreamPlaying");
    core.addApiFunctionByName("UpdateMusicStream");
    core.addApiFunctionByName("StopMusicStream");
    core.addApiFunctionByName("PauseMusicStream");
    core.addApiFunctionByName("ResumeMusicStream");
    core.addApiFunctionByName("SeekMusicStream");
    core.addApiFunctionByName("SetMusicVolume");
    core.addApiFunctionByName("SetMusicPitch");
    core.addApiFunctionByName("SetMusicPan");
    core.addApiFunctionByName("GetMusicTimeLength");
    core.addApiFunctionByName("GetMusicTimePlayed");
    // AudioStream management functions
    // core.addApiFunctionByName("LoadAudioStream")
    // core.addApiFunctionByName("IsAudioStreamReady")
    // core.addApiFunctionByName("UnloadAudioStream")
    // core.addApiFunctionByName("UpdateAudioStream")
    // core.addApiFunctionByName("IsAudioStreamProcessed")
    // core.addApiFunctionByName("PlayAudioStream")
    // core.addApiFunctionByName("PauseAudioStream")
    // core.addApiFunctionByName("ResumeAudioStream")
    // core.addApiFunctionByName("IsAudioStreamPlaying")
    // core.addApiFunctionByName("StopAudioStream")
    // core.addApiFunctionByName("SetAudioStreamVolume")
    // core.addApiFunctionByName("SetAudioStreamPitch")
    // core.addApiFunctionByName("SetAudioStreamPan")
    // core.addApiFunctionByName("SetAudioStreamBufferSizeDefault")
    // core.addApiFunctionByName("SetAudioStreamCallback")
    // core.addApiFunctionByName("AttachAudioStreamProcessor")
    // core.addApiFunctionByName("DetachAudioStreamProcessor")
    // core.addApiFunctionByName("AttachAudioMixedProcessor")
    // core.addApiFunctionByName("DetachAudioMixedProcessor")
    // module: raymath
    core.addApiFunctionByName("Clamp");
    core.addApiFunctionByName("Lerp");
    core.addApiFunctionByName("Normalize");
    core.addApiFunctionByName("Remap");
    core.addApiFunctionByName("Wrap");
    core.addApiFunctionByName("FloatEquals");
    core.addApiFunctionByName("Vector2Zero");
    core.addApiFunctionByName("Vector2One");
    core.addApiFunctionByName("Vector2Add");
    core.addApiFunctionByName("Vector2AddValue");
    core.addApiFunctionByName("Vector2Subtract");
    core.addApiFunctionByName("Vector2SubtractValue");
    core.addApiFunctionByName("Vector2Length");
    core.addApiFunctionByName("Vector2LengthSqr");
    core.addApiFunctionByName("Vector2DotProduct");
    core.addApiFunctionByName("Vector2Distance");
    core.addApiFunctionByName("Vector2DistanceSqr");
    core.addApiFunctionByName("Vector2Angle");
    core.addApiFunctionByName("Vector2LineAngle");
    core.addApiFunctionByName("Vector2Scale");
    core.addApiFunctionByName("Vector2Multiply");
    core.addApiFunctionByName("Vector2Negate");
    core.addApiFunctionByName("Vector2Divide");
    core.addApiFunctionByName("Vector2Normalize");
    core.addApiFunctionByName("Vector2Transform");
    core.addApiFunctionByName("Vector2Lerp");
    core.addApiFunctionByName("Vector2Reflect");
    core.addApiFunctionByName("Vector2Rotate");
    core.addApiFunctionByName("Vector2MoveTowards");
    core.addApiFunctionByName("Vector2Invert");
    core.addApiFunctionByName("Vector2Clamp");
    core.addApiFunctionByName("Vector2ClampValue");
    core.addApiFunctionByName("Vector2Equals");
    core.addApiFunctionByName("Vector3Zero");
    core.addApiFunctionByName("Vector3One");
    core.addApiFunctionByName("Vector3Add");
    core.addApiFunctionByName("Vector3AddValue");
    // core.addApiFunctionByName("Vector3Subtract")
    // core.addApiFunctionByName("Vector3SubtractValue")
    // core.addApiFunctionByName("Vector3Scale")
    // core.addApiFunctionByName("Vector3Multiply")
    // core.addApiFunctionByName("Vector3CrossProduct")
    // core.addApiFunctionByName("Vector3Perpendicular")
    // core.addApiFunctionByName("Vector3Length")
    // core.addApiFunctionByName("Vector3LengthSqr")
    // core.addApiFunctionByName("Vector3DotProduct")
    // core.addApiFunctionByName("Vector3Distance")
    // core.addApiFunctionByName("Vector3DistanceSqr")
    // core.addApiFunctionByName("Vector3Angle")
    // core.addApiFunctionByName("Vector3Negate")
    // core.addApiFunctionByName("Vector3Divide")
    // core.addApiFunctionByName("Vector3Normalize")
    // core.addApiFunctionByName("Vector3OrthoNormalize")
    // core.addApiFunctionByName("Vector3Transform")
    // core.addApiFunctionByName("Vector3RotateByQuaternion")
    // core.addApiFunctionByName("Vector3RotateByAxisAngle")
    // core.addApiFunctionByName("Vector3Lerp")
    // core.addApiFunctionByName("Vector3Reflect")
    // core.addApiFunctionByName("Vector3Min")
    // core.addApiFunctionByName("Vector3Max")
    // core.addApiFunctionByName("Vector3Barycenter")
    // core.addApiFunctionByName("Vector3Unproject")
    // core.addApiFunctionByName("Vector3ToFloatV")
    // core.addApiFunctionByName("Vector3Invert")
    // core.addApiFunctionByName("Vector3Clamp")
    // core.addApiFunctionByName("Vector3ClampValue")
    // core.addApiFunctionByName("Vector3Equals")
    // core.addApiFunctionByName("Vector3Refract")
    // core.addApiFunctionByName("MatrixDeterminant")
    // core.addApiFunctionByName("MatrixTrace")
    // core.addApiFunctionByName("MatrixTranspose")
    // core.addApiFunctionByName("MatrixInvert")
    // core.addApiFunctionByName("MatrixIdentity")
    // core.addApiFunctionByName("MatrixAdd")
    // core.addApiFunctionByName("MatrixSubtract")
    // core.addApiFunctionByName("MatrixMultiply")
    // core.addApiFunctionByName("MatrixTranslate")
    // core.addApiFunctionByName("MatrixRotate")
    // core.addApiFunctionByName("MatrixRotateX")
    // core.addApiFunctionByName("MatrixRotateY")
    // core.addApiFunctionByName("MatrixRotateZ")
    // core.addApiFunctionByName("MatrixRotateXYZ")
    // core.addApiFunctionByName("MatrixRotateZYX")
    // core.addApiFunctionByName("MatrixScale")
    // core.addApiFunctionByName("MatrixFrustum")
    // core.addApiFunctionByName("MatrixPerspective")
    // core.addApiFunctionByName("MatrixOrtho")
    // core.addApiFunctionByName("MatrixLookAt")
    // core.addApiFunctionByName("MatrixToFloatV")
    // core.addApiFunctionByName("QuaternionAdd")
    // core.addApiFunctionByName("QuaternionAddValue")
    // core.addApiFunctionByName("QuaternionSubtract")
    // core.addApiFunctionByName("QuaternionSubtractValue")
    // core.addApiFunctionByName("QuaternionIdentity")
    // core.addApiFunctionByName("QuaternionLength")
    // core.addApiFunctionByName("QuaternionNormalize")
    // core.addApiFunctionByName("QuaternionInvert")
    // core.addApiFunctionByName("QuaternionMultiply")
    // core.addApiFunctionByName("QuaternionScale")
    // core.addApiFunctionByName("QuaternionDivide")
    // core.addApiFunctionByName("QuaternionLerp")
    // core.addApiFunctionByName("QuaternionNlerp")
    // core.addApiFunctionByName("QuaternionSlerp")
    // core.addApiFunctionByName("QuaternionFromVector3ToVector3")
    // core.addApiFunctionByName("QuaternionFromMatrix")
    // core.addApiFunctionByName("QuaternionToMatrix")
    // core.addApiFunctionByName("QuaternionFromAxisAngle")
    // core.addApiFunctionByName("QuaternionToAxisAngle")
    // core.addApiFunctionByName("QuaternionFromEuler")
    // core.addApiFunctionByName("QuaternionToEuler")
    // core.addApiFunctionByName("QuaternionTransform")
    // core.addApiFunctionByName("QuaternionEquals")
    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, description: x.description, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core.exportGlobalStruct("Color", x.name, x.values, x.description);
    });
    api.enums.find(x => x.name === "KeyboardKey")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "MouseButton")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "ConfigFlags")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "BlendMode")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "TraceLogLevel")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "MouseCursor")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "PixelFormat")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    api.enums.find(x => x.name === "CameraProjection")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description));
    core.writeTo("src/bindings/js_raylib_core.h");
    core.typings.writeTo("examples/lib.raylib.d.ts");
}
main();

})();

/******/ })()
;