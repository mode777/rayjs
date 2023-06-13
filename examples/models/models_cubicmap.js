/*******************************************************************************************
*
*   raylib [models] example - Cubicmap loading and drawing
*
*   Example originally created with raylib 1.8, last time updated with raylib 3.5
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2015-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [models] example - cubesmap loading and drawing");

// Define the camera to look into our 3d world
const position = new Vector3(16.0, 14.0, 16.0);     // Camera position
const target = new Vector3(0.0, 0.0, 0.0);          // Camera looking at point
const up = Vector3(0.0, 1.0, 0.0);                  // Camera up vector (rotation towards target)
const fovy = 45.0;                                  // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;              // Camera projection type
const camera = new Camera3D(position, target, up, fovy, projection)

let image = loadImage("resources/cubicmap.png");      // Load cubicmap image (RAM)
let cubicmap = loadTextureFromImage(image);       // Convert image to texture to display (VRAM)

const mesh = genMeshCubicmap(image, new Vector3(1.0, 1.0, 1.0));
const floor = loadModelFromMesh(mesh);

// NOTE: By default each cube is mapped to one part of texture atlas
let texture = loadTexture("resources/cubicmap_atlas.png");    // Load map texture

//model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = texture;    // Set map diffuse texture
const mat = loadMaterialDefault()
setMaterialTexture(mat, MATERIAL_MAP_DIFFUSE, texture)
setModelMaterial(floor,0,mat)

const mapPosition = new Vector3(-16.0, 0.0, -8.0);          // Set model position

unloadImage(image);  // Unload cubesmap image from RAM, already uploaded to VRAM

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    updateCamera(camera, CAMERA_ORBITAL);
    //----------------------------------------------------------------------------------
    
    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        beginMode3D(camera);

            drawModel(floor, mapPosition, 1.0, WHITE);

        endMode3D();

        drawTextureEx(cubicmap, new Vector2(screenWidth - cubicmap.width*4.0 - 20, 20.0), 0.0, 4.0, WHITE);
        drawRectangleLines(screenWidth - cubicmap.width*4 - 20, 20, cubicmap.width*4, cubicmap.height*4, GREEN);

        drawText("cubicmap image used to", 658, 90, 10, GRAY);
        drawText("generate map 3d model", 658, 104, 10, GRAY);

        drawFPS(10, 10);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadTexture(cubicmap);
unloadTexture(texture);
unloadModel(floor);

closeWindow();              // Close window and OpenGL context
//--------------------------------------------------------------------------------------

