#ifndef JS_raylib_core_GUARD
#define JS_raylib_core_GUARD

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <quickjs.h>
#include <raylib.h>

#ifndef countof
#define countof(x) (sizeof(x) / sizeof((x)[0]))
#endif

static JSClassID js_Color_class_id;

static void js_Color_finalizer(JSRuntime * rt, JSValue val) {
    Color* ptr = JS_GetOpaque(val, js_Color_class_id);
    if(ptr) {
        TraceLog(LOG_INFO, "Finalize Color");
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Color_get_r(JSContext* ctx, JSValueConst this_val) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    unsigned char r = ptr->r;
    JSValue ret = JS_NewInt32(ctx, r);
    return ret;
}

static JSValue js_Color_set_r(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int _tmp;
    JS_ToInt32(ctx, &_tmp, v);
    unsigned char value = (unsigned char)_tmp;
    ptr->r = value;
    return JS_UNDEFINED;
}

static JSValue js_Color_get_g(JSContext* ctx, JSValueConst this_val) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    unsigned char g = ptr->g;
    JSValue ret = JS_NewInt32(ctx, g);
    return ret;
}

static JSValue js_Color_set_g(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int _tmp;
    JS_ToInt32(ctx, &_tmp, v);
    unsigned char value = (unsigned char)_tmp;
    ptr->g = value;
    return JS_UNDEFINED;
}

static JSValue js_Color_get_b(JSContext* ctx, JSValueConst this_val) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    unsigned char b = ptr->b;
    JSValue ret = JS_NewInt32(ctx, b);
    return ret;
}

static JSValue js_Color_set_b(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int _tmp;
    JS_ToInt32(ctx, &_tmp, v);
    unsigned char value = (unsigned char)_tmp;
    ptr->b = value;
    return JS_UNDEFINED;
}

static JSValue js_Color_get_a(JSContext* ctx, JSValueConst this_val) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    unsigned char a = ptr->a;
    JSValue ret = JS_NewInt32(ctx, a);
    return ret;
}

static JSValue js_Color_set_a(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Color* ptr = JS_GetOpaque2(ctx, this_val, js_Color_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    int _tmp;
    JS_ToInt32(ctx, &_tmp, v);
    unsigned char value = (unsigned char)_tmp;
    ptr->a = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Color_proto_funcs[] = {
    JS_CGETSET_DEF("r",js_Color_get_r,js_Color_set_r),
    JS_CGETSET_DEF("g",js_Color_get_g,js_Color_set_g),
    JS_CGETSET_DEF("b",js_Color_get_b,js_Color_set_b),
    JS_CGETSET_DEF("a",js_Color_get_a,js_Color_set_a),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Color", JS_PROP_CONFIGURABLE),
};

static int js_declare_Color(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Color_class_id);
    JSClassDef js_Color_def = { .class_name = "Color", .finalizer = js_Color_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Color_class_id, &js_Color_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Color_proto_funcs, countof(js_Color_proto_funcs));
    JS_SetClassProto(ctx, js_Color_class_id, proto);
    return 0;
}

static JSValue js_setWindowTitle(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * title = JS_ToCString(ctx, argv[0]);
    if(title == NULL) return JS_EXCEPTION;
    SetWindowTitle(title);
    JS_FreeCString(ctx, title);
    return JS_UNDEFINED;
}

static JSValue js_setWindowPosition(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int x;
    JS_ToInt32(ctx, &x, argv[0]);
    int y;
    JS_ToInt32(ctx, &y, argv[1]);
    SetWindowPosition(x, y);
    return JS_UNDEFINED;
}

static JSValue js_beginDrawing(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    BeginDrawing();
    return JS_UNDEFINED;
}

static JSValue js_endDrawing(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EndDrawing();
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_raylib_core_funcs[] = {
    JS_CFUNC_DEF("setWindowTitle",1,js_setWindowTitle),
    JS_CFUNC_DEF("setWindowPosition",2,js_setWindowPosition),
    JS_CFUNC_DEF("beginDrawing",0,js_beginDrawing),
    JS_CFUNC_DEF("endDrawing",0,js_endDrawing),
};

static int js_raylib_core_init(JSContext * ctx, JSModuleDef * m) {
    JS_SetModuleExportList(ctx, m,js_raylib_core_funcs,countof(js_raylib_core_funcs));
    js_declare_Color(ctx, m);
    return 0;
}

JSModuleDef * js_init_module_raylib_core(JSContext * ctx, const char * module_name) {
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_core_init);
    if(!m) return NULL;
    JS_AddModuleExportList(ctx, m, js_raylib_core_funcs, countof(js_raylib_core_funcs));
    return m;
}

#endif // JS_raylib_core_GUARD
