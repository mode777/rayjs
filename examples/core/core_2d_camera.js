// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;
const MAX_BUILDINGS = 100

initWindow(screenWidth, screenHeight, "raylib [core] example - 2d camera");

const player = new Rectangle(400, 280, 40, 40);
const buildings = new Array(MAX_BUILDINGS);
const buildColors = new Array(MAX_BUILDINGS);

let spacing = 0;

for (let i = 0; i < MAX_BUILDINGS; i++)
{
    const height = getRandomValue(100, 800)
    buildings[i] = new Rectangle(
        -6000.0 + spacing,
        screenHeight - 130.0 - height,
        getRandomValue(50, 200),
        height)

    spacing += buildings[i].width;

    buildColors[i] = new Color(getRandomValue(200, 240), getRandomValue(200, 240), getRandomValue(200, 250), 255);
}

const camera = new Camera2D(new Vector2(screenWidth/2.0, screenHeight/2.0),new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // Player movement
    if (isKeyDown(KEY_RIGHT)) player.x += 2;
    else if (isKeyDown(KEY_LEFT)) player.x -= 2;

    // Camera target follows player
    const cameraTarget = new Vector2(player.x + 20, player.y + 20);
    camera.target = cameraTarget;

    // Camera rotation controls
    if (isKeyDown(KEY_A)) camera.rotation--;
    else if (isKeyDown(KEY_S)) camera.rotation++;

    // Limit camera rotation to 80 degrees (-40 to 40)
    if (camera.rotation > 40) camera.rotation = 40;
    else if (camera.rotation < -40) camera.rotation = -40;

    // Camera zoom controls
    camera.zoom += (getMouseWheelMove()*0.05);

    if (camera.zoom > 3.0) camera.zoom = 3.0;
    else if (camera.zoom < 0.1) camera.zoom = 0.1;

    // Camera reset (zoom and rotation)
    if (isKeyPressed(KEY_R))
    {
        camera.zoom = 1.0;
        camera.rotation = 0.0;
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        beginMode2D(camera);

            drawRectangle(-6000, 320, 13000, 8000, DARKGRAY);

            for (let i = 0; i < MAX_BUILDINGS; i++) drawRectangleRec(buildings[i], buildColors[i]);

            drawRectangleRec(player, RED);

            drawLine(cameraTarget.x, -screenHeight*10, cameraTarget.x, screenHeight*10, GREEN);
            drawLine(-screenWidth*10, cameraTarget.y, screenWidth*10, cameraTarget.y, GREEN);

        endMode2D();

        drawText("SCREEN AREA", 640, 10, 20, RED);

        drawRectangle(0, 0, screenWidth, 5, RED);
        drawRectangle(0, 5, 5, screenHeight - 10, RED);
        drawRectangle(screenWidth - 5, 5, 5, screenHeight - 10, RED);
        drawRectangle(0, screenHeight - 5, screenWidth, 5, RED);

        drawRectangle( 10, 10, 250, 113, fade(SKYBLUE, 0.5));
        drawRectangleLines( 10, 10, 250, 113, BLUE);

        drawText("Free 2d camera controls:", 20, 20, 10, BLACK);
        drawText("- Right/Left to move Offset", 40, 40, 10, DARKGRAY);
        drawText("- Mouse Wheel to Zoom in-out", 40, 60, 10, DARKGRAY);
        drawText("- A / S to Rotate", 40, 80, 10, DARKGRAY);
        drawText("- R to reset Zoom and Rotation", 40, 100, 10, DARKGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
