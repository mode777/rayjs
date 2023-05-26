/*******************************************************************************************
*
*   raylib [core] example - 3d camera first person
*
*   Example originally created with raylib 1.3, last time updated with raylib 1.3
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2015-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

const MAX_COLUMNS = 20;

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - 3d camera first person");

// Define the camera to look into our 3d world (position, target, up vector)
const position = new Vector3(0.0, 2.0, 4.0);    // Camera position
const target = new Vector3(0.0, 2.0, 0.0);      // Camera looking at point
const up = new Vector3(0.0, 1.0, 0.0);          // Camera up vector (rotation towards target)
const fovy = 60.0;                                // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;             // Camera projection type
const camera = new Camera3D(position,target, up, fovy, projection);

let cameraMode = CAMERA_FIRST_PERSON;

// Generates some random columns
const heights = new Array(MAX_COLUMNS);
const positions = new Array(MAX_COLUMNS);
const colors = new Array(MAX_COLUMNS);

for (let i = 0; i < MAX_COLUMNS; i++)
{
    heights[i] = getRandomValue(1, 12);
    positions[i] = new Vector3(getRandomValue(-15, 15), heights[i]/2.0, getRandomValue(-15, 15));
    colors[i] = new Color(getRandomValue(20, 255), getRandomValue(10, 55), 30, 255);
}

disableCursor();                    // Limit cursor to relative movement inside the window

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // Switch camera mode
    if (isKeyPressed(KEY_ONE))
    {
        cameraMode = CAMERA_FREE;
        camera.up = new Vector3(0.0, 1.0, 0.0); // Reset roll
    }
    
    if (isKeyPressed(KEY_TWO))
    {
        cameraMode = CAMERA_FIRST_PERSON;
        camera.up = new Vector3(0.0, 1.0, 0.0); // Reset roll
    }

    if (isKeyPressed(KEY_THREE))
    {
        cameraMode = CAMERA_THIRD_PERSON;
        camera.up = new Vector3(0.0, 1.0, 0.0); // Reset roll
    }

    if (isKeyPressed(KEY_FOUR))
    {
        cameraMode = CAMERA_ORBITAL;
        camera.up = new Vector3(0.0, 1.0, 0.0); // Reset roll
    }

    // Switch camera projection
    if (isKeyPressed(KEY_P))
    {
        if (camera.projection == CAMERA_PERSPECTIVE)
        {
            // Create isometric view
            cameraMode = CAMERA_THIRD_PERSON;
            // Note: The target distance is related to the render distance in the orthographic projection
            camera.position = new Vector3(0.0, 2.0, -100.0);
            camera.target = new Vector3(0.0, 2.0, 0.0);
            camera.up = new Vector3(0.0, 1.0, 0.0);
            camera.projection = CAMERA_ORTHOGRAPHIC;
            camera.fovy = 20.0; // near plane width in CAMERA_ORTHOGRAPHIC
            cameraYaw(camera, -135 * DEG2RAD, true);
            cameraPitch(camera, -45 * DEG2RAD, true, true, false);
        }
        else if (camera.projection == CAMERA_ORTHOGRAPHIC)
        {
            // Reset to default view
            cameraMode = CAMERA_THIRD_PERSON;
            camera.position = new Vector3(0.0, 2.0, 10.0);
            camera.target = new Vector3(0.0, 2.0, 0.0);
            camera.up = new Vector3(0.0, 1.0, 0.0);
            camera.projection = CAMERA_PERSPECTIVE;
            camera.fovy = 60.0;
        }
    }

    // Update camera computes movement internally depending on the camera mode
    // Some default standard keyboard/mouse inputs are hardcoded to simplify use
    // For advance camera controls, it's recommended to compute camera movement manually
    updateCamera(camera, cameraMode);                  // Update camera

/*
    // Camera PRO usage example (EXPERIMENTAL)
    // This new camera function allows custom movement/rotation values to be directly provided
    // as input parameters, with this approach, rcamera module is internally independent of raylib inputs
    UpdateCameraPro(&camera,
        (Vector3){
            (IsKeyDown(KEY_W) || IsKeyDown(KEY_UP))*0.1f -      // Move forward-backward
            (IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN))*0.1f,    
            (IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT))*0.1f -   // Move right-left
            (IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT))*0.1f,
            0.0f                                                // Move up-down
        },
        (Vector3){
            GetMouseDelta().x*0.05f,                            // Rotation: yaw
            GetMouseDelta().y*0.05f,                            // Rotation: pitch
            0.0f                                                // Rotation: roll
        },
        GetMouseWheelMove()*2.0f);                              // Move to target (zoom)
*/
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        beginMode3D(camera);

            drawPlane(new Vector3(0.0, 0.0, 0.0), new Vector2(32.0, 32.0), LIGHTGRAY); // Draw ground
            drawCube(new Vector3(-16.0, 2.5, 0.0), 1.0, 5.0, 32.0, BLUE);     // Draw a blue wall
            drawCube(new Vector3(16.0, 2.5, 0.0), 1.0, 5.0, 32.0, LIME);      // Draw a green wall
            drawCube(new Vector3(0.0, 2.5, 16.0), 32.0, 5.0, 1.0, GOLD);      // Draw a yellow wall

            // Draw some cubes around
            for (let i = 0; i < MAX_COLUMNS; i++)
            {
                drawCube(positions[i], 2.0, heights[i], 2.0, colors[i]);
                drawCubeWires(positions[i], 2.0, heights[i], 2.0, MAROON);
            }

            // Draw player cube
            if (cameraMode == CAMERA_THIRD_PERSON)
            {
                drawCube(camera.target, 0.5, 0.5, 0.5, PURPLE);
                drawCubeWires(camera.target, 0.5, 0.5, 0.5, DARKPURPLE);
            }

        endMode3D();

        // Draw info boxes
        drawRectangle(5, 5, 330, 100, fade(SKYBLUE, 0.5));
        drawRectangleLines(5, 5, 330, 100, BLUE);

        drawText("Camera controls:", 15, 15, 10, BLACK);
        drawText("- Move keys: W, A, S, D, Space, Left-Ctrl", 15, 30, 10, BLACK);
        drawText("- Look around: arrow keys or mouse", 15, 45, 10, BLACK);
        drawText("- Camera mode keys: 1, 2, 3, 4", 15, 60, 10, BLACK);
        drawText("- Zoom keys: num-plus, num-minus or mouse scroll", 15, 75, 10, BLACK);
        drawText("- Camera projection key: P", 15, 90, 10, BLACK);

        drawRectangle(600, 5, 195, 100, fade(SKYBLUE, 0.5));
        drawRectangleLines(600, 5, 195, 100, BLUE);


        drawText("Camera status: ", 610, 15, 10, BLACK);
        drawText("- Mode: " + cameraMode, 610, 30, 10, BLACK);
        drawText("- Projection: " + (camera.projection === CAMERA_PERSPECTIVE) ? "PERSPECTIVE" :
                                                (camera.projection === CAMERA_ORTHOGRAPHIC) ? "ORTHOGRAPHIC" : "CUSTOM", 610, 45, 10, BLACK);
    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------