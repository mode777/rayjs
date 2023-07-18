/*******************************************************************************************
*
*   raylib [models] example - first person maze
*
*   Example originally created with raylib 2.5, last time updated with raylib 3.5
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2019-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [models] example - first person maze");

// Define the camera to look into our 3d world
const camera = new Camera3D(new Vector3(0.2, 0.4, 0.2),new Vector3(0.185, 0.4, 0.0),new Vector3(0,1,0), 45, CAMERA_PERSPECTIVE);
const position = new Vector3(0,0,0);            // Set model position

const imMap = loadImage("resources/cubicmap.png");      // Load cubicmap image (RAM)
const cubicmap = loadTextureFromImage(imMap);       // Convert image to texture to display (VRAM)
const mesh = genMeshCubicmap(imMap, new Vector3(1.0, 1.0, 1.0));
const model = loadModelFromMesh(mesh);

// NOTE: By default each cube is mapped to one part of texture atlas
const texture = loadTexture("resources/cubicmap_atlas.png");    // Load map texture
//model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = texture;    // Set map diffuse texture
const mat = loadMaterialDefault()
setMaterialTexture(mat, MATERIAL_MAP_DIFFUSE, texture)
setModelMaterial(model,0,mat)

// Get map image data to be used for collision detection
const mapPixels = new Uint8Array(loadImageColors(imMap));
unloadImage(imMap);             // Unload image from RAM

let mapPosition = new Vector3( -16.0, 0.0, -8.0);  // Set model position

disableCursor();                // Limit cursor to relative movement inside the window

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    let oldCamPos = camera.position;    // Store old camera position

    updateCamera(camera, CAMERA_FIRST_PERSON);

    // Check player collision (we simplify to 2D collision detection)
    const playerPos = new Vector2(camera.position.x, camera.position.z);
    const playerRadius = 0.1;  // Collision radius (player is modelled as a cilinder for collision)

    let playerCellX = Math.floor(playerPos.x - mapPosition.x + 0.5);
    let playerCellY = Math.floor(playerPos.y - mapPosition.z + 0.5);

    // Out-of-limits security check
    if (playerCellX < 0) playerCellX = 0;
    else if (playerCellX >= cubicmap.width) playerCellX = cubicmap.width - 1;

    if (playerCellY < 0) playerCellY = 0;
    else if (playerCellY >= cubicmap.height) playerCellY = cubicmap.height - 1;

    // Check map collisions using image data and player position
    // TODO: Improvement: Just check player surrounding cells for collision
    for (let y = 0; y < cubicmap.height; y++)
    {
        for (let x = 0; x < cubicmap.width; x++)
        {
            const pixelValR = mapPixels[((y*cubicmap.width + x)*4)]
            if ((pixelValR == 255) &&       // Collision: white pixel, only check R channel
                (checkCollisionCircleRec(playerPos, playerRadius, new Rectangle(
                    mapPosition.x - 0.5 + x*1.0, 
                    mapPosition.z - 0.5 + y*1.0, 1.0, 1.0 ))))
            {
                // Collision detected, reset camera position
                camera.position = oldCamPos;
            }
        }
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        beginMode3D(camera);
            drawModel(model, mapPosition, 1.0, WHITE);                     // Draw maze map
        endMode3D();

        drawTextureEx(cubicmap, new Vector2(getScreenWidth() - cubicmap.width*4.0 - 20, 20.0), 0.0, 4.0, WHITE);
        drawRectangleLines(getScreenWidth() - cubicmap.width*4 - 20, 20, cubicmap.width*4, cubicmap.height*4, GREEN);

        // Draw player position radar
        drawRectangle(getScreenWidth() - cubicmap.width*4 - 20 + playerCellX*4, 20 + playerCellY*4, 4, 4, RED);

        drawFPS(10, 10);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadTexture(cubicmap);        // Unload cubicmap texture
unloadTexture(texture);         // Unload map texture
unloadModel(floor);             // Unload map model

closeWindow();                  // Close window and OpenGL context
//--------------------------------------------------------------------------------------