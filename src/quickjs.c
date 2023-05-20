#include <quickjs.h>
#include <quickjs-libc.h>

#include <raylib.h>

#include "common.h"

static JSContext *JS_NewCustomContext(JSRuntime *rt);
static int eval_buf(JSContext *ctx, const void *buf, int buf_len,
                    const char *filename, int eval_flags);

static JSRuntime* rt;
static JSContext* ctx;

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

void SetModelMaterial(Model *model, int materialIndex, Material material)
{
    if(model->materialCount <= materialIndex) return;
    UnloadMaterial(model->materials[materialIndex]);
    model->materials[materialIndex] = material;
}

#include "bindings/js_raylib_core.h"

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

    const char *str = "import * as rl from 'raylib'\n" 
                      "for (const key in rl) { globalThis[key] = rl[key] }\n";

    // const char *str = "import * as std from 'std';\n"
    //             "import * as os from 'os';\n"
    //             "globalThis.std = std;\n"
    //             "globalThis.os = os;\n";
    eval_buf(ctx, str, strlen(str), "<input>", JS_EVAL_TYPE_MODULE);

    const char* filename = argc > 1 ? argv[1] : "main.js";
    const char* buf = LoadFileText(filename);
    if (!buf) {
        JS_ThrowReferenceError(ctx, "could not load module filename '%s'",
                                filename);
        return -1;
    }
    size_t len = strlen(buf);
    int res = eval_buf(ctx, buf, len, "main", JS_EVAL_TYPE_MODULE);
    if(res){
        return res;
    }
    return 0;
}



int app_dispose_quickjs(){
    //js_std_free_handlers(rt);
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
    //js_init_module_os(ctx, "os");
    js_init_module_raylib_core(ctx, "raylib");
    return ctx;
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