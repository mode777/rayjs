#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <stddef.h>
#include <assert.h>
#include <string.h>

#include <raylib.h>
#include <rlgl.h>
#include <raymath.h>
#include <external/glad.h>
#define LIGHTMAPPER_IMPLEMENTATION
#define LM_DEBUG_INTERPOLATION
#include "lightmapper.h"

typedef struct
{
	//Shader raylib_shader;
	Texture raylib_texture;
	int w, h;
    Model raylib_model;
	Model model2;
	Camera camera;
	Shader shader;
	GLuint u_intensity;
} scene_t;

static void FloatVToMatrix(float *array, struct Matrix *matrix) {
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

static void drawScene(scene_t *scene){
	DrawModel(scene->raylib_model, (Vector3){ 0,0,0 }, 1, WHITE);
	DrawModel(scene->model2, (Vector3){ -1,0.3,0.0 }, 0.05, RED);
}

typedef struct Lightmapper {
	void * lm_handle;
	float * data;
	int w;
	int h;
	float progress;
} Lightmapper;

typedef struct LightmapperConfig {
	int hemisphereSize;
	float zNear;
	float zFar;
	Color backgroundColor;
	int interpolationPasses;
	float interpolationThreshold;
	float cameraToSurfaceDistanceModifier;
} LightmapperConfig;

LightmapperConfig GetDefaultLightmapperConfig(){
	return (LightmapperConfig){
		64, 0.001f, 100.0f, WHITE, 2, 0.01f, 0.0f
	};
}

Lightmapper LoadLightmapper(int w, int h, Mesh mesh, LightmapperConfig cfg){
	Lightmapper lm = {0};
	lm_context* ctx = lm.lm_handle = lmCreate(cfg.hemisphereSize, cfg.zNear, cfg.zFar, 
		cfg.backgroundColor.r / (float)255, cfg.backgroundColor.g / (float)255, cfg.backgroundColor.b / (float)255,
		cfg.interpolationPasses, cfg.interpolationThreshold, cfg.cameraToSurfaceDistanceModifier);

	if(ctx == NULL){
		TraceLog(LOG_ERROR, "Unable to create lightmapper. Init failed.");
		goto RETURN;
	}

	lm.w = w;
	lm.h = h;
	float *data = lm.data = calloc(w * h * 4, sizeof(float));
	lmSetTargetLightmap(ctx, data, w, h, 4);

	const void* indices = NULL;
	lm_type indicesType = LM_NONE;
	int count = mesh.vertexCount;
	if(mesh.indices != NULL){
		indices = mesh.indices;
		indicesType = LM_UNSIGNED_SHORT;
		count = mesh.triangleCount * 3;
	}

	lmSetGeometry(ctx, NULL,
		LM_FLOAT, (unsigned char*)mesh.vertices, 0,
		LM_FLOAT , (unsigned char*)mesh.normals, 0,  
		LM_FLOAT, (unsigned char*)mesh.texcoords, 0,
		count, indicesType, indices);

	RETURN:
	return lm;
}

void UnloadLightmapper(Lightmapper lm){
	free(lm.data);
	lmDestroy((lm_context *)lm.lm_handle);
}

void BeginLightmap()
{
	rlEnableDepthTest();
	rlDisableColorBlend();
	rlDisableBackfaceCulling();
}

void EndLightmap(){
	rlDisableDepthTest();
	rlEnableColorBlend();
	rlEnableBackfaceCulling();
}

static int vp[4];
static float view[16], projection[16];
static Matrix matView, matProj;

bool BeginLightmapFragment(Lightmapper * lm){
	lm_bool status = lmBegin((lm_context *)lm->lm_handle, vp, view, projection);
	if(status){
		rlViewport(vp[0], vp[1], vp[2], vp[3]);
		FloatVToMatrix(view, &matView);
		FloatVToMatrix(projection, &matProj);
		rlSetMatrixModelview(matView);
		rlSetMatrixProjection(matProj);
		//float intensity = 1.0f;
		//SetShaderValue(scene->shader, scene->u_intensity, &intensity, SHADER_UNIFORM_FLOAT);
	} else {
		lm->progress = 1.0f;
	}
	return (bool)status;
}

void EndLightmapFragment(Lightmapper * lm){
	lmEnd((lm_context *)lm->lm_handle);
	lm->progress = lmProgress((lm_context *)lm->lm_handle);
}

Image LoadImageFromLightmapper(Lightmapper lm){
	Image im = { 0 };

	if(lm.progress < 1.0f){
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

	unsigned char *tempub = (unsigned char*)calloc(lm.w * lm.h * 4, sizeof(unsigned char));
	lmImageFtoUB(lm.data, tempub, lm.w, lm.h, 4, 1.0f);

	im.data = tempub;
	im.format = PIXELFORMAT_UNCOMPRESSED_R8G8B8A8;
	im.height = lm.w;
	im.width = lm.h;

	return im;
}

static int bake(scene_t *scene)
{
	lm_context *ctx = lmCreate(
		128,               // hemisphere resolution (power of two, max=512)
		0.001f, 100.0f,   // zNear, zFar of hemisphere cameras
		1.0f, 1.0f, 1.0f, // background color (white for ambient occlusion)
		2, 0.01f,         // lightmap interpolation threshold (small differences are interpolated rather than sampled)
						  // check debug_interpolation.tga for an overview of sampled (red) vs interpolated (green) pixels.
		0.0f);            // modifier for camera-to-surface distance for hemisphere rendering.
		                  // tweak this to trade-off between interpolated normals quality and other artifacts (see declaration).

	int w = scene->w, h = scene->h;
	float *data = calloc(w * h * 4, sizeof(float));
	lmSetTargetLightmap(ctx, data, w, h, 4);

	Mesh m = scene->raylib_model.meshes[0];

	lmSetGeometry(ctx, NULL,                                                                 // no transformation in this example
		LM_FLOAT, (unsigned char*)m.vertices, 0,
		LM_FLOAT , (unsigned char*)m.normals, 0,  
		LM_FLOAT, (unsigned char*)m.texcoords, 0,
		m.vertexCount, LM_NONE, 0);

	int vp[4];
	float view[16], projection[16];
	double lastUpdateTime = 0.0;

	rlEnableDepthTest();
	rlDisableColorBlend();
	rlDisableBackfaceCulling();
	
	// TODO: Write (gl_FrontFacing ? 1.0 : 0.0) to the alpha channel in custom shader
	//Shader oldShader = scene->raylib_model.materials[0].shader;
	//scene->raylib_model.materials[0].shader = scene->raylib_shader;

	while (lmBegin(ctx, vp, view, projection))
	{
		rlViewport(vp[0], vp[1], vp[2], vp[3]);
		
		Matrix matView, matProj;
		FloatVToMatrix(view, &matView);
		FloatVToMatrix(projection, &matProj);
		rlSetMatrixModelview(matView);
		rlSetMatrixProjection(matProj);
		float intensity = 1.0f;
		SetShaderValue(scene->shader, scene->u_intensity, &intensity, SHADER_UNIFORM_FLOAT);
		drawScene(scene);

		// display progress every second (printf is expensive)
		double time = GetTime();
		if (time - lastUpdateTime > 0.05)
		{
			lastUpdateTime = time;
			printf("\r%6.2f%%", lmProgress(ctx) * 100.0f);
			fflush(stdout);
		}

		lmEnd(ctx);
	}
	rlDisableDepthTest();
	rlEnableColorBlend();
	rlEnableBackfaceCulling();
	//scene->raylib_model.materials[0].shader = oldShader;

	lmDestroy(ctx);

	// postprocess texture
	float *temp = calloc(w * h * 4, sizeof(float));
	for (int i = 0; i < 16; i++)
	{
		lmImageDilate(data, temp, w, h, 4);
		lmImageDilate(temp, data, w, h, 4);
	}
	lmImageSmooth(data, temp, w, h, 4);
	lmImageDilate(temp, data, w, h, 4);
	lmImagePower(data, w, h, 4, 1.0f / 2.2f, 0x7); // gamma correct color channels
	free(temp);

	unsigned char *tempub = (unsigned char*)calloc(w * h * 4, sizeof(unsigned char));
	lmImageFtoUB(data, tempub, w, h, 4, 1.0f);
	Image im;
	im.data = tempub;
	im.format = PIXELFORMAT_UNCOMPRESSED_R8G8B8A8;
	im.height = h;
	im.width = w;
	ExportImage(im,"result.png");
	
	// upload result
	UnloadTexture(scene->raylib_texture);
	Texture texture;
	texture.id = rlLoadTexture(tempub, w, h, RL_PIXELFORMAT_UNCOMPRESSED_R8G8B8A8, 1);
	texture.width = w;
	texture.height = h;
	texture.mipmaps = 1;
	texture.format = PIXELFORMAT_UNCOMPRESSED_R8G8B8A8;
	scene->raylib_texture = texture;
	free(tempub);

	scene->raylib_model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = texture;
	
	// // save result to a file
	// if (lmImageSaveTGAf("result.tga", data, w, h, 4, 1.0f))
	// 	printf("Saved result.tga\n");
	// free(data);

	return 1;
}

int main(int argc, char* argv[])
{
	SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI | FLAG_VSYNC_HINT);

	InitWindow(1024,768,"Test");

	scene_t scene = {0};
	
	scene.shader = LoadShader("assets/shaders/glsl330/default.vs","assets/shaders/glsl330/default.fs");
	scene.u_intensity = GetShaderLocation(scene.shader, "intensity");
	// load mesh
    scene.raylib_model = LoadModel("thirdparty/lightmapper/example/gazebo.obj");
	scene.raylib_model.materials[0].shader = scene.shader;
    scene.model2 = LoadModel("thirdparty/lightmapper/example/cube.obj");
	scene.model2.materials[0].shader = scene.shader;
    
	scene.w = 512;
	scene.h = 512;
	scene.raylib_texture = LoadTextureFromImage(GenImageColor(1,1,BLACK));
	scene.raylib_model.materials[0].maps[0].texture = scene.raylib_texture;

	Camera camera = { 0 };
    camera.position = (Vector3){ 0.0f, 0.5f, 1.5f }; // Camera position
    camera.target = (Vector3){ 0.0f, 0.35f, 0.0f };     // Camera looking at point
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };          // Camera up vector (rotation towards target)
    camera.fovy = 45.0f;                                // Camera field-of-view Y
    camera.projection = CAMERA_PERSPECTIVE;                   // Camera mode type
	scene.camera = camera;

	bake(&scene);
	// Lightmapper lm = LoadLightmapper(scene.w, scene.h, scene.raylib_model.meshes[0], GetDefaultLightmapperConfig());
	// double lastUpdateTime = 0;

	// BeginLightmap();
	// 	while(BeginLightmapFragment(&lm)){
	// 		float intensity = 1.0f;
	// 		SetShaderValue(scene.shader, scene.u_intensity, &intensity, SHADER_UNIFORM_FLOAT);
	// 		drawScene(&scene);
	// 		EndLightmapFragment(&lm);
	// 		// display progress every second (printf is expensive)
	// 		double time = GetTime();
	// 		if (time - lastUpdateTime > 0.05)
	// 		{
	// 			lastUpdateTime = time;
	// 			printf("\r%6.2f%%", lm.progress * 100.0f);
	// 			fflush(stdout);
	// 		}
	// 	}
	// EndLightmap();
	// Image img = LoadImageFromLightmapper(lm);
	// //ExportImage(img, "my_result.png");
	// UnloadTexture(scene.raylib_texture);
	// scene.raylib_texture = LoadTextureFromImage(img);
	// scene.raylib_model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = scene.raylib_texture;

	while (!WindowShouldClose())
	{
		int w = GetScreenWidth() * GetWindowScaleDPI().x;
		int h = GetScreenHeight() * GetWindowScaleDPI().y;

		rlViewport(0, 0, w, h);

		BeginDrawing();
			BeginMode3D(scene.camera);
				ClearBackground(BLUE);
				float intensity = 1.0f;
				SetShaderValue(scene.shader, scene.u_intensity, &intensity, SHADER_UNIFORM_FLOAT);
				drawScene(&scene);
			EndMode3D();
		EndDrawing();
	}

	UnloadModel(scene.raylib_model);
	UnloadTexture(scene.raylib_texture);
	CloseWindow();
	return EXIT_SUCCESS;
}