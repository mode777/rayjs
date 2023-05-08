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
        puts("Finalize Image");
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

static const JSCFunctionListEntry js_Image_proto_funcs[] = {
    JS_CGETSET_DEF("width",js_Image_get_width,NULL),
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

static const JSCFunctionListEntry js_raylib_texture_funcs[] = {
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
