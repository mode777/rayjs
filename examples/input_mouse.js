import * as rlc from "raylib.core"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

rlc.initWindow(screenWidth, screenHeight, "raylib [core] example - mouse input");

let ballPosition = new rlc.Vector2(-100.0, -100.0);
let ballColor = rlc.DARKBLUE;

rlc.setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//---------------------------------------------------------------------------------------

// Main game loop
while (!rlc.windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    ballPosition = rlc.getMousePosition();

    if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_LEFT)) ballColor = rlc.MAROON;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_MIDDLE)) ballColor = rlc.LIME;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_RIGHT)) ballColor = rlc.DARKBLUE;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_SIDE)) ballColor = rlc.PURPLE;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_EXTRA)) ballColor = rlc.YELLOW;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_FORWARD)) ballColor = rlc.ORANGE;
    else if (rlc.isMouseButtonPressed(rlc.MOUSE_BUTTON_BACK)) ballColor = rlc.BEIGE;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    rlc.beginDrawing();

        rlc.clearBackground(rlc.RAYWHITE);

        rlc.drawCircleV(ballPosition, 40, ballColor);

        rlc.drawText("move ball with mouse and click mouse button to change color", 10, 10, 20, rlc.DARKGRAY);

    rlc.endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
rlc.closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
