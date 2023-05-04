
#ifndef JS_raylib_core
#define JS_raylib_core

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

static JSValue js_setWindowTitle(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv){
    const char * title = JS_ToCString(ctx, argv[0]);
    return JS_UNDEFINED;
}

static JSValue js_setWindowPosition(JSContext *ctx, JSValueConst this_val, int argc, JSValueConst *argv){
    int x;
    JS_ToInt32(ctx, &x, argv[0]);
    int y;
    JS_ToInt32(ctx, &y, argv[1]);
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_raylib_core_funcs[] = {
    JS_CFUNC_DEF("setWindowTitle", 1, js_setWindowTitle),
    JS_CFUNC_DEF("setWindowPosition", 2, js_setWindowPosition)
};

static int js_raylib_core_init(JSContext *ctx, JSModuleDef *m){
  JS_SetModuleExportList(ctx, m, js_raylib_core_funcs,
    countof(js_raylib_core_funcs));
}

JSModuleDef *js_init_module_raylib_core(JSContext *ctx, const char *module_name)
{
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_core_init);
    if (!m)
        return NULL;

    JS_AddModuleExportList(ctx, m, js_raylib_core_funcs,
      countof(js_raylib_core_funcs));

    return m;
}

#endif
  