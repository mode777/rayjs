import * as rlc from "raylib.core"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

rlc.initWindow(screenWidth, screenHeight, "raylib [core] example - input mouse wheel");

let boxPositionY = screenHeight/2 - 40;
let scrollSpeed = 4;            // Scrolling speed in pixels

rlc.setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!rlc.windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    boxPositionY -= (rlc.getMouseWheelMove()*scrollSpeed);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    rlc.beginDrawing();

        rlc.clearBackground(rlc.RAYWHITE);

        rlc.drawRectangle(screenWidth/2 - 40, boxPositionY, 80, 80, rlc.MAROON);

        rlc.drawText("Use mouse wheel to move the cube up and down!", 10, 10, 20, rlc.GRAY);
        rlc.drawText("Box position Y: " + boxPositionY, 10, 40, 20, rlc.LIGHTGRAY);

    rlc.endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
rlc.closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
