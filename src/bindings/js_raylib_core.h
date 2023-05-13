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
static JSClassID js_Rectangle_class_id;
static JSClassID js_Vector2_class_id;
static JSClassID js_Vector3_class_id;
static JSClassID js_Ray_class_id;
static JSClassID js_Camera2D_class_id;
static JSClassID js_Matrix_class_id;

static void js_Color_finalizer(JSRuntime * rt, JSValue val) {
    Color* ptr = JS_GetOpaque(val, js_Color_class_id);
    if(ptr) {
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
    int _int_value;
    JS_ToInt32(ctx, &_int_value, v);
    unsigned char value = (unsigned char)_int_value;
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
    int _int_value;
    JS_ToInt32(ctx, &_int_value, v);
    unsigned char value = (unsigned char)_int_value;
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
    int _int_value;
    JS_ToInt32(ctx, &_int_value, v);
    unsigned char value = (unsigned char)_int_value;
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
    int _int_value;
    JS_ToInt32(ctx, &_int_value, v);
    unsigned char value = (unsigned char)_int_value;
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

static void js_Rectangle_finalizer(JSRuntime * rt, JSValue val) {
    Rectangle* ptr = JS_GetOpaque(val, js_Rectangle_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Rectangle_get_x(JSContext* ctx, JSValueConst this_val) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float x = ptr->x;
    JSValue ret = JS_NewFloat64(ctx, x);
    return ret;
}

static JSValue js_Rectangle_set_x(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->x = value;
    return JS_UNDEFINED;
}

static JSValue js_Rectangle_get_y(JSContext* ctx, JSValueConst this_val) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float y = ptr->y;
    JSValue ret = JS_NewFloat64(ctx, y);
    return ret;
}

static JSValue js_Rectangle_set_y(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->y = value;
    return JS_UNDEFINED;
}

static JSValue js_Rectangle_get_width(JSContext* ctx, JSValueConst this_val) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float width = ptr->width;
    JSValue ret = JS_NewFloat64(ctx, width);
    return ret;
}

static JSValue js_Rectangle_set_width(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->width = value;
    return JS_UNDEFINED;
}

static JSValue js_Rectangle_get_height(JSContext* ctx, JSValueConst this_val) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float height = ptr->height;
    JSValue ret = JS_NewFloat64(ctx, height);
    return ret;
}

