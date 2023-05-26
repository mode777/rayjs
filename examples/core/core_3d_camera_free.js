/*******************************************************************************************
*
*   raylib [core] example - Initialize 3d camera free
*
*   Example originally created with raylib 1.3, last time updated with raylib 1.3
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

initWindow(screenWidth, screenHeight, "raylib [core] example - 3d camera free");

// Define the camera to look into our 3d world (position, target, up vector)
const position = new Vector3(10.0, 10.0, 10.0);    // Camera position
const target = new Vector3(0.0, 0.0, 0.0);      // Camera looking at point
const up = new Vector3(0.0, 1.0, 0.0);          // Camera up vector (rotation towards target)
const fovy = 45.0;                                // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;             // Camera projection type
const camera = new Camera3D(position,target, up, fovy, projection);

const cubePosition = new Vector3(0.0, 0.0, 0.0);

disableCursor();                    // Limit cursor to relative movement inside the window

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    updateCamera(camera, CAMERA_FREE);

    if (isKeyPressed('Z')) camera.target = new Vector3(0.0, 0.0, 0.0);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        beginMode3D(camera);

            drawCube(cubePosition, 2.0, 2.0, 2.0, RED);
            drawCubeWires(cubePosition, 2.0, 2.0, 2.0, MAROON);

            drawGrid(10, 1.0);

        endMode3D();

        drawRectangle( 10, 10, 320, 133, fade(SKYBLUE, 0.5));
        drawRectangleLines( 10, 10, 320, 133, BLUE);

        drawText("Free camera default controls:", 20, 20, 10, BLACK);
        drawText("- Mouse Wheel to Zoom in-out", 40, 40, 10, DARKGRAY);
        drawText("- Mouse Wheel Pressed to Pan", 40, 60, 10, DARKGRAY);
        drawText("- Alt + Mouse Wheel Pressed to Rotate", 40, 80, 10, DARKGRAY);
        drawText("- Alt + Ctrl + Mouse Wheel Pressed for Smooth Zoom", 40, 100, 10, DARKGRAY);
        drawText("- Z to zoom to (0, 0, 0)", 40, 120, 10, DARKGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
