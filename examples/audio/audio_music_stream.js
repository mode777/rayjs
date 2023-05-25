/*******************************************************************************************
*
*   raylib [audio] example - Music playing (streaming)
*
*   Example originally created with raylib 1.3, last time updated with raylib 4.0
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2015-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [audio] example - music playing (streaming)");

initAudioDevice();              // Initialize audio device

const music = loadMusicStream("resources/country.mp3");

playMusicStream(music);

let timePlayed = 0.0;        // Time played normalized [0.0f..1.0f]
let pause = false;             // Music playing paused

setTargetFPS(30);               // Set our game to run at 30 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    updateMusicStream(music);   // Update music buffer with new stream data
    
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

    // Get normalized time played for current music stream
    timePlayed = getMusicTimePlayed(music)/getMusicTimeLength(music);

    if (timePlayed > 1.0) timePlayed = 1.0;   // Make sure time played is no longer than music
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("MUSIC SHOULD BE PLAYING!", 255, 150, 20, LIGHTGRAY);

        drawRectangle(200, 200, 400, 12, LIGHTGRAY);
        drawRectangle(200, 200, (timePlayed*400.0), 12, MAROON);
        drawRectangleLines(200, 200, 400, 12, GRAY);

        drawText("PRESS SPACE TO RESTART MUSIC", 215, 250, 20, LIGHTGRAY);
        drawText("PRESS P TO PAUSE/RESUME MUSIC", 208, 280, 20, LIGHTGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadMusicStream(music);   // Unload music stream buffers from RAM

closeAudioDevice();         // Close audio device (music streaming is automatically stopped)

closeWindow();              // Close window and OpenGL context
//--------------------------------------------------------------------------------------
