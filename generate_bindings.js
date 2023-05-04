// Run with Node.js

const fs = require('fs');
const { connect } = require('http2');
let api, modules

async function main(){
  api = await readJson('thirdparty/raylib/parser/output/raylib_api.json')
  modules = await readJson('bindings.json')
  
  const headers = modules.map(generateModule)

  modules.forEach(async (header,i) => {
    await writeFile(`src/bindings/js_${header.name}.h`, headers[i])
  });
}

class FunctionList {
  definitions = []

  addFunctionDef(name, args, cname){
    this.definitions.push(`JS_CFUNC_DEF("${name}", ${args}, ${cname})`)
  }
  
  addIntConst(name, val){
    this.definitions.push(`JS_PROP_INT32_DEF("${name}", ${val})`)
  }

  generate(name){
    return `static const JSCFunctionListEntry js_${name}_funcs[] = {
${this.definitions.map(x => "    "+x).join(",\n")}
};`
  }
}

const generateModule = (mod) => {
  const fl = new FunctionList()
  let content = mod.functions.map(generateFunction(fl)).join("\n\n")
  content += "\n\n" + fl.generate(mod.name)
  return generateHeader(mod.name, content)
}

const generateFunction = (functionList) => (func) => {
  const api = findFunction(func.name)
  const cfunc = new CFunction(func, api, functionList)
  return cfunc.generate()
}

const generateParameter = (param,i) => {
  switch(param.type){
    case "const char *":
      return `${param.type} ${param.name} = JS_ToCString(ctx, argv[${i}]);`
    case "int":
      return `${param.type} ${param.name};\n    JS_ToInt32(ctx, &${param.name}, argv[${i}]);`
  }
}

class CFunction {
  constructor(func, api, functionList){
    this.func = func
    this.api = api
    this.functionList = functionList
    this.functionName = `js_${func.jsName}`
  }

  generateParameters(){
    return this.api.params.map(generateParameter)
  }

  generate(){
    this.functionList.addFunctionDef(this.func.jsName, this.api.params.length, this.functionName)
    return `static JSValue ${this.functionName}(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv){
${this.generateParameters().map(x => "    "+x).join("\n")}
    return JS_UNDEFINED;
}`
  }
}

const findFunction = (name) => findIn(api.functions,name)

const findIn = (arr, name) => arr.find(x => x.name == name)


async function readJson(path){
  const c = await readFile(path)
  return JSON.parse(c)
}

function readFile(path) {
  const p = new Promise((res,rej) => {
    fs.readFile(path, 'utf8', (err,data) => {
      if(err) rej(error)
      else res(data)
    })
  })
  return p 
}

function writeFile(path, data){
  return new Promise((res, rej) => {
    fs.writeFile(path, data, (err) => {
      if(err) rej(err)
      else res()
    })
  })
}

function generateHeader(name, content){
  return `
#ifndef JS_${name}
#define JS_${name}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

${content}

static int js_${name}_init(JSContext *ctx, JSModuleDef *m){
  JS_SetModuleExportList(ctx, m, js_${name}_funcs,
    countof(js_${name}_funcs));
}

JSModuleDef *js_init_module_${name}(JSContext *ctx, const char *module_name)
{
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_${name}_init);
    if (!m)
        return NULL;

    JS_AddModuleExportList(ctx, m, js_${name}_funcs,
      countof(js_${name}_funcs));

    return m;
}

#endif
  `
}

main()