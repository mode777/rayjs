// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - mouse input");

let ballPosition = new Vector2(-100.0, -100.0);
let ballColor = DARKBLUE;

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//---------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    ballPosition = getMousePosition();

    if (isMouseButtonPressed(MOUSE_BUTTON_LEFT)) ballColor = MAROON;
    else if (isMouseButtonPressed(MOUSE_BUTTON_MIDDLE)) ballColor = LIME;
    else if (isMouseButtonPressed(MOUSE_BUTTON_RIGHT)) ballColor = DARKBLUE;
    else if (isMouseButtonPressed(MOUSE_BUTTON_SIDE)) ballColor = PURPLE;
    else if (isMouseButtonPressed(MOUSE_BUTTON_EXTRA)) ballColor = YELLOW;
    else if (isMouseButtonPressed(MOUSE_BUTTON_FORWARD)) ballColor = ORANGE;
    else if (isMouseButtonPressed(MOUSE_BUTTON_BACK)) ballColor = BEIGE;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawCircleV(ballPosition, 40, ballColor);

        drawText("move ball with mouse and click mouse button to change color", 10, 10, 20, DARKGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
