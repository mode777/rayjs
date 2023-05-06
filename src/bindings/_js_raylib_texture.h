
#ifndef JS_raylib_texture
#define JS_raylib_texture

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

static JSClassID js_image_class_id;

typedef struct {
    Image *image;
    JSContext *ctx;
    JSValue this_obj;
} JSImage;

static void js_image_finalizer(JSRuntime *rt, JSValue val) {
    JSImage *js_image = JS_GetOpaque(val, js_image_class_id);
    if (js_image) {
        UnloadImage(*js_image->image);
        js_free(js_image->ctx, js_image);
    }
}

static JSValue js_image_constructor(JSContext *ctx, JSValueConst new_target, int argc, JSValueConst *argv) {
    const char *filename = JS_ToCString(ctx, argv[0]);
    Image image = LoadImage(filename);
    JS_FreeCString(ctx, filename);
    JSImage *js_image = js_malloc(ctx, sizeof(JSImage));
    js_image->ctx = ctx;
    js_image->image = js_malloc(ctx, sizeof(Image));
    *js_image->image = image;
    js_image->this_obj = JS_UNDEFINED;
    JSValue obj = JS_NewObjectClass(ctx, js_image_class_id);
    js_image->this_obj = obj;
    JS_SetOpaque(obj, js_image);
    return obj;
}

static JSValue js_image_get_width(JSContext *ctx, JSValueConst this_val) {
    JSImage *js_image = JS_GetOpaque2(ctx, this_val, js_image_class_id);
    if (!js_image) {
        return JS_EXCEPTION;
    }
    int width = js_image->image->width;
    return JS_NewInt32(ctx, width);
}

static JSValue js_image_get_height(JSContext *ctx, JSValueConst this_val) {
    JSImage *js_image = JS_GetOpaque2(ctx, this_val, js_image_class_id);
    if (!js_image) {
        return JS_EXCEPTION;
    }
    int height = js_image->image->height;
    return JS_NewInt32(ctx, height);
}

static const JSCFunctionListEntry js_image_proto_funcs[] = {
    JS_CGETSET_DEF("width", js_image_get_width, NULL),
    JS_CGETSET_DEF("height", js_image_get_height, NULL),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]", "Image", JS_PROP_CONFIGURABLE),
};

static const JSCFunctionListEntry js_raylib_texture_funcs[] = {
    JS_CFUNC_DEF("open", 2, js_std_open )
};

static int js_raylib_texture_init(JSContext *ctx, JSModuleDef *m) {
    // Define image struct
    JS_NewClassID(&js_image_class_id);
    JSClassDef js_image_class_def = {
        .class_name = "Image",
        .finalizer = js_image_finalizer,
    };
    JS_NewClass(JS_GetRuntime(ctx), js_image_class_id, &js_image_class_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_image_proto_funcs, countof(js_image_proto_funcs));
    JS_SetClassProto(ctx, js_image_class_id, proto);

    JS_SetModuleExportList(ctx, m, js_raylib_texture_funcs, countof(js_raylib_texture_funcs));

    // TODO export module constants
    //JS_SetModuleExport(ctx, m, "in", js_new_std_file(ctx, stdin, FALSE, FALSE));

    return 0;
}

JSModuleDef *js_init_module_raylib_texture(JSContext *ctx, const char *module_name)
{
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_texture_init);
    if (!m)
        return NULL;

    JS_AddModuleExportList(ctx, m, js_raylib_texture_funcs,countof(js_raylib_texture_funcs));

    //TODO export module contants
    //JS_AddModuleExport(ctx, m, "in");

    return m;
}

#endif
  