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
        this.declarations = body.child();
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
    jsToC(type, name, src) {
        this.inline(`${type} ${name}`);
        switch (type) {
            case "const char *":
                this.statement(` = JS_ToCString(ctx, ${src})`);
                this.statement(`if(${name} == NULL) return JS_EXCEPTION`);
                break;
            case "int":
                this.statement('');
                this.statement(`JS_ToInt32(ctx, &${name}, ${src})`);
                break;
            default:
                throw new Error("Cannot handle parameter type: " + type);
        }
    }
    jsToJs(type, name, src) {
        this.inline(`JSValue ${name}`);
        switch (type) {
            case "int":
                this.statement(` = JS_NewInt32(ctx, ${src})`);
                break;
            default:
                throw new Error("Cannot handle parameter type: " + type);
        }
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
            cond.call("puts", ["\"Finalize " + structName + "\""]);
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
    jsStructGetter(structName, classId, field, type) {
        const args = [{ type: "JSContext*", name: "ctx" }, { type: "JSValueConst", name: "this_val" }];
        const fun = this.function(`js_${structName}_get_${field}`, "JSValue", args, true);
        fun.declare("ptr", structName + "*", false, `JS_GetOpaque2(ctx, this_val, ${classId})`);
        fun.if("!ptr", cond => {
            cond.returnExp("JS_EXCEPTION");
        });
        fun.declare(field, type, false, "ptr->" + field);
        fun.jsToJs(type, "ret", field);
        fun.returnExp("ret");
        return fun;
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
class RayLibHeader extends quickjs_1.QuickJsHeader {
    constructor(name, api) {
        super(name);
        this.api = api;
        this.includes.include("raylib.h");
    }
    addApiFunction(api, jsName = null) {
        const jName = jsName || api.name.charAt(0).toLowerCase() + api.name.slice(1);
        const fun = this.functions.jsBindingFunction(jName);
        // read parameters
        for (let i = 0; i < api.params.length; i++) {
            const para = api.params[i];
            fun.jsToC(para.type, para.name, "argv[" + i + "]");
        }
        // call c function
        fun.call(api.name, api.params.map(x => x.name), api.returnType === "void" ? null : { type: api.returnType, name: "returnVal" });
        // clean up parameters
        for (const param of api.params) {
            fun.jsCleanUpParameter(param.type, param.name);
        }
        // return result
        if (api.returnType === "void") {
            fun.statement("return JS_UNDEFINED");
        }
        else {
            fun.jsToJs(api.returnType, "ret", "returnVal");
            fun.returnExp("returnVal");
        }
        // add binding to function declaration
        this.moduleFunctionList.jsFuncDef(jName, api.argc, fun.getTag("_name"));
    }
    addApiFunctionByName(name, jsName = null) {
        const func = this.api.getFunction(name);
        if (func === null)
            throw new Error("Function not in API: " + name);
        this.addApiFunction(func, jsName);
    }
    addApiStruct(struct, destructor, options) {
        const classId = this.declarations.jsClassId(`js_${struct.name}_class_id`);
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
                    _get = this.structs.jsStructGetter(struct.name, classId, field, type);
                propDeclarations.jsGetSetDef(field, _get?.getTag("_name"), undefined);
            }
        }
        const classFuncList = this.structs.jsFunctionList(`js_${struct.name}_proto_funcs`);
        classFuncList.child(propDeclarations);
        classFuncList.jsPropStringDef("[Symbol.toStringTag]", "Image");
        const classDecl = this.structs.jsClassDeclaration(struct.name, classId, finalizer.getTag("_name"), classFuncList.getTag("_name"));
        this.moduleInit.call(classDecl.getTag("_name"), ["ctx", "m"]);
        // OPT: 7. expose class and constructor
    }
    addApiStructByName(structName, destructorName = null, options) {
        const struct = this.api.getStruct(structName);
        if (!struct)
            throw new Error("Struct not in API: " + structName);
        let destructor = null;
        if (destructorName !== null) {
            destructor = this.api.getFunction(destructorName);
            if (!destructor)
                throw new Error("Destructor func not in API: " + destructorName);
        }
        this.addApiStruct(struct, destructor, options);
    }
}
exports.RayLibHeader = RayLibHeader;


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
function main() {
    const api = JSON.parse((0, fs_1.readFileSync)("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'));
    const apiDesc = new api_1.ApiDescription(api);
    const core_gen = new raylib_header_1.RayLibHeader("raylib_core", apiDesc);
    core_gen.addApiFunctionByName("SetWindowTitle");
    core_gen.addApiFunctionByName("SetWindowPosition");
    core_gen.addApiFunctionByName("BeginDrawing");
    core_gen.addApiFunctionByName("EndDrawing");
    core_gen.writeTo("src/bindings/js_raylib_core.h");
    const texture_gen = new raylib_header_1.RayLibHeader("raylib_texture", apiDesc);
    texture_gen.addApiStructByName("Image", "UnloadImage", { properties: { width: { get: true } } });
    texture_gen.writeTo("src/bindings/js_raylib_texture.h");
}
main();

})();

/******/ })()
;