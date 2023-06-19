#ifndef RLIGHTMAPPER_H
#define RLIGHTMAPPER_H

// ...
typedef struct {
    void *lm_handle;
    float *data;
    int w;
    int h;
    float progress;
} Lightmapper;

// ...
typedef struct {
    int hemisphereSize;
    float zNear;
    float zFar;
    Color backgroundColor;
    int interpolationPasses;
    float interpolationThreshold;
    float cameraToSurfaceDistanceModifier;
} LightmapperConfig;

#define RLMAPI

// ...
RLMAPI LightmapperConfig GetDefaultLightmapperConfig(void);
// ...
RLMAPI Lightmapper LoadLightmapper(int w, int h, Mesh mesh, LightmapperConfig cfg);
// ...
RLMAPI Material LoadMaterialLightmapper(Color emissiveColor, float intensity);
// ...
RLMAPI void UnloadLightmapper(Lightmapper lm);
// ...
RLMAPI void BeginLightmap(void);
// ...
RLMAPI void EndLightmap(void);
// ..
RLMAPI bool BeginLightmapFragment(Lightmapper *lm);
// ...
RLMAPI void EndLightmapFragment(Lightmapper *lm);
// ...
RLMAPI Image LoadImageFromLightmapper(Lightmapper lm);

#endif

#if defined(RLIGHTMAPPER_IMPLEMENTATION)

#include <rlgl.h>

#define LIGHTMAPPER_IMPLEMENTATION
// #define LM_DEBUG_INTERPOLATION
#include "lightmapper.h"

static const char *fs =
    "#version 330\n"
    "in vec2 fragTexCoord;\n"
    "in vec4 fragColor;\n"
    "out vec4 finalColor;\n"
    "uniform sampler2D texture0;\n"
    "uniform sampler2D texture1;\n"
    "uniform vec4 colDiffuse;\n"
    "void main()\n"
    "{\n"
    "    vec4 texelColor = texture(texture0, fragTexCoord);\n"
    "    vec4 emissionColor = texture(texture1, fragTexCoord);\n"
    "    texelColor = texelColor * colDiffuse * fragColor * emissionColor;\n"
    "    finalColor = vec4(texelColor.rgb, (gl_FrontFacing ? 1.0 : 0.0));\n"
    "}";

const char *vs = "#version 330\n"
                 "in vec3 vertexPosition;\n"
                 "in vec2 vertexTexCoord;\n"
                 "in vec4 vertexColor;\n"
                 "out vec2 fragTexCoord;\n"
                 "out vec4 fragColor;\n"
                 "uniform mat4 mvp;\n"
                 "void main()\n"
                 "{\n"
                 "    fragTexCoord = vertexTexCoord;\n"
                 "    fragColor = vertexColor;\n"
                 "    gl_Position = mvp * vec4(vertexPosition, 1.0);\n"
                 "}";

static void FloatVToMatrix(float *array, struct Matrix *matrix)
{
    matrix->m0 = array[0];
    matrix->m1 = array[1];
    matrix->m2 = array[2];
    matrix->m3 = array[3];
    matrix->m4 = array[4];
    matrix->m5 = array[5];
    matrix->m6 = array[6];
    matrix->m7 = array[7];
    matrix->m8 = array[8];
    matrix->m9 = array[9];
    matrix->m10 = array[10];
    matrix->m11 = array[11];
    matrix->m12 = array[12];
    matrix->m13 = array[13];
    matrix->m14 = array[14];
    matrix->m15 = array[15];
}

LightmapperConfig GetDefaultLightmapperConfig()
{
    return (LightmapperConfig){
        64, 0.001f, 100.0f, WHITE, 2, 0.01f, 0.0f};
}

static Shader defaultShader;

Material LoadMaterialLightmapper(Color emissiveColor, float emissiveIntensity)
{
    if (defaultShader.id == 0)
        defaultShader = LoadShaderFromMemory(vs, fs);

    Material mat = LoadMaterialDefault();
    mat.shader = defaultShader;
    float colF[4] = {emissiveColor.r * emissiveIntensity, emissiveColor.g * emissiveIntensity, emissiveColor.b * emissiveIntensity, emissiveColor.a * emissiveIntensity};
    Texture tex = {0};
    tex.format = PIXELFORMAT_UNCOMPRESSED_R32G32B32A32;
    tex.width = 1;
    tex.height = 1;
    tex.mipmaps = 1;
    tex.id = rlLoadTexture(colF, 1, 1, RL_PIXELFORMAT_UNCOMPRESSED_R32G32B32A32, 1);
    mat.maps[MATERIAL_MAP_SPECULAR].texture = tex;
    // mat.params[0] = emissiveIntensity;
    return mat;
}

