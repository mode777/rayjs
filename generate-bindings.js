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

/***/ "./src/function.ts":
/*!*************************!*\
  !*** ./src/function.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayLibFunctionGenerator = void 0;
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
class RayLibFunctionGenerator extends generation_1.FunctionGenerator {
    constructor(jsName, func) {
        super("js_" + jsName, "JSValue", [
            { type: "JSContext *", name: "ctx" },
            { type: "JSValueConst", name: "this_val" },
            { type: "int", name: "argc" },
            { type: "JSValueConst *", name: "argv" },
        ], true);
        this.jsName = jsName;
        this.func = func;
        this.readParameters();
        this.callFunction();
        this.cleanUp();
        this.returnValue();
    }
    readParameters() {
        for (let i = 0; i < this.func.params.length; i++) {
            const para = this.func.params[i];
            this.readParameter(para, i);
        }
    }
    callFunction() {
        this.body.call(this.func.name, this.func.params.map(x => x.name), this.func.returnType === "void" ? null : { type: this.func.returnType, name: "returnVal" });
    }
    cleanUp() {
        for (const param of this.func.params) {
            this.cleanUpParameter(param);
        }
    }
    returnValue() {
        if (this.func.returnType === "void") {
            this.body.statement("return JS_UNDEFINED");
        }
        else {
            this.body.statement("return retVal");
        }
    }
    readParameter(para, index) {
        this.body.inline(`${para.type} ${para.name}`);
        switch (para.type) {
            case "const char *":
                this.body.statement(` = JS_ToCString(ctx, argv[${index}])`);
                this.body.statement(`if(${para.name} == NULL) return JS_EXCEPTION`);
                break;
            case "int":
                this.body.statement('');
                this.body.statement(`JS_ToInt32(ctx, &${para.name}, argv[${index}])`);
                break;
            default:
                throw new Error("Cannot handle parameter type: " + para.type);
        }
    }
    cleanUpParameter(param) {
        switch (param.type) {
            case "const char *":
                this.body.statement(`JS_FreeCString(ctx, ${param.name})`);
                break;
            default:
                break;
        }
    }
}
exports.RayLibFunctionGenerator = RayLibFunctionGenerator;


/***/ }),

/***/ "./src/functionList.ts":
/*!*****************************!*\
  !*** ./src/functionList.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayLibFunctionListGenerator = void 0;
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
class RayLibFunctionListGenerator extends generation_1.CodeGenerator {
    constructor(name) {
        super();
        this.name = name;
        this.entries = new generation_1.CodeGenerator();
        this.line("static const JSCFunctionListEntry " + name + "[] = {");
        this.indent();
        this.child(this.entries);
        this.unindent();
        this.statement("}");
    }
    addFunction(jsName, numArgs, cName) {
        this.entries.line(`JS_CFUNC_DEF("${jsName}",${numArgs},${cName}),`);
    }
    addPropertyString(key, value) {
        this.entries.line(`JS_PROP_STRING_DEF("${key}","${value}", JS_PROP_CONFIGURABLE),`);
    }
}
exports.RayLibFunctionListGenerator = RayLibFunctionListGenerator;


/***/ }),

/***/ "./src/generation.ts":
/*!***************************!*\
  !*** ./src/generation.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FunctionGenerator = exports.CustomFunctionGenerator = exports.HeaderGenerator = exports.ConditionGenerator = exports.CodeGenerator = exports.CodeWriter = exports.StringWriter = void 0;
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
class CodeGenerator {
    constructor() {
        this.children = [];
        this.text = [];
        this.tokens = [];
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
        this.tokens.push(Token.GOSUB);
        this.children.push(sub);
    }
    childFunc(sub, func) {
        this.child(sub);
        func(sub);
    }
    childFuncBody(sub, func) {
        this.child(sub);
        func(sub.body);
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
}
exports.CodeGenerator = CodeGenerator;
class ConditionGenerator extends CodeGenerator {
    constructor(condition) {
        super();
        this.body = new CodeGenerator();
        this.line("if(" + condition + ") {");
        this.indent();
        this.child(this.body);
        this.unindent();
        this.line("}");
    }
}
exports.ConditionGenerator = ConditionGenerator;
class HeaderGenerator extends CodeGenerator {
    guardStart(name) {
        this.line("#ifndef " + name);
        this.line("#define " + name);
    }
    guardEnd(name) {
        this.line("#endif // " + name);
    }
    include(name) {
        this.line("#include <" + name + ">");
    }
}
exports.HeaderGenerator = HeaderGenerator;
class CustomFunctionGenerator extends CodeGenerator {
    constructor(name, returnType, args, body, isStatic = false) {
        super();
        this.name = name;
        this.body = body;
        if (isStatic)
            this.inline("static ");
        this.inline(returnType + " " + name + "(");
        this.inline(args.map(x => x.type + " " + x.name).join(", "));
        this.inline(") {");
        this.breakLine();
        this.indent();
        this.child(body);
        this.unindent();
        this.line("}");
    }
}
exports.CustomFunctionGenerator = CustomFunctionGenerator;
class FunctionGenerator extends CustomFunctionGenerator {
    constructor(name, returnType, args, isStatic = false, body = new CodeGenerator()) {
        super(name, returnType, args, body, isStatic);
    }
}
exports.FunctionGenerator = FunctionGenerator;


/***/ }),

