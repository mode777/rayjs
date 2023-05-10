import * as rlc from "raylib.core"

const KEY_RIGHT           = 262      // Key: Cursor right
const KEY_LEFT            = 263      // Key: Cursor left
const KEY_DOWN            = 264      // Key: Cursor down
const KEY_UP              = 265      // Key: Cursor up

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

rlc.initWindow(screenWidth, screenHeight, "raylib [core] example - keyboard input");

const ballPosition = new rlc.Vector2(screenWidth/2, screenHeight/2);

rlc.setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!rlc.windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    if (rlc.isKeyDown(KEY_RIGHT)) ballPosition.x += 2;
    if (rlc.isKeyDown(KEY_LEFT)) ballPosition.x -= 2;
    if (rlc.isKeyDown(KEY_UP)) ballPosition.y -= 2;
    if (rlc.isKeyDown(KEY_DOWN)) ballPosition.y += 2;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    rlc.beginDrawing();

        rlc.clearBackground(rlc.RAYWHITE);

        rlc.drawText("move the ball with arrow keys", 10, 10, 20, rlc.DARKGRAY);

        rlc.drawCircleV(ballPosition, 50, rlc.MAROON);

    rlc.endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
rlc.closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
