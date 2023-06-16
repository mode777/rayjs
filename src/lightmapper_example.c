#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <stddef.h>
#include <assert.h>

#include <raylib.h>
#include <rlgl.h>
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
	GLuint lightmap;
	int w, h;
    Model raylib_model;
	Camera camera;
} scene_t;

static int initScene(scene_t *scene);
static void drawScene(scene_t *scene, float *view, float *projection);
static void destroyScene(scene_t *scene);

static int bake(scene_t *scene)
{
	lm_context *ctx = lmCreate(
		64,               // hemisphere resolution (power of two, max=512)
		0.001f, 100.0f,   // zNear, zFar of hemisphere cameras
		1.0f, 1.0f, 1.0f, // background color (white for ambient occlusion)
		2, 0.01f,         // lightmap interpolation threshold (small differences are interpolated rather than sampled)
						  // check debug_interpolation.tga for an overview of sampled (red) vs interpolated (green) pixels.
		0.0f);            // modifier for camera-to-surface distance for hemisphere rendering.
		                  // tweak this to trade-off between interpolated normals quality and other artifacts (see declaration).

	if (!ctx)
	{
		fprintf(stderr, "Error: Could not initialize lightmapper.\n");
		return 0;
	}

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
	while (lmBegin(ctx, vp, view, projection))
	{
		// render to lightmapper framebuffer
		rlViewport(vp[0], vp[1], vp[2], vp[3]);

		drawScene(scene, view, projection);
		
		// display progress every second (printf is expensive)
		double time = GetTime();
		if (time - lastUpdateTime > 1.0)
		{
			lastUpdateTime = time;
			printf("\r%6.2f%%", lmProgress(ctx) * 100.0f);
			fflush(stdout);
		}

		lmEnd(ctx);
	}
	rlDisableDepthTest();
	rlEnableColorBlend();

	//printf("\rFinished baking %d triangles.\n", scene->indexCount / 3);

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
	rlUnloadTexture(scene->lightmap);
	scene->lightmap = rlLoadTexture(tempub, w, h, RL_PIXELFORMAT_UNCOMPRESSED_R8G8B8A8, 1);
	Texture texture;
	texture.id = scene->lightmap;
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

static int first = 1;

static void mainLoop(scene_t *scene)
{
	if (first){
		bake(scene);
		first = 0;
	}

	int w = GetScreenWidth() * GetWindowScaleDPI().x;
	int h = GetScreenHeight() * GetWindowScaleDPI().y;

	rlViewport(0, 0, w, h);

	// camera for glfw window
	float view[16], projection[16];
	//fpsCameraViewMatrix(view);
	//perspectiveMatrix(projection, 45.0f, (float)w / (float)h, 0.01f, 100.0f);

	BeginDrawing();
	BeginMode3D(scene->camera);
	ClearBackground(BLUE);
	rlEnableDepthTest();
	//drawScene(scene, view, projection);
	DrawModel(scene->raylib_model, (Vector3) {0.0f,0.0f,0.0f}, 1, WHITE);
	rlDisableDepthTest();
	EndMode3D();
	EndDrawing();
}

int main(int argc, char* argv[])
{
	SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI | FLAG_VSYNC_HINT);

	InitWindow(1024,768,"Test");

	scene_t scene = {0};
	if (!initScene(&scene))
	{
		fprintf(stderr, "Could not initialize scene.\n");
		return EXIT_FAILURE;
	}

	printf("Ambient Occlusion Baking Example.\n");
	printf("Use your mouse and the W, A, S, D, E, Q keys to navigate.\n");
	printf("Press SPACE to start baking one light bounce!\n");
	printf("This will take a few seconds and bake a lightmap illuminated by:\n");
	printf("1. The mesh itself (initially black)\n");
	printf("2. A white sky (1.0f, 1.0f, 1.0f)\n");

	while (!WindowShouldClose())
	{
		mainLoop(&scene);
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
	scene->lightmap = LoadTextureFromImage(GenImageColor(1,1,BLACK)).id;

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

	//scene->program = rlLoadShaderCode(vp, fp);
	scene->raylib_shader = LoadShaderFromMemory(vp, fp);

	scene->u_lightmap = rlGetLocationUniform(scene->raylib_shader.id, "texture0");
	scene->u_mvp = rlGetLocationUniform(scene->raylib_shader.id, "mvp");

	//scene->raylib_model.materials[0].shader = scene->raylib_shader;
	
	Camera camera = { 0 };
    camera.position = (Vector3){ 1.0f, 0.5f, 1.0f }; // Camera position
    camera.target = (Vector3){ 0.0f, 0.0f, 0.0f };     // Camera looking at point
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };          // Camera up vector (rotation towards target)
    camera.fovy = 45.0f;                                // Camera field-of-view Y
    camera.projection = CAMERA_PERSPECTIVE;                   // Camera mode type

	scene->camera = camera;

	return 1;
}

static void multiplyMatrices(float *out, float *a, float *b)
{
	for (int y = 0; y < 4; y++)
		for (int x = 0; x < 4; x++)
			out[y * 4 + x] = a[x] * b[y * 4] + a[4 + x] * b[y * 4 + 1] + a[8 + x] * b[y * 4 + 2] + a[12 + x] * b[y * 4 + 3];
}

static void drawScene(scene_t *scene, float *view, float *projection)
{
	Mesh m = scene->raylib_model.meshes[0];

	rlEnableShader(scene->raylib_shader.id);
	float mvp[16];
	multiplyMatrices(mvp, projection, view);
	glUniformMatrix4fv(scene->u_mvp, 1, GL_FALSE, mvp);

	glBindTexture(GL_TEXTURE_2D, scene->lightmap);

	//glBindVertexArray(scene->vao);
	//glDrawElements(GL_TRIANGLES, scene->indexCount, GL_UNSIGNED_SHORT, 0);
	glBindVertexArray(m.vaoId);
	glDrawArrays(GL_TRIANGLES, 0, m.vertexCount);
}

static void destroyScene(scene_t *scene)
{
	UnloadModel(scene->raylib_model);
	UnloadTexture(scene->raylib_texture);
	UnloadShader(scene->raylib_shader);
}