static JSValue js_Rectangle_set_height(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Rectangle* ptr = JS_GetOpaque2(ctx, this_val, js_Rectangle_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->height = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Rectangle_proto_funcs[] = {
    JS_CGETSET_DEF("x",js_Rectangle_get_x,js_Rectangle_set_x),
    JS_CGETSET_DEF("y",js_Rectangle_get_y,js_Rectangle_set_y),
    JS_CGETSET_DEF("width",js_Rectangle_get_width,js_Rectangle_set_width),
    JS_CGETSET_DEF("height",js_Rectangle_get_height,js_Rectangle_set_height),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Rectangle", JS_PROP_CONFIGURABLE),
};

static int js_declare_Rectangle(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Rectangle_class_id);
    JSClassDef js_Rectangle_def = { .class_name = "Rectangle", .finalizer = js_Rectangle_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Rectangle_class_id, &js_Rectangle_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Rectangle_proto_funcs, countof(js_Rectangle_proto_funcs));
    JS_SetClassProto(ctx, js_Rectangle_class_id, proto);
    return 0;
}

static void js_Vector2_finalizer(JSRuntime * rt, JSValue val) {
    Vector2* ptr = JS_GetOpaque(val, js_Vector2_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Vector2_get_x(JSContext* ctx, JSValueConst this_val) {
    Vector2* ptr = JS_GetOpaque2(ctx, this_val, js_Vector2_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float x = ptr->x;
    JSValue ret = JS_NewFloat64(ctx, x);
    return ret;
}

static JSValue js_Vector2_set_x(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Vector2* ptr = JS_GetOpaque2(ctx, this_val, js_Vector2_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->x = value;
    return JS_UNDEFINED;
}

static JSValue js_Vector2_get_y(JSContext* ctx, JSValueConst this_val) {
    Vector2* ptr = JS_GetOpaque2(ctx, this_val, js_Vector2_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float y = ptr->y;
    JSValue ret = JS_NewFloat64(ctx, y);
    return ret;
}

static JSValue js_Vector2_set_y(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Vector2* ptr = JS_GetOpaque2(ctx, this_val, js_Vector2_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->y = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Vector2_proto_funcs[] = {
    JS_CGETSET_DEF("x",js_Vector2_get_x,js_Vector2_set_x),
    JS_CGETSET_DEF("y",js_Vector2_get_y,js_Vector2_set_y),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Vector2", JS_PROP_CONFIGURABLE),
};

static int js_declare_Vector2(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Vector2_class_id);
    JSClassDef js_Vector2_def = { .class_name = "Vector2", .finalizer = js_Vector2_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Vector2_class_id, &js_Vector2_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Vector2_proto_funcs, countof(js_Vector2_proto_funcs));
    JS_SetClassProto(ctx, js_Vector2_class_id, proto);
    return 0;
}

static void js_Vector3_finalizer(JSRuntime * rt, JSValue val) {
    Vector3* ptr = JS_GetOpaque(val, js_Vector3_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Vector3_get_x(JSContext* ctx, JSValueConst this_val) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float x = ptr->x;
    JSValue ret = JS_NewFloat64(ctx, x);
    return ret;
}

static JSValue js_Vector3_set_x(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->x = value;
    return JS_UNDEFINED;
}

static JSValue js_Vector3_get_y(JSContext* ctx, JSValueConst this_val) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float y = ptr->y;
    JSValue ret = JS_NewFloat64(ctx, y);
    return ret;
}

static JSValue js_Vector3_set_y(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->y = value;
    return JS_UNDEFINED;
}

static JSValue js_Vector3_get_z(JSContext* ctx, JSValueConst this_val) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float z = ptr->z;
    JSValue ret = JS_NewFloat64(ctx, z);
    return ret;
}

static JSValue js_Vector3_set_z(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Vector3* ptr = JS_GetOpaque2(ctx, this_val, js_Vector3_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->z = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Vector3_proto_funcs[] = {
    JS_CGETSET_DEF("x",js_Vector3_get_x,js_Vector3_set_x),
    JS_CGETSET_DEF("y",js_Vector3_get_y,js_Vector3_set_y),
    JS_CGETSET_DEF("z",js_Vector3_get_z,js_Vector3_set_z),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Vector3", JS_PROP_CONFIGURABLE),
};

static int js_declare_Vector3(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Vector3_class_id);
    JSClassDef js_Vector3_def = { .class_name = "Vector3", .finalizer = js_Vector3_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Vector3_class_id, &js_Vector3_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Vector3_proto_funcs, countof(js_Vector3_proto_funcs));
    JS_SetClassProto(ctx, js_Vector3_class_id, proto);
    return 0;
}

static void js_Ray_finalizer(JSRuntime * rt, JSValue val) {
    Ray* ptr = JS_GetOpaque(val, js_Ray_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Ray_set_position(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Ray* ptr = JS_GetOpaque2(ctx, this_val, js_Ray_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    Vector3* value_ptr = (Vector3*)JS_GetOpaque2(ctx, v, js_Vector3_class_id);
    if(value_ptr == NULL) return JS_EXCEPTION;
    Vector3 value = *value_ptr;
    ptr->position = value;
    return JS_UNDEFINED;
}

static JSValue js_Ray_set_direction(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Ray* ptr = JS_GetOpaque2(ctx, this_val, js_Ray_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    Vector3* value_ptr = (Vector3*)JS_GetOpaque2(ctx, v, js_Vector3_class_id);
    if(value_ptr == NULL) return JS_EXCEPTION;
    Vector3 value = *value_ptr;
    ptr->direction = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Ray_proto_funcs[] = {
    JS_CGETSET_DEF("position",NULL,js_Ray_set_position),
    JS_CGETSET_DEF("direction",NULL,js_Ray_set_direction),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Ray", JS_PROP_CONFIGURABLE),
};

static int js_declare_Ray(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Ray_class_id);
    JSClassDef js_Ray_def = { .class_name = "Ray", .finalizer = js_Ray_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Ray_class_id, &js_Ray_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Ray_proto_funcs, countof(js_Ray_proto_funcs));
    JS_SetClassProto(ctx, js_Ray_class_id, proto);
    return 0;
}

static void js_Camera2D_finalizer(JSRuntime * rt, JSValue val) {
    Camera2D* ptr = JS_GetOpaque(val, js_Camera2D_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static JSValue js_Camera2D_set_offset(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    Vector2* value_ptr = (Vector2*)JS_GetOpaque2(ctx, v, js_Vector2_class_id);
    if(value_ptr == NULL) return JS_EXCEPTION;
    Vector2 value = *value_ptr;
    ptr->offset = value;
    return JS_UNDEFINED;
}

static JSValue js_Camera2D_set_target(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    Vector2* value_ptr = (Vector2*)JS_GetOpaque2(ctx, v, js_Vector2_class_id);
    if(value_ptr == NULL) return JS_EXCEPTION;
    Vector2 value = *value_ptr;
    ptr->target = value;
    return JS_UNDEFINED;
}

static JSValue js_Camera2D_get_rotation(JSContext* ctx, JSValueConst this_val) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float rotation = ptr->rotation;
    JSValue ret = JS_NewFloat64(ctx, rotation);
    return ret;
}

static JSValue js_Camera2D_set_rotation(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->rotation = value;
    return JS_UNDEFINED;
}

static JSValue js_Camera2D_get_zoom(JSContext* ctx, JSValueConst this_val) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    float zoom = ptr->zoom;
    JSValue ret = JS_NewFloat64(ctx, zoom);
    return ret;
}

static JSValue js_Camera2D_set_zoom(JSContext* ctx, JSValueConst this_val, JSValueConst v) {
    Camera2D* ptr = JS_GetOpaque2(ctx, this_val, js_Camera2D_class_id);
    if(!ptr) {
        return JS_EXCEPTION;
    }
    double _double_value;
    JS_ToFloat64(ctx, &_double_value, v);
    float value = (float)_double_value;
    ptr->zoom = value;
    return JS_UNDEFINED;
}

static const JSCFunctionListEntry js_Camera2D_proto_funcs[] = {
    JS_CGETSET_DEF("offset",NULL,js_Camera2D_set_offset),
    JS_CGETSET_DEF("target",NULL,js_Camera2D_set_target),
    JS_CGETSET_DEF("rotation",js_Camera2D_get_rotation,js_Camera2D_set_rotation),
    JS_CGETSET_DEF("zoom",js_Camera2D_get_zoom,js_Camera2D_set_zoom),
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Camera2D", JS_PROP_CONFIGURABLE),
};

static int js_declare_Camera2D(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Camera2D_class_id);
    JSClassDef js_Camera2D_def = { .class_name = "Camera2D", .finalizer = js_Camera2D_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Camera2D_class_id, &js_Camera2D_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Camera2D_proto_funcs, countof(js_Camera2D_proto_funcs));
    JS_SetClassProto(ctx, js_Camera2D_class_id, proto);
    return 0;
}

static void js_Matrix_finalizer(JSRuntime * rt, JSValue val) {
    Matrix* ptr = JS_GetOpaque(val, js_Matrix_class_id);
    if(ptr) {
        js_free_rt(rt, ptr);
    }
}

static const JSCFunctionListEntry js_Matrix_proto_funcs[] = {
    JS_PROP_STRING_DEF("[Symbol.toStringTag]","Matrix", JS_PROP_CONFIGURABLE),
};

static int js_declare_Matrix(JSContext * ctx, JSModuleDef * m) {
    JS_NewClassID(&js_Matrix_class_id);
    JSClassDef js_Matrix_def = { .class_name = "Matrix", .finalizer = js_Matrix_finalizer };
    JS_NewClass(JS_GetRuntime(ctx), js_Matrix_class_id, &js_Matrix_def);
    JSValue proto = JS_NewObject(ctx);
    JS_SetPropertyFunctionList(ctx, proto, js_Matrix_proto_funcs, countof(js_Matrix_proto_funcs));
    JS_SetClassProto(ctx, js_Matrix_class_id, proto);
    return 0;
}

static JSValue js_Color_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int _int_r;
    JS_ToInt32(ctx, &_int_r, argv[0]);
    unsigned char r = (unsigned char)_int_r;
    int _int_g;
    JS_ToInt32(ctx, &_int_g, argv[1]);
    unsigned char g = (unsigned char)_int_g;
    int _int_b;
    JS_ToInt32(ctx, &_int_b, argv[2]);
    unsigned char b = (unsigned char)_int_b;
    int _int_a;
    JS_ToInt32(ctx, &_int_a, argv[3]);
    unsigned char a = (unsigned char)_int_a;
    Color _struct = { r, g, b, a };
    Color* _return_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_Rectangle_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    double _double_x;
    JS_ToFloat64(ctx, &_double_x, argv[0]);
    float x = (float)_double_x;
    double _double_y;
    JS_ToFloat64(ctx, &_double_y, argv[1]);
    float y = (float)_double_y;
    double _double_width;
    JS_ToFloat64(ctx, &_double_width, argv[2]);
    float width = (float)_double_width;
    double _double_height;
    JS_ToFloat64(ctx, &_double_height, argv[3]);
    float height = (float)_double_height;
    Rectangle _struct = { x, y, width, height };
    Rectangle* _return_ptr = (Rectangle*)js_malloc(ctx, sizeof(Rectangle));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Rectangle_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_Vector2_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    double _double_x;
    JS_ToFloat64(ctx, &_double_x, argv[0]);
    float x = (float)_double_x;
    double _double_y;
    JS_ToFloat64(ctx, &_double_y, argv[1]);
    float y = (float)_double_y;
    Vector2 _struct = { x, y };
    Vector2* _return_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_Vector3_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    double _double_x;
    JS_ToFloat64(ctx, &_double_x, argv[0]);
    float x = (float)_double_x;
    double _double_y;
    JS_ToFloat64(ctx, &_double_y, argv[1]);
    float y = (float)_double_y;
    double _double_z;
    JS_ToFloat64(ctx, &_double_z, argv[2]);
    float z = (float)_double_z;
    Vector3 _struct = { x, y, z };
    Vector3* _return_ptr = (Vector3*)js_malloc(ctx, sizeof(Vector3));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Vector3_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_Ray_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector3* position_ptr = (Vector3*)JS_GetOpaque2(ctx, argv[0], js_Vector3_class_id);
    if(position_ptr == NULL) return JS_EXCEPTION;
    Vector3 position = *position_ptr;
    Vector3* direction_ptr = (Vector3*)JS_GetOpaque2(ctx, argv[1], js_Vector3_class_id);
    if(direction_ptr == NULL) return JS_EXCEPTION;
    Vector3 direction = *direction_ptr;
    Ray _struct = { position, direction };
    Ray* _return_ptr = (Ray*)js_malloc(ctx, sizeof(Ray));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Ray_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_Camera2D_constructor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2* offset_ptr = (Vector2*)JS_GetOpaque2(ctx, argv[0], js_Vector2_class_id);
    if(offset_ptr == NULL) return JS_EXCEPTION;
    Vector2 offset = *offset_ptr;
    Vector2* target_ptr = (Vector2*)JS_GetOpaque2(ctx, argv[1], js_Vector2_class_id);
    if(target_ptr == NULL) return JS_EXCEPTION;
    Vector2 target = *target_ptr;
    double _double_rotation;
    JS_ToFloat64(ctx, &_double_rotation, argv[2]);
    float rotation = (float)_double_rotation;
    double _double_zoom;
    JS_ToFloat64(ctx, &_double_zoom, argv[3]);
    float zoom = (float)_double_zoom;
    Camera2D _struct = { offset, target, rotation, zoom };
    Camera2D* _return_ptr = (Camera2D*)js_malloc(ctx, sizeof(Camera2D));
    *_return_ptr = _struct;
    JSValue _return = JS_NewObjectClass(ctx, js_Camera2D_class_id);
    JS_SetOpaque(_return, _return_ptr);
    return _return;
}

static JSValue js_initWindow(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[0]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[1]);
    const char * title = JS_ToCString(ctx, argv[2]);
    if(title == NULL) return JS_EXCEPTION;
    InitWindow(width, height, title);
    JS_FreeCString(ctx, title);
    return JS_UNDEFINED;
}

static JSValue js_windowShouldClose(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = WindowShouldClose();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_closeWindow(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    CloseWindow();
    return JS_UNDEFINED;
}

static JSValue js_isWindowReady(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowReady();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowFullscreen(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowFullscreen();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowHidden(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowHidden();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowMinimized(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowMinimized();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowMaximized(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowMaximized();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowFocused(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowFocused();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowResized(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsWindowResized();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isWindowState(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    unsigned int flag;
    JS_ToInt32(ctx, (int *)&flag, argv[0]);
    bool returnVal = IsWindowState(flag);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_setWindowState(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    unsigned int flags;
    JS_ToInt32(ctx, (int *)&flags, argv[0]);
    SetWindowState(flags);
    return JS_UNDEFINED;
}

static JSValue js_clearWindowState(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    unsigned int flags;
    JS_ToInt32(ctx, (int *)&flags, argv[0]);
    ClearWindowState(flags);
    return JS_UNDEFINED;
}

static JSValue js_toggleFullscreen(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    ToggleFullscreen();
    return JS_UNDEFINED;
}

static JSValue js_maximizeWindow(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    MaximizeWindow();
    return JS_UNDEFINED;
}

static JSValue js_minimizeWindow(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    MinimizeWindow();
    return JS_UNDEFINED;
}

static JSValue js_restoreWindow(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    RestoreWindow();
    return JS_UNDEFINED;
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
    JS_ToInt32(ctx, (int *)&x, argv[0]);
    int y;
    JS_ToInt32(ctx, (int *)&y, argv[1]);
    SetWindowPosition(x, y);
    return JS_UNDEFINED;
}

static JSValue js_setWindowMonitor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    SetWindowMonitor(monitor);
    return JS_UNDEFINED;
}

static JSValue js_setWindowMinSize(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[0]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[1]);
    SetWindowMinSize(width, height);
    return JS_UNDEFINED;
}

static JSValue js_setWindowSize(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[0]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[1]);
    SetWindowSize(width, height);
    return JS_UNDEFINED;
}

static JSValue js_setWindowOpacity(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    double _double_opacity;
    JS_ToFloat64(ctx, &_double_opacity, argv[0]);
    float opacity = (float)_double_opacity;
    SetWindowOpacity(opacity);
    return JS_UNDEFINED;
}

static JSValue js_getScreenWidth(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetScreenWidth();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getScreenHeight(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetScreenHeight();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getRenderWidth(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetRenderWidth();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getRenderHeight(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetRenderHeight();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorCount(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetMonitorCount();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getCurrentMonitor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetCurrentMonitor();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorPosition(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    Vector2 returnVal = GetMonitorPosition(monitor);
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_getMonitorWidth(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    int returnVal = GetMonitorWidth(monitor);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorHeight(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    int returnVal = GetMonitorHeight(monitor);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorPhysicalWidth(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    int returnVal = GetMonitorPhysicalWidth(monitor);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorPhysicalHeight(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    int returnVal = GetMonitorPhysicalHeight(monitor);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getMonitorRefreshRate(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    int returnVal = GetMonitorRefreshRate(monitor);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getWindowPosition(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2 returnVal = GetWindowPosition();
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_getWindowScaleDPI(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2 returnVal = GetWindowScaleDPI();
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_getMonitorName(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int monitor;
    JS_ToInt32(ctx, (int *)&monitor, argv[0]);
    const char * returnVal = GetMonitorName(monitor);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_setClipboardText(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * text = JS_ToCString(ctx, argv[0]);
    if(text == NULL) return JS_EXCEPTION;
    SetClipboardText(text);
    JS_FreeCString(ctx, text);
    return JS_UNDEFINED;
}

static JSValue js_getClipboardText(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * returnVal = GetClipboardText();
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_enableEventWaiting(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EnableEventWaiting();
    return JS_UNDEFINED;
}

static JSValue js_disableEventWaiting(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    DisableEventWaiting();
    return JS_UNDEFINED;
}

static JSValue js_showCursor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    ShowCursor();
    return JS_UNDEFINED;
}

static JSValue js_hideCursor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    HideCursor();
    return JS_UNDEFINED;
}

static JSValue js_isCursorHidden(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsCursorHidden();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_enableCursor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EnableCursor();
    return JS_UNDEFINED;
}

static JSValue js_disableCursor(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    DisableCursor();
    return JS_UNDEFINED;
}

static JSValue js_isCursorOnScreen(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsCursorOnScreen();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_clearBackground(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[0], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    ClearBackground(color);
    return JS_UNDEFINED;
}

static JSValue js_beginDrawing(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    BeginDrawing();
    return JS_UNDEFINED;
}

static JSValue js_endDrawing(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    app_update_quickjs();
    EndDrawing();
    return JS_UNDEFINED;
}

static JSValue js_beginMode2D(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Camera2D* camera_ptr = (Camera2D*)JS_GetOpaque2(ctx, argv[0], js_Camera2D_class_id);
    if(camera_ptr == NULL) return JS_EXCEPTION;
    Camera2D camera = *camera_ptr;
    BeginMode2D(camera);
    return JS_UNDEFINED;
}

static JSValue js_endMode2D(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EndMode2D();
    return JS_UNDEFINED;
}

static JSValue js_beginBlendMode(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int mode;
    JS_ToInt32(ctx, (int *)&mode, argv[0]);
    BeginBlendMode(mode);
    return JS_UNDEFINED;
}

static JSValue js_endBlendMode(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EndBlendMode();
    return JS_UNDEFINED;
}

static JSValue js_beginScissorMode(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int x;
    JS_ToInt32(ctx, (int *)&x, argv[0]);
    int y;
    JS_ToInt32(ctx, (int *)&y, argv[1]);
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[2]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[3]);
    BeginScissorMode(x, y, width, height);
    return JS_UNDEFINED;
}

static JSValue js_endScissorMode(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    EndScissorMode();
    return JS_UNDEFINED;
}

static JSValue js_getCameraMatrix2D(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Camera2D* camera_ptr = (Camera2D*)JS_GetOpaque2(ctx, argv[0], js_Camera2D_class_id);
    if(camera_ptr == NULL) return JS_EXCEPTION;
    Camera2D camera = *camera_ptr;
    Matrix returnVal = GetCameraMatrix2D(camera);
    Matrix* ret_ptr = (Matrix*)js_malloc(ctx, sizeof(Matrix));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Matrix_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_getScreenToWorld2D(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2* position_ptr = (Vector2*)JS_GetOpaque2(ctx, argv[0], js_Vector2_class_id);
    if(position_ptr == NULL) return JS_EXCEPTION;
    Vector2 position = *position_ptr;
    Camera2D* camera_ptr = (Camera2D*)JS_GetOpaque2(ctx, argv[1], js_Camera2D_class_id);
    if(camera_ptr == NULL) return JS_EXCEPTION;
    Camera2D camera = *camera_ptr;
    Vector2 returnVal = GetScreenToWorld2D(position, camera);
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_getWorldToScreen2D(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2* position_ptr = (Vector2*)JS_GetOpaque2(ctx, argv[0], js_Vector2_class_id);
    if(position_ptr == NULL) return JS_EXCEPTION;
    Vector2 position = *position_ptr;
    Camera2D* camera_ptr = (Camera2D*)JS_GetOpaque2(ctx, argv[1], js_Camera2D_class_id);
    if(camera_ptr == NULL) return JS_EXCEPTION;
    Camera2D camera = *camera_ptr;
    Vector2 returnVal = GetWorldToScreen2D(position, camera);
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_setTargetFPS(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int fps;
    JS_ToInt32(ctx, (int *)&fps, argv[0]);
    SetTargetFPS(fps);
    return JS_UNDEFINED;
}

static JSValue js_getFPS(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int returnVal = GetFPS();
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getFrameTime(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    float returnVal = GetFrameTime();
    JSValue ret = JS_NewFloat64(ctx, returnVal);
    return ret;
}

static JSValue js_getTime(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    double returnVal = GetTime();
    JSValue ret = JS_NewFloat64(ctx, returnVal);
    return ret;
}

static JSValue js_getRandomValue(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int min;
    JS_ToInt32(ctx, (int *)&min, argv[0]);
    int max;
    JS_ToInt32(ctx, (int *)&max, argv[1]);
    int returnVal = GetRandomValue(min, max);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_setRandomSeed(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    unsigned int seed;
    JS_ToInt32(ctx, (int *)&seed, argv[0]);
    SetRandomSeed(seed);
    return JS_UNDEFINED;
}

static JSValue js_takeScreenshot(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    TakeScreenshot(fileName);
    JS_FreeCString(ctx, fileName);
    return JS_UNDEFINED;
}

static JSValue js_setConfigFlags(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    unsigned int flags;
    JS_ToInt32(ctx, (int *)&flags, argv[0]);
    SetConfigFlags(flags);
    return JS_UNDEFINED;
}

static JSValue js_traceLog(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int logLevel;
    JS_ToInt32(ctx, (int *)&logLevel, argv[0]);
    const char * text = JS_ToCString(ctx, argv[1]);
    if(text == NULL) return JS_EXCEPTION;
    TraceLog(logLevel, text);
    JS_FreeCString(ctx, text);
    return JS_UNDEFINED;
}

static JSValue js_setTraceLogLevel(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int logLevel;
    JS_ToInt32(ctx, (int *)&logLevel, argv[0]);
    SetTraceLogLevel(logLevel);
    return JS_UNDEFINED;
}

static JSValue js_openURL(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * url = JS_ToCString(ctx, argv[0]);
    if(url == NULL) return JS_EXCEPTION;
    OpenURL(url);
    JS_FreeCString(ctx, url);
    return JS_UNDEFINED;
}

static JSValue js_loadFileText(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    char * returnVal = LoadFileText(fileName);
    JS_FreeCString(ctx, fileName);
    UnloadFileText(returnVal);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_saveFileText(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    char * text = JS_ToCString(ctx, argv[1]);
    if(text == NULL) return JS_EXCEPTION;
    bool returnVal = SaveFileText(fileName, text);
    JS_FreeCString(ctx, fileName);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_fileExists(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    bool returnVal = FileExists(fileName);
    JS_FreeCString(ctx, fileName);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_directoryExists(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * dirPath = JS_ToCString(ctx, argv[0]);
    if(dirPath == NULL) return JS_EXCEPTION;
    bool returnVal = DirectoryExists(dirPath);
    JS_FreeCString(ctx, dirPath);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isFileExtension(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    const char * ext = JS_ToCString(ctx, argv[1]);
    if(ext == NULL) return JS_EXCEPTION;
    bool returnVal = IsFileExtension(fileName, ext);
    JS_FreeCString(ctx, fileName);
    JS_FreeCString(ctx, ext);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_getFileLength(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    int returnVal = GetFileLength(fileName);
    JS_FreeCString(ctx, fileName);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_getFileExtension(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    const char * returnVal = GetFileExtension(fileName);
    JS_FreeCString(ctx, fileName);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getFileName(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * filePath = JS_ToCString(ctx, argv[0]);
    if(filePath == NULL) return JS_EXCEPTION;
    const char * returnVal = GetFileName(filePath);
    JS_FreeCString(ctx, filePath);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getFileNameWithoutExt(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * filePath = JS_ToCString(ctx, argv[0]);
    if(filePath == NULL) return JS_EXCEPTION;
    const char * returnVal = GetFileNameWithoutExt(filePath);
    JS_FreeCString(ctx, filePath);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getDirectoryPath(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * filePath = JS_ToCString(ctx, argv[0]);
    if(filePath == NULL) return JS_EXCEPTION;
    const char * returnVal = GetDirectoryPath(filePath);
    JS_FreeCString(ctx, filePath);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getPrevDirectoryPath(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * dirPath = JS_ToCString(ctx, argv[0]);
    if(dirPath == NULL) return JS_EXCEPTION;
    const char * returnVal = GetPrevDirectoryPath(dirPath);
    JS_FreeCString(ctx, dirPath);
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getWorkingDirectory(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * returnVal = GetWorkingDirectory();
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_getApplicationDirectory(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * returnVal = GetApplicationDirectory();
    JSValue ret = JS_NewString(ctx, returnVal);
    return ret;
}

static JSValue js_changeDirectory(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * dir = JS_ToCString(ctx, argv[0]);
    if(dir == NULL) return JS_EXCEPTION;
    bool returnVal = ChangeDirectory(dir);
    JS_FreeCString(ctx, dir);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isPathFile(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * path = JS_ToCString(ctx, argv[0]);
    if(path == NULL) return JS_EXCEPTION;
    bool returnVal = IsPathFile(path);
    JS_FreeCString(ctx, path);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isFileDropped(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    bool returnVal = IsFileDropped();
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_getFileModTime(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * fileName = JS_ToCString(ctx, argv[0]);
    if(fileName == NULL) return JS_EXCEPTION;
    long returnVal = GetFileModTime(fileName);
    JS_FreeCString(ctx, fileName);
    JSValue ret = JS_NewInt32(ctx, returnVal);
    return ret;
}

static JSValue js_drawText(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    const char * text = JS_ToCString(ctx, argv[0]);
    if(text == NULL) return JS_EXCEPTION;
    int posX;
    JS_ToInt32(ctx, (int *)&posX, argv[1]);
    int posY;
    JS_ToInt32(ctx, (int *)&posY, argv[2]);
    int fontSize;
    JS_ToInt32(ctx, (int *)&fontSize, argv[3]);
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[4], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawText(text, posX, posY, fontSize, color);
    JS_FreeCString(ctx, text);
    return JS_UNDEFINED;
}

static JSValue js_drawLine(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int startPosX;
    JS_ToInt32(ctx, (int *)&startPosX, argv[0]);
    int startPosY;
    JS_ToInt32(ctx, (int *)&startPosY, argv[1]);
    int endPosX;
    JS_ToInt32(ctx, (int *)&endPosX, argv[2]);
    int endPosY;
    JS_ToInt32(ctx, (int *)&endPosY, argv[3]);
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[4], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawLine(startPosX, startPosY, endPosX, endPosY, color);
    return JS_UNDEFINED;
}

static JSValue js_drawCircleV(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2* center_ptr = (Vector2*)JS_GetOpaque2(ctx, argv[0], js_Vector2_class_id);
    if(center_ptr == NULL) return JS_EXCEPTION;
    Vector2 center = *center_ptr;
    double _double_radius;
    JS_ToFloat64(ctx, &_double_radius, argv[1]);
    float radius = (float)_double_radius;
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[2], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawCircleV(center, radius, color);
    return JS_UNDEFINED;
}

static JSValue js_isKeyDown(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int key;
    JS_ToInt32(ctx, (int *)&key, argv[0]);
    bool returnVal = IsKeyDown(key);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_isKeyPressed(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int key;
    JS_ToInt32(ctx, (int *)&key, argv[0]);
    bool returnVal = IsKeyPressed(key);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_getMousePosition(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Vector2 returnVal = GetMousePosition();
    Vector2* ret_ptr = (Vector2*)js_malloc(ctx, sizeof(Vector2));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Vector2_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static JSValue js_isMouseButtonPressed(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int button;
    JS_ToInt32(ctx, (int *)&button, argv[0]);
    bool returnVal = IsMouseButtonPressed(button);
    JSValue ret = JS_NewBool(ctx, returnVal);
    return ret;
}

static JSValue js_getMouseWheelMove(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    float returnVal = GetMouseWheelMove();
    JSValue ret = JS_NewFloat64(ctx, returnVal);
    return ret;
}

static JSValue js_drawRectangle(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int posX;
    JS_ToInt32(ctx, (int *)&posX, argv[0]);
    int posY;
    JS_ToInt32(ctx, (int *)&posY, argv[1]);
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[2]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[3]);
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[4], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawRectangle(posX, posY, width, height, color);
    return JS_UNDEFINED;
}

static JSValue js_drawRectangleRec(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Rectangle* rec_ptr = (Rectangle*)JS_GetOpaque2(ctx, argv[0], js_Rectangle_class_id);
    if(rec_ptr == NULL) return JS_EXCEPTION;
    Rectangle rec = *rec_ptr;
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[1], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawRectangleRec(rec, color);
    return JS_UNDEFINED;
}

static JSValue js_drawRectangleLines(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    int posX;
    JS_ToInt32(ctx, (int *)&posX, argv[0]);
    int posY;
    JS_ToInt32(ctx, (int *)&posY, argv[1]);
    int width;
    JS_ToInt32(ctx, (int *)&width, argv[2]);
    int height;
    JS_ToInt32(ctx, (int *)&height, argv[3]);
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[4], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    DrawRectangleLines(posX, posY, width, height, color);
    return JS_UNDEFINED;
}

static JSValue js_fade(JSContext * ctx, JSValueConst this_val, int argc, JSValueConst * argv) {
    Color* color_ptr = (Color*)JS_GetOpaque2(ctx, argv[0], js_Color_class_id);
    if(color_ptr == NULL) return JS_EXCEPTION;
    Color color = *color_ptr;
    double _double_alpha;
    JS_ToFloat64(ctx, &_double_alpha, argv[1]);
    float alpha = (float)_double_alpha;
    Color returnVal = Fade(color, alpha);
    Color* ret_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *ret_ptr = returnVal;
    JSValue ret = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(ret, ret_ptr);
    return ret;
}

static const JSCFunctionListEntry js_raylib_core_funcs[] = {
    JS_CFUNC_DEF("initWindow",3,js_initWindow),
    JS_CFUNC_DEF("windowShouldClose",0,js_windowShouldClose),
    JS_CFUNC_DEF("closeWindow",0,js_closeWindow),
    JS_CFUNC_DEF("isWindowReady",0,js_isWindowReady),
    JS_CFUNC_DEF("isWindowFullscreen",0,js_isWindowFullscreen),
    JS_CFUNC_DEF("isWindowHidden",0,js_isWindowHidden),
    JS_CFUNC_DEF("isWindowMinimized",0,js_isWindowMinimized),
    JS_CFUNC_DEF("isWindowMaximized",0,js_isWindowMaximized),
    JS_CFUNC_DEF("isWindowFocused",0,js_isWindowFocused),
    JS_CFUNC_DEF("isWindowResized",0,js_isWindowResized),
    JS_CFUNC_DEF("isWindowState",1,js_isWindowState),
    JS_CFUNC_DEF("setWindowState",1,js_setWindowState),
    JS_CFUNC_DEF("clearWindowState",1,js_clearWindowState),
    JS_CFUNC_DEF("toggleFullscreen",0,js_toggleFullscreen),
    JS_CFUNC_DEF("maximizeWindow",0,js_maximizeWindow),
    JS_CFUNC_DEF("minimizeWindow",0,js_minimizeWindow),
    JS_CFUNC_DEF("restoreWindow",0,js_restoreWindow),
    JS_CFUNC_DEF("setWindowTitle",1,js_setWindowTitle),
    JS_CFUNC_DEF("setWindowPosition",2,js_setWindowPosition),
    JS_CFUNC_DEF("setWindowMonitor",1,js_setWindowMonitor),
    JS_CFUNC_DEF("setWindowMinSize",2,js_setWindowMinSize),
    JS_CFUNC_DEF("setWindowSize",2,js_setWindowSize),
    JS_CFUNC_DEF("setWindowOpacity",1,js_setWindowOpacity),
    JS_CFUNC_DEF("getScreenWidth",0,js_getScreenWidth),
    JS_CFUNC_DEF("getScreenHeight",0,js_getScreenHeight),
    JS_CFUNC_DEF("getRenderWidth",0,js_getRenderWidth),
    JS_CFUNC_DEF("getRenderHeight",0,js_getRenderHeight),
    JS_CFUNC_DEF("getMonitorCount",0,js_getMonitorCount),
    JS_CFUNC_DEF("getCurrentMonitor",0,js_getCurrentMonitor),
    JS_CFUNC_DEF("getMonitorPosition",1,js_getMonitorPosition),
    JS_CFUNC_DEF("getMonitorWidth",1,js_getMonitorWidth),
    JS_CFUNC_DEF("getMonitorHeight",1,js_getMonitorHeight),
    JS_CFUNC_DEF("getMonitorPhysicalWidth",1,js_getMonitorPhysicalWidth),
    JS_CFUNC_DEF("getMonitorPhysicalHeight",1,js_getMonitorPhysicalHeight),
    JS_CFUNC_DEF("getMonitorRefreshRate",1,js_getMonitorRefreshRate),
    JS_CFUNC_DEF("getWindowPosition",0,js_getWindowPosition),
    JS_CFUNC_DEF("getWindowScaleDPI",0,js_getWindowScaleDPI),
    JS_CFUNC_DEF("getMonitorName",1,js_getMonitorName),
    JS_CFUNC_DEF("setClipboardText",1,js_setClipboardText),
    JS_CFUNC_DEF("getClipboardText",0,js_getClipboardText),
    JS_CFUNC_DEF("enableEventWaiting",0,js_enableEventWaiting),
    JS_CFUNC_DEF("disableEventWaiting",0,js_disableEventWaiting),
    JS_CFUNC_DEF("showCursor",0,js_showCursor),
    JS_CFUNC_DEF("hideCursor",0,js_hideCursor),
    JS_CFUNC_DEF("isCursorHidden",0,js_isCursorHidden),
    JS_CFUNC_DEF("enableCursor",0,js_enableCursor),
    JS_CFUNC_DEF("disableCursor",0,js_disableCursor),
    JS_CFUNC_DEF("isCursorOnScreen",0,js_isCursorOnScreen),
    JS_CFUNC_DEF("clearBackground",1,js_clearBackground),
    JS_CFUNC_DEF("beginDrawing",0,js_beginDrawing),
    JS_CFUNC_DEF("endDrawing",0,js_endDrawing),
    JS_CFUNC_DEF("beginMode2D",1,js_beginMode2D),
    JS_CFUNC_DEF("endMode2D",0,js_endMode2D),
    JS_CFUNC_DEF("beginBlendMode",1,js_beginBlendMode),
    JS_CFUNC_DEF("endBlendMode",0,js_endBlendMode),
    JS_CFUNC_DEF("beginScissorMode",4,js_beginScissorMode),
    JS_CFUNC_DEF("endScissorMode",0,js_endScissorMode),
    JS_CFUNC_DEF("getCameraMatrix2D",1,js_getCameraMatrix2D),
    JS_CFUNC_DEF("getScreenToWorld2D",2,js_getScreenToWorld2D),
    JS_CFUNC_DEF("getWorldToScreen2D",2,js_getWorldToScreen2D),
    JS_CFUNC_DEF("setTargetFPS",1,js_setTargetFPS),
    JS_CFUNC_DEF("getFPS",0,js_getFPS),
    JS_CFUNC_DEF("getFrameTime",0,js_getFrameTime),
    JS_CFUNC_DEF("getTime",0,js_getTime),
    JS_CFUNC_DEF("getRandomValue",2,js_getRandomValue),
    JS_CFUNC_DEF("setRandomSeed",1,js_setRandomSeed),
    JS_CFUNC_DEF("takeScreenshot",1,js_takeScreenshot),
    JS_CFUNC_DEF("setConfigFlags",1,js_setConfigFlags),
    JS_CFUNC_DEF("traceLog",2,js_traceLog),
    JS_CFUNC_DEF("setTraceLogLevel",1,js_setTraceLogLevel),
    JS_CFUNC_DEF("openURL",1,js_openURL),
    JS_CFUNC_DEF("loadFileText",1,js_loadFileText),
    JS_CFUNC_DEF("saveFileText",2,js_saveFileText),
    JS_CFUNC_DEF("fileExists",1,js_fileExists),
    JS_CFUNC_DEF("directoryExists",1,js_directoryExists),
    JS_CFUNC_DEF("isFileExtension",2,js_isFileExtension),
    JS_CFUNC_DEF("getFileLength",1,js_getFileLength),
    JS_CFUNC_DEF("getFileExtension",1,js_getFileExtension),
    JS_CFUNC_DEF("getFileName",1,js_getFileName),
    JS_CFUNC_DEF("getFileNameWithoutExt",1,js_getFileNameWithoutExt),
    JS_CFUNC_DEF("getDirectoryPath",1,js_getDirectoryPath),
    JS_CFUNC_DEF("getPrevDirectoryPath",1,js_getPrevDirectoryPath),
    JS_CFUNC_DEF("getWorkingDirectory",0,js_getWorkingDirectory),
    JS_CFUNC_DEF("getApplicationDirectory",0,js_getApplicationDirectory),
    JS_CFUNC_DEF("changeDirectory",1,js_changeDirectory),
    JS_CFUNC_DEF("isPathFile",1,js_isPathFile),
    JS_CFUNC_DEF("isFileDropped",0,js_isFileDropped),
    JS_CFUNC_DEF("getFileModTime",1,js_getFileModTime),
    JS_CFUNC_DEF("drawText",5,js_drawText),
    JS_CFUNC_DEF("drawLine",5,js_drawLine),
    JS_CFUNC_DEF("drawCircleV",3,js_drawCircleV),
    JS_CFUNC_DEF("isKeyDown",1,js_isKeyDown),
    JS_CFUNC_DEF("isKeyPressed",1,js_isKeyPressed),
    JS_CFUNC_DEF("getMousePosition",0,js_getMousePosition),
    JS_CFUNC_DEF("isMouseButtonPressed",1,js_isMouseButtonPressed),
    JS_CFUNC_DEF("getMouseWheelMove",0,js_getMouseWheelMove),
    JS_CFUNC_DEF("drawRectangle",5,js_drawRectangle),
    JS_CFUNC_DEF("drawRectangleRec",2,js_drawRectangleRec),
    JS_CFUNC_DEF("drawRectangleLines",5,js_drawRectangleLines),
    JS_CFUNC_DEF("fade",2,js_fade),
};

static int js_raylib_core_init(JSContext * ctx, JSModuleDef * m) {
    JS_SetModuleExportList(ctx, m,js_raylib_core_funcs,countof(js_raylib_core_funcs));
    js_declare_Color(ctx, m);
    JSValue Color_constr = JS_NewCFunction2(ctx, js_Color_constructor,"Color)", 4, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Color", Color_constr);
    js_declare_Rectangle(ctx, m);
    JSValue Rectangle_constr = JS_NewCFunction2(ctx, js_Rectangle_constructor,"Rectangle)", 4, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Rectangle", Rectangle_constr);
    js_declare_Vector2(ctx, m);
    JSValue Vector2_constr = JS_NewCFunction2(ctx, js_Vector2_constructor,"Vector2)", 2, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Vector2", Vector2_constr);
    js_declare_Vector3(ctx, m);
    JSValue Vector3_constr = JS_NewCFunction2(ctx, js_Vector3_constructor,"Vector3)", 3, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Vector3", Vector3_constr);
    js_declare_Ray(ctx, m);
    JSValue Ray_constr = JS_NewCFunction2(ctx, js_Ray_constructor,"Ray)", 2, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Ray", Ray_constr);
    js_declare_Camera2D(ctx, m);
    JSValue Camera2D_constr = JS_NewCFunction2(ctx, js_Camera2D_constructor,"Camera2D)", 4, JS_CFUNC_constructor_or_func, 0);
    JS_SetModuleExport(ctx, m, "Camera2D", Camera2D_constr);
    js_declare_Matrix(ctx, m);
    Color LIGHTGRAY_struct = { 200, 200, 200, 255 };
    Color* LIGHTGRAY_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *LIGHTGRAY_js_ptr = LIGHTGRAY_struct;
    JSValue LIGHTGRAY_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(LIGHTGRAY_js, LIGHTGRAY_js_ptr);
    JS_SetModuleExport(ctx, m, "LIGHTGRAY", LIGHTGRAY_js);
    Color GRAY_struct = { 130, 130, 130, 255 };
    Color* GRAY_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *GRAY_js_ptr = GRAY_struct;
    JSValue GRAY_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(GRAY_js, GRAY_js_ptr);
    JS_SetModuleExport(ctx, m, "GRAY", GRAY_js);
    Color DARKGRAY_struct = { 80, 80, 80, 255 };
    Color* DARKGRAY_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *DARKGRAY_js_ptr = DARKGRAY_struct;
    JSValue DARKGRAY_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(DARKGRAY_js, DARKGRAY_js_ptr);
    JS_SetModuleExport(ctx, m, "DARKGRAY", DARKGRAY_js);
    Color YELLOW_struct = { 253, 249, 0, 255 };
    Color* YELLOW_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *YELLOW_js_ptr = YELLOW_struct;
    JSValue YELLOW_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(YELLOW_js, YELLOW_js_ptr);
    JS_SetModuleExport(ctx, m, "YELLOW", YELLOW_js);
    Color GOLD_struct = { 255, 203, 0, 255 };
    Color* GOLD_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *GOLD_js_ptr = GOLD_struct;
    JSValue GOLD_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(GOLD_js, GOLD_js_ptr);
    JS_SetModuleExport(ctx, m, "GOLD", GOLD_js);
    Color ORANGE_struct = { 255, 161, 0, 255 };
    Color* ORANGE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *ORANGE_js_ptr = ORANGE_struct;
    JSValue ORANGE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(ORANGE_js, ORANGE_js_ptr);
    JS_SetModuleExport(ctx, m, "ORANGE", ORANGE_js);
    Color PINK_struct = { 255, 109, 194, 255 };
    Color* PINK_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *PINK_js_ptr = PINK_struct;
    JSValue PINK_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(PINK_js, PINK_js_ptr);
    JS_SetModuleExport(ctx, m, "PINK", PINK_js);
    Color RED_struct = { 230, 41, 55, 255 };
    Color* RED_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *RED_js_ptr = RED_struct;
    JSValue RED_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(RED_js, RED_js_ptr);
    JS_SetModuleExport(ctx, m, "RED", RED_js);
    Color MAROON_struct = { 190, 33, 55, 255 };
    Color* MAROON_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *MAROON_js_ptr = MAROON_struct;
    JSValue MAROON_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(MAROON_js, MAROON_js_ptr);
    JS_SetModuleExport(ctx, m, "MAROON", MAROON_js);
    Color GREEN_struct = { 0, 228, 48, 255 };
    Color* GREEN_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *GREEN_js_ptr = GREEN_struct;
    JSValue GREEN_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(GREEN_js, GREEN_js_ptr);
    JS_SetModuleExport(ctx, m, "GREEN", GREEN_js);
    Color LIME_struct = { 0, 158, 47, 255 };
    Color* LIME_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *LIME_js_ptr = LIME_struct;
    JSValue LIME_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(LIME_js, LIME_js_ptr);
    JS_SetModuleExport(ctx, m, "LIME", LIME_js);
    Color DARKGREEN_struct = { 0, 117, 44, 255 };
    Color* DARKGREEN_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *DARKGREEN_js_ptr = DARKGREEN_struct;
    JSValue DARKGREEN_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(DARKGREEN_js, DARKGREEN_js_ptr);
    JS_SetModuleExport(ctx, m, "DARKGREEN", DARKGREEN_js);
    Color SKYBLUE_struct = { 102, 191, 255, 255 };
    Color* SKYBLUE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *SKYBLUE_js_ptr = SKYBLUE_struct;
    JSValue SKYBLUE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(SKYBLUE_js, SKYBLUE_js_ptr);
    JS_SetModuleExport(ctx, m, "SKYBLUE", SKYBLUE_js);
    Color BLUE_struct = { 0, 121, 241, 255 };
    Color* BLUE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *BLUE_js_ptr = BLUE_struct;
    JSValue BLUE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(BLUE_js, BLUE_js_ptr);
    JS_SetModuleExport(ctx, m, "BLUE", BLUE_js);
    Color DARKBLUE_struct = { 0, 82, 172, 255 };
    Color* DARKBLUE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *DARKBLUE_js_ptr = DARKBLUE_struct;
    JSValue DARKBLUE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(DARKBLUE_js, DARKBLUE_js_ptr);
    JS_SetModuleExport(ctx, m, "DARKBLUE", DARKBLUE_js);
    Color PURPLE_struct = { 200, 122, 255, 255 };
    Color* PURPLE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *PURPLE_js_ptr = PURPLE_struct;
    JSValue PURPLE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(PURPLE_js, PURPLE_js_ptr);
    JS_SetModuleExport(ctx, m, "PURPLE", PURPLE_js);
    Color VIOLET_struct = { 135, 60, 190, 255 };
    Color* VIOLET_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *VIOLET_js_ptr = VIOLET_struct;
    JSValue VIOLET_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(VIOLET_js, VIOLET_js_ptr);
    JS_SetModuleExport(ctx, m, "VIOLET", VIOLET_js);
    Color DARKPURPLE_struct = { 112, 31, 126, 255 };
    Color* DARKPURPLE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *DARKPURPLE_js_ptr = DARKPURPLE_struct;
    JSValue DARKPURPLE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(DARKPURPLE_js, DARKPURPLE_js_ptr);
    JS_SetModuleExport(ctx, m, "DARKPURPLE", DARKPURPLE_js);
    Color BEIGE_struct = { 211, 176, 131, 255 };
    Color* BEIGE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *BEIGE_js_ptr = BEIGE_struct;
    JSValue BEIGE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(BEIGE_js, BEIGE_js_ptr);
    JS_SetModuleExport(ctx, m, "BEIGE", BEIGE_js);
    Color BROWN_struct = { 127, 106, 79, 255 };
    Color* BROWN_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *BROWN_js_ptr = BROWN_struct;
    JSValue BROWN_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(BROWN_js, BROWN_js_ptr);
    JS_SetModuleExport(ctx, m, "BROWN", BROWN_js);
    Color DARKBROWN_struct = { 76, 63, 47, 255 };
    Color* DARKBROWN_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *DARKBROWN_js_ptr = DARKBROWN_struct;
    JSValue DARKBROWN_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(DARKBROWN_js, DARKBROWN_js_ptr);
    JS_SetModuleExport(ctx, m, "DARKBROWN", DARKBROWN_js);
    Color WHITE_struct = { 255, 255, 255, 255 };
    Color* WHITE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *WHITE_js_ptr = WHITE_struct;
    JSValue WHITE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(WHITE_js, WHITE_js_ptr);
    JS_SetModuleExport(ctx, m, "WHITE", WHITE_js);
    Color BLACK_struct = { 0, 0, 0, 255 };
    Color* BLACK_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *BLACK_js_ptr = BLACK_struct;
    JSValue BLACK_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(BLACK_js, BLACK_js_ptr);
    JS_SetModuleExport(ctx, m, "BLACK", BLACK_js);
    Color BLANK_struct = { 0, 0, 0, 0 };
    Color* BLANK_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *BLANK_js_ptr = BLANK_struct;
    JSValue BLANK_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(BLANK_js, BLANK_js_ptr);
    JS_SetModuleExport(ctx, m, "BLANK", BLANK_js);
    Color MAGENTA_struct = { 255, 0, 255, 255 };
    Color* MAGENTA_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *MAGENTA_js_ptr = MAGENTA_struct;
    JSValue MAGENTA_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(MAGENTA_js, MAGENTA_js_ptr);
    JS_SetModuleExport(ctx, m, "MAGENTA", MAGENTA_js);
    Color RAYWHITE_struct = { 245, 245, 245, 255 };
    Color* RAYWHITE_js_ptr = (Color*)js_malloc(ctx, sizeof(Color));
    *RAYWHITE_js_ptr = RAYWHITE_struct;
    JSValue RAYWHITE_js = JS_NewObjectClass(ctx, js_Color_class_id);
    JS_SetOpaque(RAYWHITE_js, RAYWHITE_js_ptr);
    JS_SetModuleExport(ctx, m, "RAYWHITE", RAYWHITE_js);
    JS_SetModuleExport(ctx, m, "KEY_NULL", JS_NewInt32(ctx, KEY_NULL));
    JS_SetModuleExport(ctx, m, "KEY_APOSTROPHE", JS_NewInt32(ctx, KEY_APOSTROPHE));
    JS_SetModuleExport(ctx, m, "KEY_COMMA", JS_NewInt32(ctx, KEY_COMMA));
    JS_SetModuleExport(ctx, m, "KEY_MINUS", JS_NewInt32(ctx, KEY_MINUS));
    JS_SetModuleExport(ctx, m, "KEY_PERIOD", JS_NewInt32(ctx, KEY_PERIOD));
    JS_SetModuleExport(ctx, m, "KEY_SLASH", JS_NewInt32(ctx, KEY_SLASH));
    JS_SetModuleExport(ctx, m, "KEY_ZERO", JS_NewInt32(ctx, KEY_ZERO));
    JS_SetModuleExport(ctx, m, "KEY_ONE", JS_NewInt32(ctx, KEY_ONE));
    JS_SetModuleExport(ctx, m, "KEY_TWO", JS_NewInt32(ctx, KEY_TWO));
    JS_SetModuleExport(ctx, m, "KEY_THREE", JS_NewInt32(ctx, KEY_THREE));
    JS_SetModuleExport(ctx, m, "KEY_FOUR", JS_NewInt32(ctx, KEY_FOUR));
    JS_SetModuleExport(ctx, m, "KEY_FIVE", JS_NewInt32(ctx, KEY_FIVE));
    JS_SetModuleExport(ctx, m, "KEY_SIX", JS_NewInt32(ctx, KEY_SIX));
    JS_SetModuleExport(ctx, m, "KEY_SEVEN", JS_NewInt32(ctx, KEY_SEVEN));
    JS_SetModuleExport(ctx, m, "KEY_EIGHT", JS_NewInt32(ctx, KEY_EIGHT));
    JS_SetModuleExport(ctx, m, "KEY_NINE", JS_NewInt32(ctx, KEY_NINE));
    JS_SetModuleExport(ctx, m, "KEY_SEMICOLON", JS_NewInt32(ctx, KEY_SEMICOLON));
    JS_SetModuleExport(ctx, m, "KEY_EQUAL", JS_NewInt32(ctx, KEY_EQUAL));
    JS_SetModuleExport(ctx, m, "KEY_A", JS_NewInt32(ctx, KEY_A));
    JS_SetModuleExport(ctx, m, "KEY_B", JS_NewInt32(ctx, KEY_B));
    JS_SetModuleExport(ctx, m, "KEY_C", JS_NewInt32(ctx, KEY_C));
    JS_SetModuleExport(ctx, m, "KEY_D", JS_NewInt32(ctx, KEY_D));
    JS_SetModuleExport(ctx, m, "KEY_E", JS_NewInt32(ctx, KEY_E));
    JS_SetModuleExport(ctx, m, "KEY_F", JS_NewInt32(ctx, KEY_F));
    JS_SetModuleExport(ctx, m, "KEY_G", JS_NewInt32(ctx, KEY_G));
    JS_SetModuleExport(ctx, m, "KEY_H", JS_NewInt32(ctx, KEY_H));
    JS_SetModuleExport(ctx, m, "KEY_I", JS_NewInt32(ctx, KEY_I));
    JS_SetModuleExport(ctx, m, "KEY_J", JS_NewInt32(ctx, KEY_J));
    JS_SetModuleExport(ctx, m, "KEY_K", JS_NewInt32(ctx, KEY_K));
    JS_SetModuleExport(ctx, m, "KEY_L", JS_NewInt32(ctx, KEY_L));
    JS_SetModuleExport(ctx, m, "KEY_M", JS_NewInt32(ctx, KEY_M));
    JS_SetModuleExport(ctx, m, "KEY_N", JS_NewInt32(ctx, KEY_N));
    JS_SetModuleExport(ctx, m, "KEY_O", JS_NewInt32(ctx, KEY_O));
    JS_SetModuleExport(ctx, m, "KEY_P", JS_NewInt32(ctx, KEY_P));
    JS_SetModuleExport(ctx, m, "KEY_Q", JS_NewInt32(ctx, KEY_Q));
    JS_SetModuleExport(ctx, m, "KEY_R", JS_NewInt32(ctx, KEY_R));
    JS_SetModuleExport(ctx, m, "KEY_S", JS_NewInt32(ctx, KEY_S));
    JS_SetModuleExport(ctx, m, "KEY_T", JS_NewInt32(ctx, KEY_T));
    JS_SetModuleExport(ctx, m, "KEY_U", JS_NewInt32(ctx, KEY_U));
    JS_SetModuleExport(ctx, m, "KEY_V", JS_NewInt32(ctx, KEY_V));
    JS_SetModuleExport(ctx, m, "KEY_W", JS_NewInt32(ctx, KEY_W));
    JS_SetModuleExport(ctx, m, "KEY_X", JS_NewInt32(ctx, KEY_X));
    JS_SetModuleExport(ctx, m, "KEY_Y", JS_NewInt32(ctx, KEY_Y));
    JS_SetModuleExport(ctx, m, "KEY_Z", JS_NewInt32(ctx, KEY_Z));
    JS_SetModuleExport(ctx, m, "KEY_LEFT_BRACKET", JS_NewInt32(ctx, KEY_LEFT_BRACKET));
    JS_SetModuleExport(ctx, m, "KEY_BACKSLASH", JS_NewInt32(ctx, KEY_BACKSLASH));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT_BRACKET", JS_NewInt32(ctx, KEY_RIGHT_BRACKET));
    JS_SetModuleExport(ctx, m, "KEY_GRAVE", JS_NewInt32(ctx, KEY_GRAVE));
    JS_SetModuleExport(ctx, m, "KEY_SPACE", JS_NewInt32(ctx, KEY_SPACE));
    JS_SetModuleExport(ctx, m, "KEY_ESCAPE", JS_NewInt32(ctx, KEY_ESCAPE));
    JS_SetModuleExport(ctx, m, "KEY_ENTER", JS_NewInt32(ctx, KEY_ENTER));
    JS_SetModuleExport(ctx, m, "KEY_TAB", JS_NewInt32(ctx, KEY_TAB));
    JS_SetModuleExport(ctx, m, "KEY_BACKSPACE", JS_NewInt32(ctx, KEY_BACKSPACE));
    JS_SetModuleExport(ctx, m, "KEY_INSERT", JS_NewInt32(ctx, KEY_INSERT));
    JS_SetModuleExport(ctx, m, "KEY_DELETE", JS_NewInt32(ctx, KEY_DELETE));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT", JS_NewInt32(ctx, KEY_RIGHT));
    JS_SetModuleExport(ctx, m, "KEY_LEFT", JS_NewInt32(ctx, KEY_LEFT));
    JS_SetModuleExport(ctx, m, "KEY_DOWN", JS_NewInt32(ctx, KEY_DOWN));
    JS_SetModuleExport(ctx, m, "KEY_UP", JS_NewInt32(ctx, KEY_UP));
    JS_SetModuleExport(ctx, m, "KEY_PAGE_UP", JS_NewInt32(ctx, KEY_PAGE_UP));
    JS_SetModuleExport(ctx, m, "KEY_PAGE_DOWN", JS_NewInt32(ctx, KEY_PAGE_DOWN));
    JS_SetModuleExport(ctx, m, "KEY_HOME", JS_NewInt32(ctx, KEY_HOME));
    JS_SetModuleExport(ctx, m, "KEY_END", JS_NewInt32(ctx, KEY_END));
    JS_SetModuleExport(ctx, m, "KEY_CAPS_LOCK", JS_NewInt32(ctx, KEY_CAPS_LOCK));
    JS_SetModuleExport(ctx, m, "KEY_SCROLL_LOCK", JS_NewInt32(ctx, KEY_SCROLL_LOCK));
    JS_SetModuleExport(ctx, m, "KEY_NUM_LOCK", JS_NewInt32(ctx, KEY_NUM_LOCK));
    JS_SetModuleExport(ctx, m, "KEY_PRINT_SCREEN", JS_NewInt32(ctx, KEY_PRINT_SCREEN));
    JS_SetModuleExport(ctx, m, "KEY_PAUSE", JS_NewInt32(ctx, KEY_PAUSE));
    JS_SetModuleExport(ctx, m, "KEY_F1", JS_NewInt32(ctx, KEY_F1));
    JS_SetModuleExport(ctx, m, "KEY_F2", JS_NewInt32(ctx, KEY_F2));
    JS_SetModuleExport(ctx, m, "KEY_F3", JS_NewInt32(ctx, KEY_F3));
    JS_SetModuleExport(ctx, m, "KEY_F4", JS_NewInt32(ctx, KEY_F4));
    JS_SetModuleExport(ctx, m, "KEY_F5", JS_NewInt32(ctx, KEY_F5));
    JS_SetModuleExport(ctx, m, "KEY_F6", JS_NewInt32(ctx, KEY_F6));
    JS_SetModuleExport(ctx, m, "KEY_F7", JS_NewInt32(ctx, KEY_F7));
    JS_SetModuleExport(ctx, m, "KEY_F8", JS_NewInt32(ctx, KEY_F8));
    JS_SetModuleExport(ctx, m, "KEY_F9", JS_NewInt32(ctx, KEY_F9));
    JS_SetModuleExport(ctx, m, "KEY_F10", JS_NewInt32(ctx, KEY_F10));
    JS_SetModuleExport(ctx, m, "KEY_F11", JS_NewInt32(ctx, KEY_F11));
    JS_SetModuleExport(ctx, m, "KEY_F12", JS_NewInt32(ctx, KEY_F12));
    JS_SetModuleExport(ctx, m, "KEY_LEFT_SHIFT", JS_NewInt32(ctx, KEY_LEFT_SHIFT));
    JS_SetModuleExport(ctx, m, "KEY_LEFT_CONTROL", JS_NewInt32(ctx, KEY_LEFT_CONTROL));
    JS_SetModuleExport(ctx, m, "KEY_LEFT_ALT", JS_NewInt32(ctx, KEY_LEFT_ALT));
    JS_SetModuleExport(ctx, m, "KEY_LEFT_SUPER", JS_NewInt32(ctx, KEY_LEFT_SUPER));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT_SHIFT", JS_NewInt32(ctx, KEY_RIGHT_SHIFT));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT_CONTROL", JS_NewInt32(ctx, KEY_RIGHT_CONTROL));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT_ALT", JS_NewInt32(ctx, KEY_RIGHT_ALT));
    JS_SetModuleExport(ctx, m, "KEY_RIGHT_SUPER", JS_NewInt32(ctx, KEY_RIGHT_SUPER));
    JS_SetModuleExport(ctx, m, "KEY_KB_MENU", JS_NewInt32(ctx, KEY_KB_MENU));
    JS_SetModuleExport(ctx, m, "KEY_KP_0", JS_NewInt32(ctx, KEY_KP_0));
    JS_SetModuleExport(ctx, m, "KEY_KP_1", JS_NewInt32(ctx, KEY_KP_1));
    JS_SetModuleExport(ctx, m, "KEY_KP_2", JS_NewInt32(ctx, KEY_KP_2));
    JS_SetModuleExport(ctx, m, "KEY_KP_3", JS_NewInt32(ctx, KEY_KP_3));
    JS_SetModuleExport(ctx, m, "KEY_KP_4", JS_NewInt32(ctx, KEY_KP_4));
    JS_SetModuleExport(ctx, m, "KEY_KP_5", JS_NewInt32(ctx, KEY_KP_5));
    JS_SetModuleExport(ctx, m, "KEY_KP_6", JS_NewInt32(ctx, KEY_KP_6));
    JS_SetModuleExport(ctx, m, "KEY_KP_7", JS_NewInt32(ctx, KEY_KP_7));
    JS_SetModuleExport(ctx, m, "KEY_KP_8", JS_NewInt32(ctx, KEY_KP_8));
    JS_SetModuleExport(ctx, m, "KEY_KP_9", JS_NewInt32(ctx, KEY_KP_9));
    JS_SetModuleExport(ctx, m, "KEY_KP_DECIMAL", JS_NewInt32(ctx, KEY_KP_DECIMAL));
    JS_SetModuleExport(ctx, m, "KEY_KP_DIVIDE", JS_NewInt32(ctx, KEY_KP_DIVIDE));
    JS_SetModuleExport(ctx, m, "KEY_KP_MULTIPLY", JS_NewInt32(ctx, KEY_KP_MULTIPLY));
    JS_SetModuleExport(ctx, m, "KEY_KP_SUBTRACT", JS_NewInt32(ctx, KEY_KP_SUBTRACT));
    JS_SetModuleExport(ctx, m, "KEY_KP_ADD", JS_NewInt32(ctx, KEY_KP_ADD));
    JS_SetModuleExport(ctx, m, "KEY_KP_ENTER", JS_NewInt32(ctx, KEY_KP_ENTER));
    JS_SetModuleExport(ctx, m, "KEY_KP_EQUAL", JS_NewInt32(ctx, KEY_KP_EQUAL));
    JS_SetModuleExport(ctx, m, "KEY_BACK", JS_NewInt32(ctx, KEY_BACK));
    JS_SetModuleExport(ctx, m, "KEY_MENU", JS_NewInt32(ctx, KEY_MENU));
    JS_SetModuleExport(ctx, m, "KEY_VOLUME_UP", JS_NewInt32(ctx, KEY_VOLUME_UP));
    JS_SetModuleExport(ctx, m, "KEY_VOLUME_DOWN", JS_NewInt32(ctx, KEY_VOLUME_DOWN));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_LEFT", JS_NewInt32(ctx, MOUSE_BUTTON_LEFT));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_RIGHT", JS_NewInt32(ctx, MOUSE_BUTTON_RIGHT));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_MIDDLE", JS_NewInt32(ctx, MOUSE_BUTTON_MIDDLE));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_SIDE", JS_NewInt32(ctx, MOUSE_BUTTON_SIDE));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_EXTRA", JS_NewInt32(ctx, MOUSE_BUTTON_EXTRA));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_FORWARD", JS_NewInt32(ctx, MOUSE_BUTTON_FORWARD));
    JS_SetModuleExport(ctx, m, "MOUSE_BUTTON_BACK", JS_NewInt32(ctx, MOUSE_BUTTON_BACK));
    JS_SetModuleExport(ctx, m, "FLAG_VSYNC_HINT", JS_NewInt32(ctx, FLAG_VSYNC_HINT));
    JS_SetModuleExport(ctx, m, "FLAG_FULLSCREEN_MODE", JS_NewInt32(ctx, FLAG_FULLSCREEN_MODE));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_RESIZABLE", JS_NewInt32(ctx, FLAG_WINDOW_RESIZABLE));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_UNDECORATED", JS_NewInt32(ctx, FLAG_WINDOW_UNDECORATED));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_HIDDEN", JS_NewInt32(ctx, FLAG_WINDOW_HIDDEN));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_MINIMIZED", JS_NewInt32(ctx, FLAG_WINDOW_MINIMIZED));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_MAXIMIZED", JS_NewInt32(ctx, FLAG_WINDOW_MAXIMIZED));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_UNFOCUSED", JS_NewInt32(ctx, FLAG_WINDOW_UNFOCUSED));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_TOPMOST", JS_NewInt32(ctx, FLAG_WINDOW_TOPMOST));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_ALWAYS_RUN", JS_NewInt32(ctx, FLAG_WINDOW_ALWAYS_RUN));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_TRANSPARENT", JS_NewInt32(ctx, FLAG_WINDOW_TRANSPARENT));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_HIGHDPI", JS_NewInt32(ctx, FLAG_WINDOW_HIGHDPI));
    JS_SetModuleExport(ctx, m, "FLAG_WINDOW_MOUSE_PASSTHROUGH", JS_NewInt32(ctx, FLAG_WINDOW_MOUSE_PASSTHROUGH));
    JS_SetModuleExport(ctx, m, "FLAG_MSAA_4X_HINT", JS_NewInt32(ctx, FLAG_MSAA_4X_HINT));
    JS_SetModuleExport(ctx, m, "FLAG_INTERLACED_HINT", JS_NewInt32(ctx, FLAG_INTERLACED_HINT));
    JS_SetModuleExport(ctx, m, "BLEND_ALPHA", JS_NewInt32(ctx, BLEND_ALPHA));
    JS_SetModuleExport(ctx, m, "BLEND_ADDITIVE", JS_NewInt32(ctx, BLEND_ADDITIVE));
    JS_SetModuleExport(ctx, m, "BLEND_MULTIPLIED", JS_NewInt32(ctx, BLEND_MULTIPLIED));
    JS_SetModuleExport(ctx, m, "BLEND_ADD_COLORS", JS_NewInt32(ctx, BLEND_ADD_COLORS));
    JS_SetModuleExport(ctx, m, "BLEND_SUBTRACT_COLORS", JS_NewInt32(ctx, BLEND_SUBTRACT_COLORS));
    JS_SetModuleExport(ctx, m, "BLEND_ALPHA_PREMULTIPLY", JS_NewInt32(ctx, BLEND_ALPHA_PREMULTIPLY));
    JS_SetModuleExport(ctx, m, "BLEND_CUSTOM", JS_NewInt32(ctx, BLEND_CUSTOM));
    JS_SetModuleExport(ctx, m, "BLEND_CUSTOM_SEPARATE", JS_NewInt32(ctx, BLEND_CUSTOM_SEPARATE));
    JS_SetModuleExport(ctx, m, "LOG_ALL", JS_NewInt32(ctx, LOG_ALL));
    JS_SetModuleExport(ctx, m, "LOG_TRACE", JS_NewInt32(ctx, LOG_TRACE));
    JS_SetModuleExport(ctx, m, "LOG_DEBUG", JS_NewInt32(ctx, LOG_DEBUG));
    JS_SetModuleExport(ctx, m, "LOG_INFO", JS_NewInt32(ctx, LOG_INFO));
    JS_SetModuleExport(ctx, m, "LOG_WARNING", JS_NewInt32(ctx, LOG_WARNING));
    JS_SetModuleExport(ctx, m, "LOG_ERROR", JS_NewInt32(ctx, LOG_ERROR));
    JS_SetModuleExport(ctx, m, "LOG_FATAL", JS_NewInt32(ctx, LOG_FATAL));
    JS_SetModuleExport(ctx, m, "LOG_NONE", JS_NewInt32(ctx, LOG_NONE));
    return 0;
}

JSModuleDef * js_init_module_raylib_core(JSContext * ctx, const char * module_name) {
    JSModuleDef *m;
    m = JS_NewCModule(ctx, module_name, js_raylib_core_init);
    if(!m) return NULL;
    JS_AddModuleExportList(ctx, m, js_raylib_core_funcs, countof(js_raylib_core_funcs));
    JS_AddModuleExport(ctx, m, "Color");
    JS_AddModuleExport(ctx, m, "Rectangle");
    JS_AddModuleExport(ctx, m, "Vector2");
    JS_AddModuleExport(ctx, m, "Vector3");
    JS_AddModuleExport(ctx, m, "Ray");
    JS_AddModuleExport(ctx, m, "Camera2D");
    JS_AddModuleExport(ctx, m, "LIGHTGRAY");
    JS_AddModuleExport(ctx, m, "GRAY");
    JS_AddModuleExport(ctx, m, "DARKGRAY");
    JS_AddModuleExport(ctx, m, "YELLOW");
    JS_AddModuleExport(ctx, m, "GOLD");
    JS_AddModuleExport(ctx, m, "ORANGE");
    JS_AddModuleExport(ctx, m, "PINK");
    JS_AddModuleExport(ctx, m, "RED");
    JS_AddModuleExport(ctx, m, "MAROON");
    JS_AddModuleExport(ctx, m, "GREEN");
    JS_AddModuleExport(ctx, m, "LIME");
    JS_AddModuleExport(ctx, m, "DARKGREEN");
    JS_AddModuleExport(ctx, m, "SKYBLUE");
    JS_AddModuleExport(ctx, m, "BLUE");
    JS_AddModuleExport(ctx, m, "DARKBLUE");
    JS_AddModuleExport(ctx, m, "PURPLE");
    JS_AddModuleExport(ctx, m, "VIOLET");
    JS_AddModuleExport(ctx, m, "DARKPURPLE");
    JS_AddModuleExport(ctx, m, "BEIGE");
    JS_AddModuleExport(ctx, m, "BROWN");
    JS_AddModuleExport(ctx, m, "DARKBROWN");
    JS_AddModuleExport(ctx, m, "WHITE");
    JS_AddModuleExport(ctx, m, "BLACK");
    JS_AddModuleExport(ctx, m, "BLANK");
    JS_AddModuleExport(ctx, m, "MAGENTA");
    JS_AddModuleExport(ctx, m, "RAYWHITE");
    JS_AddModuleExport(ctx, m, "KEY_NULL");
    JS_AddModuleExport(ctx, m, "KEY_APOSTROPHE");
    JS_AddModuleExport(ctx, m, "KEY_COMMA");
    JS_AddModuleExport(ctx, m, "KEY_MINUS");
    JS_AddModuleExport(ctx, m, "KEY_PERIOD");
    JS_AddModuleExport(ctx, m, "KEY_SLASH");
    JS_AddModuleExport(ctx, m, "KEY_ZERO");
    JS_AddModuleExport(ctx, m, "KEY_ONE");
    JS_AddModuleExport(ctx, m, "KEY_TWO");
    JS_AddModuleExport(ctx, m, "KEY_THREE");
    JS_AddModuleExport(ctx, m, "KEY_FOUR");
    JS_AddModuleExport(ctx, m, "KEY_FIVE");
    JS_AddModuleExport(ctx, m, "KEY_SIX");
    JS_AddModuleExport(ctx, m, "KEY_SEVEN");
    JS_AddModuleExport(ctx, m, "KEY_EIGHT");
    JS_AddModuleExport(ctx, m, "KEY_NINE");
    JS_AddModuleExport(ctx, m, "KEY_SEMICOLON");
    JS_AddModuleExport(ctx, m, "KEY_EQUAL");
    JS_AddModuleExport(ctx, m, "KEY_A");
    JS_AddModuleExport(ctx, m, "KEY_B");
    JS_AddModuleExport(ctx, m, "KEY_C");
    JS_AddModuleExport(ctx, m, "KEY_D");
    JS_AddModuleExport(ctx, m, "KEY_E");
    JS_AddModuleExport(ctx, m, "KEY_F");
    JS_AddModuleExport(ctx, m, "KEY_G");
    JS_AddModuleExport(ctx, m, "KEY_H");
    JS_AddModuleExport(ctx, m, "KEY_I");
    JS_AddModuleExport(ctx, m, "KEY_J");
    JS_AddModuleExport(ctx, m, "KEY_K");
    JS_AddModuleExport(ctx, m, "KEY_L");
    JS_AddModuleExport(ctx, m, "KEY_M");
    JS_AddModuleExport(ctx, m, "KEY_N");
    JS_AddModuleExport(ctx, m, "KEY_O");
    JS_AddModuleExport(ctx, m, "KEY_P");
    JS_AddModuleExport(ctx, m, "KEY_Q");
    JS_AddModuleExport(ctx, m, "KEY_R");
    JS_AddModuleExport(ctx, m, "KEY_S");
    JS_AddModuleExport(ctx, m, "KEY_T");
    JS_AddModuleExport(ctx, m, "KEY_U");
    JS_AddModuleExport(ctx, m, "KEY_V");
    JS_AddModuleExport(ctx, m, "KEY_W");
    JS_AddModuleExport(ctx, m, "KEY_X");
    JS_AddModuleExport(ctx, m, "KEY_Y");
    JS_AddModuleExport(ctx, m, "KEY_Z");
    JS_AddModuleExport(ctx, m, "KEY_LEFT_BRACKET");
    JS_AddModuleExport(ctx, m, "KEY_BACKSLASH");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT_BRACKET");
    JS_AddModuleExport(ctx, m, "KEY_GRAVE");
    JS_AddModuleExport(ctx, m, "KEY_SPACE");
    JS_AddModuleExport(ctx, m, "KEY_ESCAPE");
    JS_AddModuleExport(ctx, m, "KEY_ENTER");
    JS_AddModuleExport(ctx, m, "KEY_TAB");
    JS_AddModuleExport(ctx, m, "KEY_BACKSPACE");
    JS_AddModuleExport(ctx, m, "KEY_INSERT");
    JS_AddModuleExport(ctx, m, "KEY_DELETE");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT");
    JS_AddModuleExport(ctx, m, "KEY_LEFT");
    JS_AddModuleExport(ctx, m, "KEY_DOWN");
    JS_AddModuleExport(ctx, m, "KEY_UP");
    JS_AddModuleExport(ctx, m, "KEY_PAGE_UP");
    JS_AddModuleExport(ctx, m, "KEY_PAGE_DOWN");
    JS_AddModuleExport(ctx, m, "KEY_HOME");
    JS_AddModuleExport(ctx, m, "KEY_END");
    JS_AddModuleExport(ctx, m, "KEY_CAPS_LOCK");
    JS_AddModuleExport(ctx, m, "KEY_SCROLL_LOCK");
    JS_AddModuleExport(ctx, m, "KEY_NUM_LOCK");
    JS_AddModuleExport(ctx, m, "KEY_PRINT_SCREEN");
    JS_AddModuleExport(ctx, m, "KEY_PAUSE");
    JS_AddModuleExport(ctx, m, "KEY_F1");
    JS_AddModuleExport(ctx, m, "KEY_F2");
    JS_AddModuleExport(ctx, m, "KEY_F3");
    JS_AddModuleExport(ctx, m, "KEY_F4");
    JS_AddModuleExport(ctx, m, "KEY_F5");
    JS_AddModuleExport(ctx, m, "KEY_F6");
    JS_AddModuleExport(ctx, m, "KEY_F7");
    JS_AddModuleExport(ctx, m, "KEY_F8");
    JS_AddModuleExport(ctx, m, "KEY_F9");
    JS_AddModuleExport(ctx, m, "KEY_F10");
    JS_AddModuleExport(ctx, m, "KEY_F11");
    JS_AddModuleExport(ctx, m, "KEY_F12");
    JS_AddModuleExport(ctx, m, "KEY_LEFT_SHIFT");
    JS_AddModuleExport(ctx, m, "KEY_LEFT_CONTROL");
    JS_AddModuleExport(ctx, m, "KEY_LEFT_ALT");
    JS_AddModuleExport(ctx, m, "KEY_LEFT_SUPER");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT_SHIFT");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT_CONTROL");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT_ALT");
    JS_AddModuleExport(ctx, m, "KEY_RIGHT_SUPER");
    JS_AddModuleExport(ctx, m, "KEY_KB_MENU");
    JS_AddModuleExport(ctx, m, "KEY_KP_0");
    JS_AddModuleExport(ctx, m, "KEY_KP_1");
    JS_AddModuleExport(ctx, m, "KEY_KP_2");
    JS_AddModuleExport(ctx, m, "KEY_KP_3");
    JS_AddModuleExport(ctx, m, "KEY_KP_4");
    JS_AddModuleExport(ctx, m, "KEY_KP_5");
    JS_AddModuleExport(ctx, m, "KEY_KP_6");
    JS_AddModuleExport(ctx, m, "KEY_KP_7");
    JS_AddModuleExport(ctx, m, "KEY_KP_8");
    JS_AddModuleExport(ctx, m, "KEY_KP_9");
    JS_AddModuleExport(ctx, m, "KEY_KP_DECIMAL");
    JS_AddModuleExport(ctx, m, "KEY_KP_DIVIDE");
    JS_AddModuleExport(ctx, m, "KEY_KP_MULTIPLY");
    JS_AddModuleExport(ctx, m, "KEY_KP_SUBTRACT");
    JS_AddModuleExport(ctx, m, "KEY_KP_ADD");
    JS_AddModuleExport(ctx, m, "KEY_KP_ENTER");
    JS_AddModuleExport(ctx, m, "KEY_KP_EQUAL");
    JS_AddModuleExport(ctx, m, "KEY_BACK");
    JS_AddModuleExport(ctx, m, "KEY_MENU");
    JS_AddModuleExport(ctx, m, "KEY_VOLUME_UP");
    JS_AddModuleExport(ctx, m, "KEY_VOLUME_DOWN");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_LEFT");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_RIGHT");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_MIDDLE");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_SIDE");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_EXTRA");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_FORWARD");
    JS_AddModuleExport(ctx, m, "MOUSE_BUTTON_BACK");
    JS_AddModuleExport(ctx, m, "FLAG_VSYNC_HINT");
    JS_AddModuleExport(ctx, m, "FLAG_FULLSCREEN_MODE");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_RESIZABLE");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_UNDECORATED");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_HIDDEN");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_MINIMIZED");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_MAXIMIZED");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_UNFOCUSED");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_TOPMOST");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_ALWAYS_RUN");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_TRANSPARENT");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_HIGHDPI");
    JS_AddModuleExport(ctx, m, "FLAG_WINDOW_MOUSE_PASSTHROUGH");
    JS_AddModuleExport(ctx, m, "FLAG_MSAA_4X_HINT");
    JS_AddModuleExport(ctx, m, "FLAG_INTERLACED_HINT");
    JS_AddModuleExport(ctx, m, "BLEND_ALPHA");
    JS_AddModuleExport(ctx, m, "BLEND_ADDITIVE");
    JS_AddModuleExport(ctx, m, "BLEND_MULTIPLIED");
    JS_AddModuleExport(ctx, m, "BLEND_ADD_COLORS");
    JS_AddModuleExport(ctx, m, "BLEND_SUBTRACT_COLORS");
    JS_AddModuleExport(ctx, m, "BLEND_ALPHA_PREMULTIPLY");
    JS_AddModuleExport(ctx, m, "BLEND_CUSTOM");
    JS_AddModuleExport(ctx, m, "BLEND_CUSTOM_SEPARATE");
    JS_AddModuleExport(ctx, m, "LOG_ALL");
    JS_AddModuleExport(ctx, m, "LOG_TRACE");
    JS_AddModuleExport(ctx, m, "LOG_DEBUG");
    JS_AddModuleExport(ctx, m, "LOG_INFO");
    JS_AddModuleExport(ctx, m, "LOG_WARNING");
    JS_AddModuleExport(ctx, m, "LOG_ERROR");
    JS_AddModuleExport(ctx, m, "LOG_FATAL");
    JS_AddModuleExport(ctx, m, "LOG_NONE");
    return m;
}

#endif // JS_raylib_core_GUARD
