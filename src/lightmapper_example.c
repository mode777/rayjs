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

#define RLIGHTMAPPER_IMPLEMENTATION
#include "rlightmapper.h"

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

static void drawScene(scene_t *scene){
	DrawModel(scene->raylib_model, (Vector3){ 0,0,0 }, 1, WHITE);
	//DrawModel(scene->model2, (Vector3){ -10,10,0.0 }, 3,RAYWHITE);
}

int main(int argc, char* argv[])
{
	SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI | FLAG_VSYNC_HINT);

	InitWindow(1024,768,"Test");

	scene_t scene = {0};
	
	scene.shader = LoadShader("assets/shaders/glsl330/default.vs","assets/shaders/glsl330/default.fs");
	scene.u_intensity = GetShaderLocation(scene.shader, "intensity");
	// load mesh
    scene.raylib_model = LoadModel("monkey.obj");
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

	LightmapperConfig config = GetDefaultLightmapperConfig();
	config.backgroundColor = (Color){6,0,10};
	//config.hemisphereSize = 512;
	Lightmapper lm = LoadLightmapper(scene.w, scene.h, scene.raylib_model.meshes[0], config);
	Material lmMat = LoadMaterialLightmapper(BLACK, 0);
	Mesh light = GenMeshCube(0.3,0.3, 0.3);
	Material lightMaterial = LoadMaterialLightmapper(ORANGE, 1.0f); 

	while (!WindowShouldClose())
	{
		if(IsMouseButtonDown(MOUSE_BUTTON_LEFT))
			UpdateCamera(&scene.camera, CAMERA_THIRD_PERSON);

		if(lm.progress < 1.0f){
			double startTime = GetTime();
			BeginLightmap();
			while(BeginLightmapFragment(&lm)){
				DrawMesh(scene.raylib_model.meshes[0], lmMat, MatrixIdentity());
				DrawMesh(light, lightMaterial, MatrixTranslate(0,1.0,0));
				EndLightmapFragment(&lm);
				// display progress every second (printf is expensive)
				double time = GetTime();
				if (GetTime() - startTime > 0.03) break;
			}
			EndLightmap();
			if(lm.progress == 1.0f){
				Image img = LoadImageFromLightmapper(lm);
				//ExportImage(img, "my_result.png");
				UnloadTexture(scene.raylib_texture);
				scene.raylib_texture = LoadTextureFromImage(img);
				scene.raylib_model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = scene.raylib_texture;
				UnloadLightmapper(lm);
			}
		}

		BeginDrawing();
			ClearBackground(BLUE);
			
				BeginMode3D(scene.camera);
				float intensity = 1.0f;
				SetShaderValue(scene.shader, scene.u_intensity, &intensity, SHADER_UNIFORM_FLOAT);
				drawScene(&scene);
				EndMode3D();
			
			// printf("%d\n",(int)(lm.progress*GetScreenWidth()));
			if(lm.progress < 1.0f){
				DrawRectangle(0,0,GetScreenWidth(),20, Fade(GREEN,0.5));
				DrawRectangle(0,0,GetScreenWidth()*lm.progress,20, GREEN);
			}
		EndDrawing();
	}

	UnloadModel(scene.raylib_model);
	UnloadTexture(scene.raylib_texture);
	CloseWindow();
	return EXIT_SUCCESS;
}