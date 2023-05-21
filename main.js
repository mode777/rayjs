const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

setTargetFPS(60);   
while (!windowShouldClose())
{
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("Congrats! You created your first window!", 190, 200, 20, LIGHTGRAY);

    endDrawing();
}
closeWindow();
