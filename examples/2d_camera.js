import * as rlc from "raylib.core"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;
const MAX_BUILDINGS = 100

rlc.initWindow(screenWidth, screenHeight, "raylib [core] example - 2d camera");

const player = new rlc.Rectangle(400, 280, 40, 40);
const buildings = new Array(MAX_BUILDINGS);
const buildColors = new Array(MAX_BUILDINGS);

let spacing = 0;

for (let i = 0; i < MAX_BUILDINGS; i++)
{
    const height = rlc.getRandomValue(100, 800)
    buildings[i] = new rlc.Rectangle(
        -6000.0 + spacing,
        screenHeight - 130.0 - height,
        rlc.getRandomValue(50, 200),
        height)

    spacing += buildings[i].width;

    buildColors[i] = new rlc.Color(rlc.getRandomValue(200, 240), rlc.getRandomValue(200, 240), rlc.getRandomValue(200, 250), 255);
}

const camera = new rlc.Camera2D(new rlc.Vector2(screenWidth/2.0, screenHeight/2.0),new rlc.Vector2(player.x + 20.0, player.y + 20.0), 0, 1)

rlc.setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!rlc.windowShouldClose())        // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // Player movement
    if (rlc.isKeyDown(rlc.KEY_RIGHT)) player.x += 2;
    else if (rlc.isKeyDown(rlc.KEY_LEFT)) player.x -= 2;

    // Camera target follows player
    const cameraTarget = new rlc.Vector2(player.x + 20, player.y + 20);
    camera.target = cameraTarget;

    // Camera rotation controls
    if (rlc.isKeyDown(rlc.KEY_A)) camera.rotation--;
    else if (rlc.isKeyDown(rlc.KEY_S)) camera.rotation++;

    // Limit camera rotation to 80 degrees (-40 to 40)
    if (camera.rotation > 40) camera.rotation = 40;
    else if (camera.rotation < -40) camera.rotation = -40;

    // Camera zoom controls
    camera.zoom += (rlc.getMouseWheelMove()*0.05);

    if (camera.zoom > 3.0) camera.zoom = 3.0;
    else if (camera.zoom < 0.1) camera.zoom = 0.1;

    // Camera reset (zoom and rotation)
    if (rlc.isKeyPressed(rlc.KEY_R))
    {
        camera.zoom = 1.0;
        camera.rotation = 0.0;
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    rlc.beginDrawing();

        rlc.clearBackground(rlc.RAYWHITE);

        rlc.beginMode2D(camera);

            rlc.drawRectangle(-6000, 320, 13000, 8000, rlc.DARKGRAY);

            for (let i = 0; i < MAX_BUILDINGS; i++) rlc.drawRectangleRec(buildings[i], buildColors[i]);

            rlc.drawRectangleRec(player, rlc.RED);

            rlc.drawLine(cameraTarget.x, -screenHeight*10, cameraTarget.x, screenHeight*10, rlc.GREEN);
            rlc.drawLine(-screenWidth*10, cameraTarget.y, screenWidth*10, cameraTarget.y, rlc.GREEN);

        rlc.endMode2D();

        rlc.drawText("SCREEN AREA", 640, 10, 20, rlc.RED);

        rlc.drawRectangle(0, 0, screenWidth, 5, rlc.RED);
        rlc.drawRectangle(0, 5, 5, screenHeight - 10, rlc.RED);
        rlc.drawRectangle(screenWidth - 5, 5, 5, screenHeight - 10, rlc.RED);
        rlc.drawRectangle(0, screenHeight - 5, screenWidth, 5, rlc.RED);

        rlc.drawRectangle( 10, 10, 250, 113, rlc.fade(rlc.SKYBLUE, 0.5));
        rlc.drawRectangleLines( 10, 10, 250, 113, rlc.BLUE);

        rlc.drawText("Free 2d camera controls:", 20, 20, 10, rlc.BLACK);
        rlc.drawText("- Right/Left to move Offset", 40, 40, 10, rlc.DARKGRAY);
        rlc.drawText("- Mouse Wheel to Zoom in-out", 40, 60, 10, rlc.DARKGRAY);
        rlc.drawText("- A / S to Rotate", 40, 80, 10, rlc.DARKGRAY);
        rlc.drawText("- R to reset Zoom and Rotation", 40, 100, 10, rlc.DARKGRAY);

    rlc.endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
rlc.closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------
