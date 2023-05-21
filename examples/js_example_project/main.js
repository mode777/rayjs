const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [js] example - project folder");

const logo = loadTexture("assets/raylib_512x512.png")

setTargetFPS(60);   
while (!windowShouldClose())
{
    const offset = Math.sin(getTime())*50
    beginDrawing();

        clearBackground(RAYWHITE);
        drawTexture(logo, (screenWidth/2) - (logo.width/2), (screenHeight/2) - (logo.height/2) + offset, WHITE)

        drawText("This is an example for loading a folder!", 190, 200, 20, LIGHTGRAY);

    endDrawing();
}
unloadTexture(logo)
closeWindow();
