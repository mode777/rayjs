// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------


// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // TODO: Update your variables here
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("Congrats! You created your first window!", 190, 200, 20, LIGHTGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}
// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------

