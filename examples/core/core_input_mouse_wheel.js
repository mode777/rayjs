// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - input mouse wheel");

let boxPositionY = screenHeight/2 - 40;
let scrollSpeed = 4;            // Scrolling speed in pixels

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    boxPositionY -= (getMouseWheelMove()*scrollSpeed);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawRectangle(screenWidth/2 - 40, boxPositionY, 80, 80, MAROON);

        drawText("Use mouse wheel to move the cube up and down!", 10, 10, 20, GRAY);
        drawText("Box position Y: " + boxPositionY, 10, 40, 20, LIGHTGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
