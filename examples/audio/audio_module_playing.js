/*******************************************************************************************
*
*   raylib [audio] example - Module playing (streaming)
*
*   Example originally created with raylib 1.5, last time updated with raylib 3.5
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2016-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
const MAX_CIRCLES = 64

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

setConfigFlags(FLAG_MSAA_4X_HINT);  // NOTE: Try to enable MSAA 4X

initWindow(screenWidth, screenHeight, "raylib [audio] example - module playing (streaming)");

initAudioDevice();                  // Initialize audio device

const colors = [ORANGE, RED, GOLD, LIME, BLUE, VIOLET, BROWN, LIGHTGRAY, PINK,
                        YELLOW, GREEN, SKYBLUE, PURPLE, BEIGE];

// Creates some circles for visual effect
const circles = new Array(MAX_CIRCLES).fill({});

for (let i = MAX_CIRCLES - 1; i >= 0; i--)
{
    circles[i].alpha = 0.0;
    circles[i].radius = getRandomValue(10, 40);
    circles[i].position = new Vector2(0,0)
    circles[i].position.x = getRandomValue(circles[i].radius, (screenWidth - circles[i].radius));
    circles[i].position.y = getRandomValue(circles[i].radius, (screenHeight - circles[i].radius));
    circles[i].speed = getRandomValue(1, 100)/2000.0;
    circles[i].color = colors[getRandomValue(0, 13)];
}

const music = loadMusicStream("resources/mini1111.xm");
music.looping = false;
const pitch = 1.0;

playMusicStream(music);

let timePlayed = 0.0;
let pause = false;

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    updateMusicStream(music);      // Update music buffer with new stream data

    // Restart music playing (stop and play)
    if (isKeyPressed(KEY_SPACE))
    {
        stopMusicStream(music);
        playMusicStream(music);
    }

    // Pause/Resume music playing
    if (isKeyPressed(KEY_P))
    {
        pause = !pause;

        if (pause) pauseMusicStream(music);
        else resumeMusicStream(music);
    }

    if (isKeyDown(KEY_DOWN)) pitch -= 0.01;
    else if (isKeyDown(KEY_UP)) pitch += 0.01;

    setMusicPitch(music, pitch);

    // Get timePlayed scaled to bar dimensions
    timePlayed = getMusicTimePlayed(music) / getMusicTimeLength(music) * (screenWidth - 40);

    // Color circles animation
    for (let i = MAX_CIRCLES - 1; (i >= 0) && !pause; i--)
    {
        circles[i].alpha += circles[i].speed;
        circles[i].radius += circles[i].speed*10.0;

        if (circles[i].alpha > 1.0) circles[i].speed *= -1;

        if (circles[i].alpha <= 0.0)
        {
            circles[i].alpha = 0.0;
            circles[i].radius = getRandomValue(10, 40);
            circles[i].position.x = getRandomValue(circles[i].radius, (screenWidth - circles[i].radius));
            circles[i].position.y = getRandomValue(circles[i].radius, (screenHeight - circles[i].radius));
            circles[i].color = colors[getRandomValue(0, 13)];
            circles[i].speed = getRandomValue(1, 100) / 2000.0;
        }
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        for (let i = MAX_CIRCLES - 1; i >= 0; i--)
        {
            drawCircleV(circles[i].position, circles[i].radius, fade(circles[i].color, circles[i].alpha));
        }

        // Draw time bar
        drawRectangle(20, screenHeight - 20 - 12, screenWidth - 40, 12, LIGHTGRAY);
        drawRectangle(20, screenHeight - 20 - 12, timePlayed, 12, MAROON);
        drawRectangleLines(20, screenHeight - 20 - 12, screenWidth - 40, 12, GRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadMusicStream(music);          // Unload music stream buffers from RAM

closeAudioDevice();     // Close audio device (music streaming is automatically stopped)

closeWindow();          // Close window and OpenGL context
//--------------------------------------------------------------------------------------