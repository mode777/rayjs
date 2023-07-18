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
const model = loadModelFromMesh(genMeshPlane(10.0, 10.0, 3, 3));
const cube = loadModelFromMesh(genMeshCube(2.0, 4.0, 2.0));

// Load basic lighting shader
const shader = loadShader(`resources/shaders/glsl${GLSL_VERSION}/lighting.vs`,
                            `resources/shaders/glsl${GLSL_VERSION}/lighting.fs`);
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
const matCube = loadMaterialDefault()
matCube.shader = shader
setModelMaterial(cube, 0, matCube)

// Create lights
const lights = new Array(4)
lights[0] = createLight(LIGHT_POINT, new Vector3(-2,1,-2), vector3Zero(), YELLOW, shader);
lights[1] = createLight(LIGHT_POINT, new Vector3(2,1,2), vector3Zero(), RED, shader);
lights[2] = createLight(LIGHT_POINT, new Vector3(-2,1,2), vector3Zero(), GREEN, shader);
lights[3] = createLight(LIGHT_POINT, new Vector3(2,1,-2), vector3Zero(), BLUE, shader);

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
    if (isKeyPressed(KEY_Y)) { lights[0].enabled = !lights[0].enabled; }
    if (isKeyPressed(KEY_R)) { lights[1].enabled = !lights[1].enabled; }
    if (isKeyPressed(KEY_G)) { lights[2].enabled = !lights[2].enabled; }
    if (isKeyPressed(KEY_B)) { lights[3].enabled = !lights[3].enabled; }
    
    // Update light values (actually, only enable/disable them)
    for (let i = 0; i < 4; i++) updateLightValues(shader, lights[i]);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);
        beginMode3D(camera);

            drawModel(model, vector3Zero(), 1.0, WHITE);
            drawModel(cube, vector3Zero(), 1.0, WHITE);

            // Draw spheres to show where the lights are
            for (let i = 0; i < 4; i++)
            {
                if (lights[i].enabled) drawSphereEx(lights[i].position, 0.2, 8, 8, lights[i].color);
                else drawSphereWires(lights[i].position, 0.2, 8, 8, colorAlpha(lights[i].color, 0.3));
            }

            drawGrid(10, 1.0);

        endMode3D();

        drawFPS(10, 10);

        drawText("Use keys [Y][R][G][B] to toggle lights", 10, 40, 20, DARKGRAY);

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