/***/ "./src/header.ts":
/*!***********************!*\
  !*** ./src/header.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayLibHeaderGenerator = void 0;
const function_1 = __webpack_require__(/*! ./function */ "./src/function.ts");
const functionList_1 = __webpack_require__(/*! ./functionList */ "./src/functionList.ts");
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
const struct_1 = __webpack_require__(/*! ./struct */ "./src/struct.ts");
class RayLibHeaderGenerator extends generation_1.HeaderGenerator {
    constructor(name, api) {
        super();
        this.name = name;
        this.api = api;
        this.moduleInit = new generation_1.CodeGenerator();
        this.moduleEntry = new generation_1.CodeGenerator();
        this.declarations = new generation_1.CodeGenerator();
        this.body = new generation_1.CodeGenerator();
        this.moduleFunctionList = new functionList_1.RayLibFunctionListGenerator("js_" + name + "_funcs");
        this.init();
    }
    addApiFunction(func, jsName = null) {
        const jName = jsName || func.name.charAt(0).toLowerCase() + func.name.slice(1);
        const gen = new function_1.RayLibFunctionGenerator(jName, func);
        this.body.child(gen);
        this.body.breakLine();
        this.moduleFunctionList.addFunction(jName, func.argc, gen.name);
    }
    addApiFunctionByName(name, jsName = null) {
        const func = this.api.getFunction(name);
        if (func === null)
            throw new Error("Function not in API: " + name);
        this.addApiFunction(func, jsName);
    }
    addApiStruct(struct, destructor, options) {
        const classIdName = `js_${struct.name}_class_id`;
        this.declarations.declare(classIdName, "JSClassID", true);
        const gen = new struct_1.RayLibStructGenerator(classIdName, struct, destructor, options);
        this.body.child(gen);
        this.moduleInit.call(gen.classDeclarationName, ["ctx", "m"]);
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
    init() {
        const guardName = "JS_" + this.name + "_GUARD";
        this.guardStart(guardName);
        this.breakLine();
        this.include("stdio.h");
        this.include("stdlib.h");
        this.include("string.h");
        this.breakLine();
        this.include("quickjs.h");
        this.include("raylib.h");
        this.breakLine();
        this.line("#ifndef countof");
        this.line("#define countof(x) (sizeof(x) / sizeof((x)[0]))");
        this.line("#endif");
        this.breakLine();
        this.child(this.declarations);
        this.breakLine();
        this.child(this.body);
        this.child(this.moduleFunctionList);
        this.breakLine();
        const moduleInitFunc = new generation_1.FunctionGenerator("js_" + this.name + "_init", "int", [
            { type: "JSContext *", name: "ctx" },
            { type: "JSModuleDef *", name: "m" }
        ]);
        moduleInitFunc.body.statement(`JS_SetModuleExportList(ctx, m,${this.moduleFunctionList.name},countof(${this.moduleFunctionList.name}))`);
        moduleInitFunc.body.child(this.moduleInit);
        moduleInitFunc.body.statement("return 0");
        this.child(moduleInitFunc);
        this.breakLine();
        const moduleEntryFunc = new generation_1.FunctionGenerator("js_init_module_" + this.name, "JSModuleDef *", [
            { type: "JSContext *", name: "ctx" },
            { type: "const char *", name: "module_name" }
        ]);
        moduleEntryFunc.body.statement("JSModuleDef *m");
        moduleEntryFunc.body.statement(`m = JS_NewCModule(ctx, module_name, ${moduleInitFunc.name})`);
        moduleEntryFunc.body.statement("if(!m) return NULL");
        moduleEntryFunc.body.statement(`JS_AddModuleExportList(ctx, m, ${this.moduleFunctionList.name}, countof(${this.moduleFunctionList.name}))`);
        moduleEntryFunc.body.child(this.moduleEntry);
        moduleEntryFunc.body.statement("return m");
        this.child(moduleEntryFunc);
        this.breakLine();
        this.guardEnd(guardName);
    }
}
exports.RayLibHeaderGenerator = RayLibHeaderGenerator;


/***/ }),

