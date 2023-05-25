// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - keyboard input");

const ballPosition = new Vector2(screenWidth/2, screenHeight/2);

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    if (isKeyDown(KEY_RIGHT)) ballPosition.x += 2;
    if (isKeyDown(KEY_LEFT)) ballPosition.x -= 2;
    if (isKeyDown(KEY_UP)) ballPosition.y -= 2;
    if (isKeyDown(KEY_DOWN)) ballPosition.y += 2;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("move the ball with arrow keys", 10, 10, 20, DARKGRAY);

        drawCircleV(ballPosition, 50, MAROON);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
