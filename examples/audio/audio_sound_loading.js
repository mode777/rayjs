/*******************************************************************************************
*
*   raylib [audio] example - Sound loading and playing
*
*   Example originally created with raylib 1.1, last time updated with raylib 3.5
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2014-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
let screenWidth = 800;
let screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [audio] example - sound loading and playing");

initAudioDevice();      // Initialize audio device

const fxWav = loadSound("resources/sound.wav");         // Load WAV audio file
const fxOgg = loadSound("resources/target.ogg");        // Load OGG audio file

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    if (isKeyPressed(KEY_SPACE)) playSound(fxWav);      // Play WAV sound
    if (isKeyPressed(KEY_ENTER)) playSound(fxOgg);      // Play OGG sound
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("Press SPACE to PLAY the WAV sound!", 200, 180, 20, LIGHTGRAY);
        drawText("Press ENTER to PLAY the OGG sound!", 200, 220, 20, LIGHTGRAY);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadSound(fxWav);     // Unload sound data
unloadSound(fxOgg);     // Unload sound data

closeAudioDevice();     // Close audio device

closeWindow();          // Close window and OpenGL context
//--------------------------------------------------------------------------------------