/***/ "./src/struct.ts":
/*!***********************!*\
  !*** ./src/struct.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayLibStructGenerator = void 0;
const functionList_1 = __webpack_require__(/*! ./functionList */ "./src/functionList.ts");
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
class RayLibStructGenerator extends generation_1.CodeGenerator {
    constructor(classId, struct, destructor, options) {
        super();
        this.classId = classId;
        this.struct = struct;
        this.destructor = destructor;
        this.finalizerName = "";
        this.classDeclarationName = "";
        this.options = options || {};
        this.funcList = new functionList_1.RayLibFunctionListGenerator(`js_${struct.name}_proto_funcs`);
        this.declareFinalizer();
        this.breakLine();
        this.declareGetterSetter();
        this.funcList.addPropertyString("[Symbol.toStringTag]", "Image");
        this.child(this.funcList);
        this.breakLine();
        this.buildClassDeclaration();
        this.breakLine();
    }
    declareFinalizer() {
        this.finalizerName = `js_${this.struct.name}_finalizer`;
        this.childFuncBody(new generation_1.FunctionGenerator(this.finalizerName, "void", [
            { type: "JSRuntime *", name: "rt" },
            { type: "JSValue", name: "val" }
        ], true), body => {
            body.statement(`${this.struct.name}* ptr = JS_GetOpaque(val, ${this.classId})`);
            body.childFuncBody(new generation_1.ConditionGenerator("ptr"), cond => {
                cond.call("puts", ["\"Finalize " + this.struct.name + "\""]);
                if (this.destructor)
                    cond.call(this.destructor.name, ["*ptr"]);
                cond.call("js_free_rt", ["rt", "ptr"]);
            });
        });
    }
    declareGetterSetter() {
        // Add to funList
    }
    buildClassDeclaration() {
        this.classDeclarationName = "js_declare_" + this.struct.name;
        this.childFuncBody(new generation_1.FunctionGenerator(this.classDeclarationName, "int", [{ type: "JSContext *", name: "ctx" }, { type: "JSModuleDef *", name: "m" }], true), body => {
            body.call("JS_NewClassID", ["&" + this.classId]);
            const classDefName = `js_${this.struct.name}_def`;
            body.declare(classDefName, "JSClassDef", false, `{ .class_name = "${this.struct.name}", .finalizer = ${this.finalizerName} }`);
            body.call("JS_NewClass", ["JS_GetRuntime(ctx)", this.classId, "&" + classDefName]);
            body.declare("proto", "JSValue", false, "JS_NewObject(ctx)");
            body.call("JS_SetPropertyFunctionList", ["ctx", "proto", this.funcList.name, `countof(${this.funcList.name})`]);
            body.call("JS_SetClassProto", ["ctx", this.classId, "proto"]);
            body.statement("return 0");
        });
    }
}
exports.RayLibStructGenerator = RayLibStructGenerator;


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
const generation_1 = __webpack_require__(/*! ./generation */ "./src/generation.ts");
const api_1 = __webpack_require__(/*! ./api */ "./src/api.ts");
const header_1 = __webpack_require__(/*! ./header */ "./src/header.ts");
const bindings = JSON.parse((0, fs_1.readFileSync)("bindings.json", 'utf8'));
function writeHeader(header, filename) {
    const writer = new generation_1.CodeWriter();
    writer.writeGenerator(header);
    (0, fs_1.writeFileSync)(filename, writer.toString());
}
function main() {
    const api = JSON.parse((0, fs_1.readFileSync)("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'));
    const apiDesc = new api_1.ApiDescription(api);
    const core_gen = new header_1.RayLibHeaderGenerator("raylib_core", apiDesc);
    core_gen.addApiFunctionByName("SetWindowTitle");
    core_gen.addApiFunctionByName("SetWindowPosition");
    core_gen.addApiFunctionByName("BeginDrawing");
    core_gen.addApiFunctionByName("EndDrawing");
    writeHeader(core_gen, "src/bindings/js_raylib_core.h");
    const texture_gen = new header_1.RayLibHeaderGenerator("raylib_texture", apiDesc);
    texture_gen.addApiStructByName("Image", "UnloadImage");
    writeHeader(texture_gen, "src/bindings/js_raylib_texture.h");
}
main();

})();

/******/ })()
;