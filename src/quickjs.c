#include <stdbool.h>
#include <assert.h>
#include <limits.h>
#include <errno.h>
#include <quickjs.h>
//#include <quickjs-libc.h>
#include <GLFW/glfw3.h>
#include <raylib.h>

#include "common.h"

static JSContext *JS_NewCustomContext(JSRuntime *rt);
static int eval_buf(JSContext *ctx, const void *buf, int buf_len,
                    const char *filename, int eval_flags);

static JSRuntime* rt;
static JSContext* ctx;
static bool shouldReload = true;
static const char* originalCwd = NULL;

static void pstrcpy(char *buf, int buf_size, const char *str)
{
    int c;
    char *q = buf;

    if (buf_size <= 0)
        return;

    for(;;) {
        c = *str++;
        if (c == 0 || q >= buf + buf_size - 1)
            break;
        *q++ = c;
    }
    *q = '\0';
}

/* strcat and truncate. */
static char *pstrcat(char *buf, int buf_size, const char *s)
{
    int len;
    len = strlen(buf);
    if (len < buf_size)
        pstrcpy(buf + len, buf_size - len, s);
    return buf;
}

static void js_dump_obj(JSContext *ctx, FILE *f, JSValueConst val)
{
    const char *str;
    
    str = JS_ToCString(ctx, val);
    if (str) {
        fprintf(f, "%s\n", str);
        JS_FreeCString(ctx, str);
    } else {
        fprintf(f, "[exception]\n");
    }
}

static void js_std_dump_error1(JSContext *ctx, JSValueConst exception_val)
{
    JSValue val;
    bool is_error;
    
    is_error = JS_IsError(ctx, exception_val);
    js_dump_obj(ctx, stderr, exception_val);
    if (is_error) {
        val = JS_GetPropertyStr(ctx, exception_val, "stack");
        if (!JS_IsUndefined(val)) {
            js_dump_obj(ctx, stderr, val);
        }
        JS_FreeValue(ctx, val);
    }
}


static void js_std_dump_error(JSContext *ctx)
{
    JSValue exception_val;
    
    exception_val = JS_GetException(ctx);
    js_std_dump_error1(ctx, exception_val);
    JS_FreeValue(ctx, exception_val);
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
    if(IsKeyPressed(KEY_F5)){
        GLFWwindow* window = glfwGetCurrentContext();
        glfwSetWindowShouldClose(window, GLFW_TRUE);
        shouldReload = true;
    }

    return 0;
}

static int js_module_set_import_meta(JSContext *ctx, JSValueConst func_val,
                              JS_BOOL use_realpath, JS_BOOL is_main)
{
    JSModuleDef *m;
    char buf[1024 + 16];
    JSValue meta_obj;
    JSAtom module_name_atom;
    const char *module_name;
    
    assert(JS_VALUE_GET_TAG(func_val) == JS_TAG_MODULE);
    m = JS_VALUE_GET_PTR(func_val);

    module_name_atom = JS_GetModuleName(ctx, m);
    module_name = JS_AtomToCString(ctx, module_name_atom);
    JS_FreeAtom(ctx, module_name_atom);
    if (!module_name)
        return -1;
    if (!strchr(module_name, ':')) {
        strcpy(buf, "file://");
#if !defined(_WIN32)
        /* realpath() cannot be used with modules compiled with qjsc
           because the corresponding module source code is not
           necessarily present */
        if (use_realpath) {
            char *res = realpath(module_name, buf + strlen(buf));
            if (!res) {
                JS_ThrowTypeError(ctx, "realpath failure");
                JS_FreeCString(ctx, module_name);
                return -1;
            }
        } else
#endif
        {
            pstrcat(buf, sizeof(buf), module_name);
        }
    } else {
        pstrcpy(buf, sizeof(buf), module_name);
    }
    JS_FreeCString(ctx, module_name);
    
    meta_obj = JS_GetImportMeta(ctx, m);
    if (JS_IsException(meta_obj))
        return -1;
    JS_DefinePropertyValueStr(ctx, meta_obj, "url",
                              JS_NewString(ctx, buf),
                              JS_PROP_C_W_E);
    JS_DefinePropertyValueStr(ctx, meta_obj, "main",
                              JS_NewBool(ctx, is_main),
                              JS_PROP_C_W_E);
    JS_FreeValue(ctx, meta_obj);
    return 0;
}

static uint8_t *js_load_file(JSContext *ctx, size_t *pbuf_len, const char *filename)
{
    FILE *f;
    uint8_t *buf;
    size_t buf_len;
    long lret;
    
    f = fopen(filename, "rb");
    if (!f)
        return NULL;
    if (fseek(f, 0, SEEK_END) < 0)
        goto fail;
    lret = ftell(f);
    if (lret < 0)
        goto fail;
    /* XXX: on Linux, ftell() return LONG_MAX for directories */
    if (lret == LONG_MAX) {
        errno = EISDIR;
        goto fail;
    }
    buf_len = lret;
    if (fseek(f, 0, SEEK_SET) < 0)
        goto fail;
    if (ctx)
        buf = js_malloc(ctx, buf_len + 1);
    else
        buf = malloc(buf_len + 1);
    if (!buf)
        goto fail;
    if (fread(buf, 1, buf_len, f) != buf_len) {
        errno = EIO;
        if (ctx)
            js_free(ctx, buf);
        else
            free(buf);
    fail:
        fclose(f);
        return NULL;
    }
    buf[buf_len] = '\0';
    fclose(f);
    *pbuf_len = buf_len;
    return buf;
}

