/*******************************************************************************************
*
*   raylib [shaders] example - basic lighting
*
*   NOTE: This example requires raylib OpenGL 3.3 or ES2 versions for shaders support,
*         OpenGL 1.1 does not support shaders, recompile raylib to OpenGL 3.3 version.
*
*   NOTE: Shaders used in this example are #version 330 (OpenGL 3.3).
*
*   Example originally created with raylib 3.0, last time updated with raylib 4.2
*
*   Example contributed by Chris Camacho (@codifies) and reviewed by Ramon Santamaria (@raysan5)
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2019-2023 Chris Camacho (@codifies) and Ramon Santamaria (@raysan5)
*
********************************************************************************************/

const GLSL_VERSION = "330"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

setConfigFlags(FLAG_MSAA_4X_HINT);  // Enable Multi Sampling Anti Aliasing 4x (if available)
initWindow(screenWidth, screenHeight, "raylib [shaders] example - basic lighting");

// Define the camera to look into our 3d world
const position = new Vector3(2.0,4.0,6.0);    // Camera position
const target = new Vector3(0.0,0.5,0.0);      // Camera looking at point
const up = new Vector3(0.0,1.0,0.0);          // Camera up vector (rotation towards target)
const fovy = 45.0;                                // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;             // Camera projection type
const camera = new Camera3D(position,target,up,fovy,projection)

// Load plane model from a generated mesh
const model = loadModelFromMesh(genMeshPlane(100.0, 100.0, 3, 3));
//const cube = loadModelFromMesh(genMeshCube(2.0, 4.0, 2.0));
const cube = loadModel("resources/models/icosphere.glb")

const g1 = genImageGradientLinear(128, 1, 90, YELLOW, DARKBLUE)
const g2 = genImageGradientLinear(128, 1, 90, DARKBLUE, PURPLE)
const image= genImageColor(256,1,WHITE)
const src = new Rectangle(0,0,128,1)
imageDraw(image,g1,src,src,WHITE)
imageDraw(image,g2,src,new Rectangle(128,0,128,1),WHITE)
const texture = loadTextureFromImage(image)
unloadImage(image)
unloadImage(g1)
unloadImage(g2)

// Load basic lighting shader
const shader = loadShader(`resources/shaders/glsl${GLSL_VERSION}/lighting.vs`,
                            `resources/shaders/glsl${GLSL_VERSION}/lighting2.fs`);
// Get some required shader locations
const viewLoc = getShaderLocation(shader, "viewPos")
// NOTE: "matModel" location name is automatically assigned on shader loading, 
// no need to get the location again if using that uniform name
//shader.locs[SHADER_LOC_MATRIX_MODEL] = getShaderLocation(shader, "matModel");

// Ambient light level (some basic lighting)
const ambientLoc = getShaderLocation(shader, "ambient");
setShaderValue(shader, ambientLoc, new Vector4(0.1, 0.1, 0.1, 1.0), SHADER_UNIFORM_VEC4);

// Assign out lighting shader to model
const matModel = loadMaterialDefault()
matModel.shader = shader
setModelMaterial(model, 0, matModel)
setMaterialTexture(matModel, MATERIAL_MAP_DIFFUSE, texture)
const matCube = loadMaterialDefault()
matCube.shader = shader
setMaterialTexture(matCube, MATERIAL_MAP_DIFFUSE, texture)
setModelMaterial(cube, 0, matCube)

// Create lights
const light = createLight(LIGHT_POINT, new Vector3(-2,1,-2), vector3Zero(), WHITE, shader)
light.attenuation *= 2 

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    updateCamera(camera, CAMERA_ORBITAL);

    // Update the shader with the camera view vector (points towards { 0.0, 0.0, 0.0 })
    const cameraPos = new Vector3(camera.position.x, camera.position.y, camera.position.z);
    setShaderValue(shader, viewLoc, cameraPos, SHADER_UNIFORM_VEC3);
    
    // Check key inputs to enable/disable lights
    if (isKeyPressed(KEY_Y)) { light.enabled = !light.enabled; }
    
    // Update light values (actually, only enable/disable them)
    updateLightValues(shader, light);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);
        beginMode3D(camera);

            drawModel(model, vector3Zero(), 1.0, WHITE);
            drawModel(cube, new Vector3(0,1,0), 1.0, WHITE);

            if (light.enabled) drawSphereEx(light.position, 0.2, 8, 8, light.color);
            else drawSphereWires(light.position, 0.2, 8, 8, colorAlpha(light.color, 0.3));

            drawGrid(10, 1.0);

        endMode3D();

        drawFPS(10, 10);

        drawText("Use keys [Y] to toggle lights", 10, 40, 20, DARKGRAY);
        drawTexturePro(texture, new Rectangle(0,0,256,1), new Rectangle(0,0,screenWidth, 32), vector2Zero(), 0, WHITE)

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadModel(floor);     // Unload the model
unloadModel(cube);      // Unload the model
unloadShader(shader);   // Unload shader

closeWindow();          // Close window and OpenGL context
//--------------------------------------------------------------------------------------


