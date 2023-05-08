#ifndef JS_raylib_texture_GUARD
#define JS_raylib_texture_GUARD

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>
#include <raylib.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

static JSClassID js_Image_class_id;

static void js_Image_finalizer(JSRuntime * rt, JSValue val) {
    Image* ptr = JS_GetOpaque(val, js_Image_class_id);
    if(ptr) {
        TraceLog(LOG_INFO, "Finalize Image");
        UnloadImage(*ptr);
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Image_get_width(JSContext* ctx, JSValueConst this_val) {
    Image* ptr = JS_GetOpaque2(ctx, this_val, js_Image_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int width = ptr->width;
    JSValue ret = JS_NewInt32(ctx, width);
    return ret;
}

static JSValue js_Image_get_height(JSContext* ctx, JSValueConst this_val) {
    Image* ptr = JS_GetOpaque2(ctx, this_val, js_Image_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int height = ptr->height;
    JSValue ret = JS_NewInt32(ctx, height);
    return ret;
}

static const JSCFunctionListEntry js_Image_proto_funcs[] = {
    JS_CGETSET_DEF("width",js_Image_get_width,NULL),
    JS_CGETSET_DEF("height",js_Image_get_height,NULL),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Image", JS_PROP_CONFIGURABLE),
};

static int js_declare_Image(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Image_class_id);
    JSClassDef js_Image_def = { .class_name = "Image", .finalizer = js_Image_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Image_class_id, &js_Image_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Image_proto_funcs, countof(js_Image_proto_funcs));
    JS_SetClassProto(ctx, js_Image_class_id, proto);
    return 0;
}

static JSValue js_loadImage(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    Image returnVal = LoadImage(fileName);
    JS_FreeCString(ctx, fileName);
    Image* ptr = (Image*)js_malloc(ctx, sizeof(Image));
    *ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Image_class_id);
    JS_SetOpaque(ret, ptr);
    return ret;
}

static const JSCFunctionListEntry js_raylib_texture_funcs[] = {
    JS_CFUNC_DEF("loadImage",1,js_loadImage),
};

static int js_raylib_texture_init(JSContext * ctx, JSModuleDef * m) {
    JS_SetModuleExportList(ctx, m,js_raylib_texture_funcs,countof(js_raylib_texture_funcs));
    js_declare_Image(ctx, m);
    return 0;
}

JSModuleDef * js_init_module_raylib_texture(JSContext * ctx, const char * module_name) {
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_texture_init);
    if(!m) return NULL;
    JS_AddModuleExportList(ctx, m, js_raylib_texture_funcs, countof(js_raylib_texture_funcs));
    return m;
}

#endif // JS_raylib_texture_GUARD
