import * as rlc from "raylib.core"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

rlc.initWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

rlc.setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------


// Main game loop
while (!rlc.windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // TODO: Update your variables here
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    rlc.beginDrawing();

        rlc.clearBackground(rlc.RAYWHITE);

        rlc.drawText("Congrats! You created your first window!", 190, 200, 20, rlc.LIGHTGRAY);

    rlc.endDrawing();
    //----------------------------------------------------------------------------------
}

