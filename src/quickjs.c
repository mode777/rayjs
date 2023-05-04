#include <quickjs.h>
#include <quickjs-libc.h>

#include <raylib.h>

#include "common.h"

static JSContext *JS_NewCustomContext(JSRuntime *rt);
static int eval_buf(JSContext *ctx, const void *buf, int buf_len,
                    const char *filename, int eval_flags);

static JSRuntime* rt;
static JSContext* ctx;

int app_init_quickjs(int argc, char** argv){
    rt = JS_NewRuntime();
    if (!rt)
    {
        fprintf(stderr, "qjs: cannot allocate JS runtime\n");
        return -1;
    }
    js_std_set_worker_new_context_func(JS_NewCustomContext);
    js_std_init_handlers(rt);
    ctx = JS_NewCustomContext(rt);
    if (!ctx) {
        fprintf(stderr, "qjs: cannot allocate JS context\n");
        return -1;
    }

    JS_SetModuleLoaderFunc(rt, NULL, js_module_loader, NULL);
    
    js_std_add_helpers(ctx, argc, argv);

    // const char *str = "import * as std from 'std';\n"
    //             "import * as os from 'os';\n"
    //             "globalThis.std = std;\n"
    //             "globalThis.os = os;\n";
    // eval_buf(ctx, str, strlen(str), "<input>", JS_EVAL_TYPE_MODULE);

    const char* filename = "main.js";
    const char* buf = LoadFileText(filename);
    size_t len = strlen(buf);
    if (!buf) {
        JS_ThrowReferenceError(ctx, "could not load module filename '%s'",
                                filename);
        return -1;
    }
    int res = eval_buf(ctx, buf, len, "main", JS_EVAL_TYPE_MODULE);
    if(res){
        return res;
    }
    return 0;
}

int app_update_quickjs(){
    JSContext *ctx1;
    int err;

    /* execute the pending jobs */
    for(;;) {
        err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
        if (err <= 0) {
            if (err < 0) {
                js_std_dump_error(ctx1);
            }
            break;
        }
    }
    return 0;
}

int app_dispose_quickjs(){
    js_std_free_handlers(rt);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    return 0;
}

/* also used to initialize the worker context */
static JSContext *JS_NewCustomContext(JSRuntime *rt)
{
    JSContext *ctx;
    ctx = JS_NewContext(rt);
    if (!ctx)
        return NULL;

    /* system modules */
    js_init_module_std(ctx, "std");
    js_init_module_os(ctx, "os");
    js_init_module_raylib_core(ctx, "raylib.core");
    return ctx;
}

static const JSCFunctionListEntry js_raylib_core_funcs[] = {
    JS_FUNC_DEF("beginDrawing", 0, js_raylib_core_beginDrawing);
    // JS_CFUNC_DEF("exit", 1, js_std_exit ),
    // JS_CFUNC_DEF("gc", 0, js_std_gc ),
    // JS_CFUNC_DEF("evalScript", 1, js_evalScript ),
    // JS_CFUNC_DEF("loadScript", 1, js_loadScript ),
    // JS_CFUNC_DEF("getenv", 1, js_std_getenv ),
    // JS_CFUNC_DEF("setenv", 1, js_std_setenv ),
    // JS_CFUNC_DEF("unsetenv", 1, js_std_unsetenv ),
    // JS_CFUNC_DEF("getenviron", 1, js_std_getenviron ),
    // JS_CFUNC_DEF("urlGet", 1, js_std_urlGet ),
    // JS_CFUNC_DEF("loadFile", 1, js_std_loadFile ),
    // JS_CFUNC_DEF("strerror", 1, js_std_strerror ),
    // JS_CFUNC_DEF("parseExtJSON", 1, js_std_parseExtJSON ),
    
    // /* FILE I/O */
    // JS_CFUNC_DEF("open", 2, js_std_open ),
    // JS_CFUNC_DEF("popen", 2, js_std_popen ),
    // JS_CFUNC_DEF("fdopen", 2, js_std_fdopen ),
    // JS_CFUNC_DEF("tmpfile", 0, js_std_tmpfile ),
    // JS_CFUNC_MAGIC_DEF("puts", 1, js_std_file_puts, 0 ),
    // JS_CFUNC_DEF("printf", 1, js_std_printf ),
    // JS_CFUNC_DEF("sprintf", 1, js_std_sprintf ),
    // JS_PROP_INT32_DEF("SEEK_SET", SEEK_SET, JS_PROP_CONFIGURABLE ),
    // JS_PROP_INT32_DEF("SEEK_CUR", SEEK_CUR, JS_PROP_CONFIGURABLE ),
    // JS_PROP_INT32_DEF("SEEK_END", SEEK_END, JS_PROP_CONFIGURABLE ),
    // JS_OBJECT_DEF("Error", js_std_error_props, countof(js_std_error_props), JS_PROP_CONFIGURABLE),
};

static int js_raylib_core_init(JSContext *ctx, JSModuleDef *m)
{
    JSValue proto;
    
    // /* FILE class */
    // /* the class ID is created once */
    // JS_NewClassID(&js_std_file_class_id);
    // /* the class is created once per runtime */
    // JS_NewClass(JS_GetRuntime(ctx), js_std_file_class_id, &js_std_file_class);
    // proto = JS_NewObject(ctx);
    // JS_SetPropertyFunctionList(ctx, proto, js_std_file_proto_funcs,
    //                            countof(js_std_file_proto_funcs));
    // JS_SetClassProto(ctx, js_std_file_class_id, proto);

    JS_SetModuleExportList(ctx, m, js_raylib_core_funcs,
                           countof(js_raylib_core_funcs));

    // JS_SetModuleExport(ctx, m, "in", js_new_std_file(ctx, stdin, FALSE, FALSE));
    // JS_SetModuleExport(ctx, m, "out", js_new_std_file(ctx, stdout, FALSE, FALSE));
    // JS_SetModuleExport(ctx, m, "err", js_new_std_file(ctx, stderr, FALSE, FALSE));
    return 0;
}

JSModuleDef *js_init_module_raylib_core(JSContext *ctx, const char *module_name)
{
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_core_init);
    if (!m)
        return NULL;

    return m;
}

static int eval_buf(JSContext *ctx, const void *buf, int buf_len,
                    const char *filename, int eval_flags)
{
    JSValue val;
    int ret;

    if ((eval_flags & JS_EVAL_TYPE_MASK) == JS_EVAL_TYPE_MODULE) {
        /* for the modules, we compile then run to be able to set
           import.meta */
        val = JS_Eval(ctx, (const char*)buf, buf_len, filename,
                      eval_flags | JS_EVAL_FLAG_COMPILE_ONLY);
        if (!JS_IsException(val)) {
            js_module_set_import_meta(ctx, val, 1, 1);
            val = JS_EvalFunction(ctx, val);
        }
    } else {
        val = JS_Eval(ctx, (const char*)buf, buf_len, filename, eval_flags);
    }
    if (JS_IsException(val)) {
        js_std_dump_error(ctx);
        ret = -1;
    } else {
        ret = 0;
    }
    JS_FreeValue(ctx, val);
    return ret;
}