void SetModelMaterial(Model *model, int materialIndex, Material material)
{
    if(model->materialCount <= materialIndex) return;
    UnloadMaterial(model->materials[materialIndex]);
    model->materials[materialIndex] = material;
}

void SetShaderLocation(Shader *shader, int constant, int location){
    shader->locs[constant] = location;
}

Color ImageReadPixel(Image *image, int x, int y){
    int sizeOfPixel = GetPixelDataSize(image->width, image->height, image->format) / (image->width*image->height);
    return GetPixelColor((void *)((unsigned char *)image->data) + (sizeOfPixel*(image->width*y+x)),image->format);
}

#include "bindings/js_raylib_core.h"

JSModuleDef *js_module_loader(JSContext *ctx,
                              const char *module_name, void *opaque)
{
    JSModuleDef *m;

    size_t buf_len;
    uint8_t *buf;
    JSValue func_val;

    buf = js_load_file(ctx, &buf_len, module_name);
    if (!buf) {
        JS_ThrowReferenceError(ctx, "could not load module filename '%s'", module_name);
        return NULL;
    }
    
    /* compile the module */
    func_val = JS_Eval(ctx, (char *)buf, buf_len, module_name,
                        JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY);
    js_free(ctx, buf);
    if (JS_IsException(func_val))
        return NULL;
    /* XXX: could propagate the exception */
    js_module_set_import_meta(ctx, func_val, true, false);
    /* the module is already referenced, so we must free it */
    m = JS_VALUE_GET_PTR(func_val);
    JS_FreeValue(ctx, func_val);

    return m;
}

static int js_run(int argc, char** argv){
    TraceLog(LOG_INFO, "Starting QuickJS");
    rt = JS_NewRuntime();
    if (!rt)
    {
        fprintf(stderr, "qjs: cannot allocate JS runtime\n");
        return -1;
    }
    //js_std_set_worker_new_context_func(JS_NewCustomContext);
    //js_std_init_handlers(rt);
    ctx = JS_NewCustomContext(rt);
    if (!ctx) {
        fprintf(stderr, "qjs: cannot allocate JS context\n");
        return -1;
    }

    JS_SetModuleLoaderFunc(rt, NULL, js_module_loader, NULL);
    
    //js_std_add_helpers(ctx, argc, argv);

    const char *str = "import * as rl from 'raylib'\n" 
                      "for (const key in rl) { globalThis[key] = rl[key] }\n";

    // const char *str = "import * as std from 'std';\n"
    //             "import * as os from 'os';\n"
    //             "globalThis.std = std;\n"
    //             "globalThis.os = os;\n";
    eval_buf(ctx, str, strlen(str), "<input>", JS_EVAL_TYPE_MODULE);

    const char *buf;
    if(argc <= 1){
        const char *exePath = GetDirectoryPath(argv[0]); 
        TraceLog(LOG_INFO, "No parameters, looking for '%s/main.js'", exePath);
        ChangeDirectory(exePath);
        buf = LoadFileText("main.js");
    } else if(argc > 1) {
        // parameter is directory
        if(DirectoryExists(argv[1])){
            ChangeDirectory(argv[1]);
            TraceLog(LOG_INFO, "Parameter is directory, looking for '%s/main.js'", argv[1]);
            buf = LoadFileText("main.js");
        // parameter is file
        } else {
            TraceLog(LOG_INFO, "Parameter is file, loading '%s'", argv[1]);
            buf = LoadFileText(argv[1]);
            ChangeDirectory(GetDirectoryPath(argv[1]));
        }
    }

    TraceLog(LOG_INFO, "Working directory is %s", GetWorkingDirectory());
    if (!buf) {
        JS_ThrowReferenceError(ctx, "could not find main module '%s'",argc > 1 ? argv[0] : "main.js");
        return -1;
    }
    size_t len = strlen(buf);
    int res = eval_buf(ctx, buf, len, "main", JS_EVAL_TYPE_MODULE);

    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    
    return 0;
}

int app_run_quickjs(int argc, char** argv){
    const char* original = GetWorkingDirectory();
    char* copy = calloc(strlen(original) + 1, sizeof(char));
    strcpy(copy, original); 
    originalCwd = copy;
    while(shouldReload){
        shouldReload = false;
        ChangeDirectory(originalCwd);
        js_run(argc, argv);
    }
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
    //js_init_module_std(ctx, "std");
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