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

#ifndef M_PI // even with _USE_MATH_DEFINES not always available
#define M_PI 3.14159265358979323846
#endif

typedef struct {
	float p[3];
	float t[2];
} vertex_t;

typedef struct
{
	//GLuint program;
	Shader raylib_shader;
	GLint u_lightmap;
	GLint u_mvp;
	Texture raylib_texture;
	//GLuint lightmap;
	int w, h;
    Model raylib_model;
	Camera camera;
} scene_t;

static int initScene(scene_t *scene);
static void drawScene(scene_t *scene, float *view, float *projection);
static void destroyScene(scene_t *scene);

static void convertArrayToStruct(float *array, struct Matrix *matrix) {
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

static int bake(scene_t *scene)
{
	lm_context *ctx = lmCreate(
		64,               // hemisphere resolution (power of two, max=512)
		0.001f, 100.0f,   // zNear, zFar of hemisphere cameras
		0.1f, 0.15f, 0.5f, // background color (white for ambient occlusion)
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
	Shader oldShader = scene->raylib_model.materials[0].shader;
	scene->raylib_model.materials[0].shader = scene->raylib_shader;
	scene->raylib_model.materials[0].maps[0].texture = scene->raylib_texture;

	while (lmBegin(ctx, vp, view, projection))
	{
		// render to lightmapper framebuffer
		rlViewport(vp[0], vp[1], vp[2], vp[3]);
		
		Matrix matView, matProj;
		convertArrayToStruct(view, &matView);
		convertArrayToStruct(projection, &matProj);
		rlSetMatrixModelview(matView);
		rlSetMatrixProjection(matProj);

		DrawModel(scene->raylib_model, (Vector3){ 0,0,0 }, 1, WHITE);		
		
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
	scene->raylib_model.materials[0].shader = oldShader;

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
	initScene(&scene);
	bake(&scene);

	while (!WindowShouldClose())
	{
		int w = GetScreenWidth() * GetWindowScaleDPI().x;
		int h = GetScreenHeight() * GetWindowScaleDPI().y;

		rlViewport(0, 0, w, h);

		BeginDrawing();
			BeginMode3D(scene.camera);
				ClearBackground(BLUE);
				DrawModel(scene.raylib_model, (Vector3) {0.0f,0.0f,0.0f}, 1, WHITE);
			EndMode3D();
		EndDrawing();
	}

	destroyScene(&scene);
	CloseWindow();
	return EXIT_SUCCESS;
}

static int initScene(scene_t *scene)
{
	// load mesh
    scene->raylib_model = LoadModel("thirdparty/lightmapper/example/gazebo.obj");
	Mesh m = scene->raylib_model.meshes[0];
	if(m.normals != NULL) puts("Has normals");
	if(m.texcoords != NULL) puts("Has texcoords");
	if(m.texcoords2 != NULL) puts("Has texcoords2");
	if(m.indices != NULL) puts("Has indices");
    
	scene->w = 512;
	scene->h = 512;
	scene->raylib_texture = LoadTextureFromImage(GenImageColor(1,1,BLACK));

	// load shader
	const char *vp =
		"#version 150 core\n"
		"in vec3 vertexPosition;\n"
		"in vec2 vertexTexCoord;\n"
		"uniform mat4 mvp;\n"
		"out vec2 v_texcoord;\n"

		"void main()\n"
		"{\n"
		"gl_Position = mvp * vec4(vertexPosition, 1.0);\n"
		"v_texcoord = vertexTexCoord;\n"
		"}\n";

	const char *fp =
		"#version 150 core\n"
		"in vec2 v_texcoord;\n"
		"uniform sampler2D texture0;\n"
		"out vec4 o_color;\n"

		"void main()\n"
		"{\n"
		"o_color = vec4(texture(texture0, v_texcoord).rgb, gl_FrontFacing ? 1.0 : 0.0);\n"
		"}\n";

	scene->raylib_shader = LoadShaderFromMemory(vp, fp);

	scene->u_lightmap = rlGetLocationUniform(scene->raylib_shader.id, "texture0");
	scene->u_mvp = rlGetLocationUniform(scene->raylib_shader.id, "mvp");
	
	Camera camera = { 0 };
    camera.position = (Vector3){ 1.0f, 0.5f, 1.0f }; // Camera position
    camera.target = (Vector3){ 0.0f, 0.35f, 0.0f };     // Camera looking at point
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };          // Camera up vector (rotation towards target)
    camera.fovy = 45.0f;                                // Camera field-of-view Y
    camera.projection = CAMERA_PERSPECTIVE;                   // Camera mode type
	scene->camera = camera;

	return 1;
}

static void destroyScene(scene_t *scene)
{
	UnloadModel(scene->raylib_model);
	UnloadTexture(scene->raylib_texture);
	UnloadShader(scene->raylib_shader);
}