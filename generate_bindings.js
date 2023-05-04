// Run with Node.js

const fs = require('fs');
let api, bindings

async function main(){
  api = await readJson('thirdparty/raylib/parser/output/raylib_api.json')
  bindings = await readJson('bindings.json')
  
  const headers = bindings.map(generateModule)

  bindings.forEach(async (header,i) => {
    await writeFile(`js_${header.header}.h`, headers[i])
  });
}

class FunctionList {
  definitions = []

  addFunctionDef(name, args, funcname){
    this.definitions.push(``)
  }
}

const generateModule = (mod) => {

}

const generateFunction = (func) => {
  const api = findFunction(func.name)
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

function templateHeader(name, content){
  const res = `
#ifndef JS_${name}
#define JS_${name}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

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

    return m;
}

#endif
  `
}

main()