Lightmapper LoadLightmapper(int w, int h, Mesh mesh, LightmapperConfig cfg)
{
    Lightmapper lm = {0};
    lm_context *ctx = lm.lm_handle = lmCreate(cfg.hemisphereSize, cfg.zNear, cfg.zFar,
                                              cfg.backgroundColor.r / (float)255, cfg.backgroundColor.g / (float)255, cfg.backgroundColor.b / (float)255,
                                              cfg.interpolationPasses, cfg.interpolationThreshold, cfg.cameraToSurfaceDistanceModifier);

    if (ctx == NULL)
    {
        TraceLog(LOG_ERROR, "Unable to create lightmapper. Init failed.");
        goto RETURN;
    }

    lm.w = w;
    lm.h = h;
    float *data = lm.data = calloc(w * h * 4, sizeof(float));
    lmSetTargetLightmap(ctx, data, w, h, 4);

    const void *indices = NULL;
    lm_type indicesType = LM_NONE;
    int count = mesh.vertexCount;
    if (mesh.indices != NULL)
    {
        indices = mesh.indices;
        indicesType = LM_UNSIGNED_SHORT;
        count = mesh.triangleCount * 3;
    }

    lmSetGeometry(ctx, NULL,
                  LM_FLOAT, (unsigned char *)mesh.vertices, 0,
                  LM_FLOAT, (unsigned char *)mesh.normals, 0,
                  LM_FLOAT, (unsigned char *)mesh.texcoords, 0,
                  count, indicesType, indices);

RETURN:
    return lm;
}

void UnloadLightmapper(Lightmapper lm)
{
    free(lm.data);
    lmDestroy((lm_context *)lm.lm_handle);
}

static Matrix mProjection;
static Matrix mModelview;

void BeginLightmap()
{
    rlEnableDepthTest();
    rlDisableColorBlend();
    rlDisableBackfaceCulling();
    mProjection = rlGetMatrixProjection();
    mModelview = rlGetMatrixModelview();
}

void EndLightmap()
{
    // rlDisableDepthTest();
    rlEnableColorBlend();
    rlEnableBackfaceCulling();
    int w = GetScreenWidth() * GetWindowScaleDPI().x;
    int h = GetScreenHeight() * GetWindowScaleDPI().y;
    rlViewport(0, 0, w, h);
    rlDisableFramebuffer();
    glUseProgram(0);
    glBindTexture(GL_TEXTURE_2D, 0);
    glBindBuffer(GL_PIXEL_PACK_BUFFER, 0);
    glBindVertexArray(0);
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glBindFramebuffer(GL_READ_FRAMEBUFFER, 0);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0);
    rlSetMatrixModelview(mModelview);
    rlSetMatrixProjection(mProjection);
}

static int vp[4];
static float view[16], projection[16];
static Matrix matView, matProj;

bool BeginLightmapFragment(Lightmapper *lm)
{
    lm_bool status = lmBegin((lm_context *)lm->lm_handle, vp, view, projection);
    if (status)
    {
        rlViewport(vp[0], vp[1], vp[2], vp[3]);
        FloatVToMatrix(view, &matView);
        FloatVToMatrix(projection, &matProj);
        rlSetMatrixModelview(matView);
        rlSetMatrixProjection(matProj);
    }
    else
    {
        lm->progress = 1.0f;
    }
    return (bool)status;
}

void EndLightmapFragment(Lightmapper *lm)
{
    lm->progress = lmProgress((lm_context *)lm->lm_handle);
    lmEnd((lm_context *)lm->lm_handle);
}

Image LoadImageFromLightmapper(Lightmapper lm)
{
    Image im = {0};

    if (lm.progress < 1.0f)
    {
        TraceLog(LOG_ERROR, "Lightmapping is not finished");
        return im;
    }
    // postprocess texture
    float *temp = calloc(lm.w * lm.h * 4, sizeof(float));
    for (int i = 0; i < 16; i++)
    {
        lmImageDilate(lm.data, temp, lm.w, lm.h, 4);
        lmImageDilate(temp, lm.data, lm.w, lm.h, 4);
    }
    lmImageSmooth(lm.data, temp, lm.w, lm.h, 4);
    lmImageDilate(temp, lm.data, lm.w, lm.h, 4);
    lmImagePower(lm.data, lm.w, lm.h, 4, 1.0f / 2.2f, 0x7); // gamma correct color channels
    free(temp);

    unsigned char *tempub = (unsigned char *)calloc(lm.w * lm.h * 4, sizeof(unsigned char));
    lmImageFtoUB(lm.data, tempub, lm.w, lm.h, 4, 1.0f);

    im.data = tempub;
    im.format = PIXELFORMAT_UNCOMPRESSED_R8G8B8A8;
    im.height = lm.w;
    im.width = lm.h;
    im.mipmaps = 1;
    return im;
}
#endif