/*******************************************************************************************
*
*   raylib [shapes] example - draw circle sector (with gui options)
*
*   Example originally created with raylib 2.5, last time updated with raylib 2.5
*
*   Example contributed by Vlad Adrian (@demizdor) and reviewed by Ramon Santamaria (@raysan5)
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2018-2023 Vlad Adrian (@demizdor) and Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [shapes] example - draw circle sector");

const center = new Vector2((getScreenWidth() - 300)/2.0, getScreenHeight()/2.0);

let outerRadius = 180.0;
let startAngle = 0.0;
let endAngle = 180.0;
let segments = 0;
let minSegments = 4;

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    // NOTE: All variables update happens inside GUI control functions
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawLine(500, 0, 500, getScreenHeight(), fade(LIGHTGRAY, 0.6));
        drawRectangle(500, 0, getScreenWidth() - 500, getScreenHeight(), fade(LIGHTGRAY, 0.3));

        drawCircleSector(center, outerRadius, startAngle, endAngle, segments, fade(MAROON, 0.3));
        drawCircleSectorLines(center, outerRadius, startAngle, endAngle, segments, fade(MAROON, 0.6));

        // Draw GUI controls
        //------------------------------------------------------------------------------
        startAngle = guiSliderBar(new Rectangle(600, 40, 120, 20), "StartAngle", startAngle, startAngle, 0, 720);
        endAngle = guiSliderBar(new Rectangle(600, 70, 120, 20), "EndAngle", endAngle, endAngle, 0, 720);

        outerRadius = guiSliderBar(new Rectangle(600, 140, 120, 20), "Radius", Math.round(outerRadius), outerRadius, 0, 200);
        segments = guiSliderBar(new Rectangle(600, 170, 120, 20), "Segments", Math.floor(segments), segments, 0, 100);
        //------------------------------------------------------------------------------

        minSegments = Math.ceil((endAngle - startAngle) / 90);
        drawText("MODE: " + (segments >= minSegments) ? "MANUAL" : "AUTO", 600, 200, 10, (segments >= minSegments)? MAROON : DARKGRAY);

        drawFPS(10, 10);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------