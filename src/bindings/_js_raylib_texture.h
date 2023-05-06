
#ifndef JS_raylib_texture
#define JS_raylib_texture

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

// 1. class id
static JSClassID js_image_class_id;


// 2. finalize
static void js_image_finalizer(JSRuntime *rt, JSValue val) {
    Image *image = JS_GetOpaque(val, js_image_class_id);
    if (image) {
        puts("Finalize image");
        UnloadImage(*image);
        js_free_rt(rt, image);
    }
}

// 3. getter/setter
static JSValue js_image_get_width(JSContext *ctx, JSValueConst this_val) {
    Image *image = JS_GetOpaque2(ctx, this_val, js_image_class_id);
    if (!image) {
        return JS_EXCEPTION;
    }
    int width = image->width;
    return JS_NewInt32(ctx, width);
}

static JSValue js_image_get_height(JSContext *ctx, JSValueConst this_val) {
    Image *image = JS_GetOpaque2(ctx, this_val, js_image_class_id);
    if (!image) {
        return JS_EXCEPTION;
    }
    int height = image->height;
    return JS_NewInt32(ctx, height);
}

// 4. class members
static const JSCFunctionListEntry js_image_proto_funcs[] = {
    JS_CGETSET_DEF("width", js_image_get_width, NULL),
    JS_CGETSET_DEF("height", js_image_get_height, NULL),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]", "Image", JS_PROP_CONFIGURABLE),
};

// 5. class declaration
static int js_declare_image(JSContext *ctx, JSModuleDef *m){
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
    return 0;
}

static JSValue js_LoadImage(JSContext *ctx, JSValueConst new_target, int argc, JSValueConst *argv) {
    const char *filename = JS_ToCString(ctx, argv[0]);
    
    Image _struct = LoadImage(filename);
    Image* ptr = (Image*)js_malloc(ctx, sizeof(Image));
    *ptr = _struct;
    JSValue obj = JS_NewObjectClass(ctx, js_image_class_id);
    JS_SetOpaque(obj, ptr);

    JS_FreeCString(ctx, filename);
    return obj;
}

static const JSCFunctionListEntry js_raylib_texture_funcs[] = {
    JS_CFUNC_DEF("loadImage", 1, js_LoadImage)
};

static int js_raylib_texture_init(JSContext *ctx, JSModuleDef *m) {
    // 6. call declaration
    js_declare_image(ctx, m);
    
    JS_SetModuleExportList(ctx, m, js_raylib_texture_funcs, countof(js_raylib_texture_funcs));

    // Implement constructor
    JSValue constr = JS_NewCFunction2(ctx, js_LoadImage, "Image", 4, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Image", constr);

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
    JS_AddModuleExport(ctx, m, "Image");

    return m;
}

#endif
  