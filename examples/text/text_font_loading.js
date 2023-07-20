/*******************************************************************************************
*
*   raylib [text] example - Font loading
*
*   NOTE: raylib can load fonts from multiple input file formats:
*
*     - TTF/OTF > Sprite font atlas is generated on loading, user can configure
*                 some of the generation parameters (size, characters to include)
*     - BMFonts > Angel code font fileformat, sprite font image must be provided
*                 together with the .fnt file, font generation cna not be configured
*     - XNA Spritefont > Sprite font image, following XNA Spritefont conventions,
*                 Characters in image must follow some spacing and order rules
*
*   Example originally created with raylib 1.4, last time updated with raylib 3.0
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2016-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

initWindow(screenWidth, screenHeight, "raylib [text] example - font loading");

// Define characters to draw
// NOTE: raylib supports UTF-8 encoding, following list is actually codified as UTF8 internally
const msg = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHI\nJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmn\nopqrstuvwxyz{|}~¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓ\nÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷\nøùúûüýþÿ";

// NOTE: Textures/Fonts MUST be loaded after Window initialization (OpenGL context is required)

// BMFont (AngelCode) : Font data and image atlas have been generated using external program
const fontBm = loadFont("resources/pixantiqua.fnt");

// TTF font : Font data and atlas are generated directly from TTF
// NOTE: We define a font base size of 32 pixels tall and up-to 250 characters
const fontTtf = loadFontEx("resources/pixantiqua.ttf", 32, 0, 250);

let useTtf = false;

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    if (isKeyDown(KEY_SPACE)) useTtf = true;
    else useTtf = false;
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        drawText("Hold SPACE to use TTF generated font", 20, 20, 20, LIGHTGRAY);

        if (!useTtf)
        {
            traceLog(LOG_INFO, fontBm.baseSize)
            drawTextEx(fontBm, msg, new Vector2(20.0, 100.0), fontBm.baseSize/2, 2, MAROON);
            drawText("Using BMFont (Angelcode) imported", 20, getScreenHeight() - 30, 20, GRAY);
        }
        else
        {
            drawTextEx(fontTtf, msg, new Vector2(20.0, 100.0), fontTtf.baseSize/2, 2, LIME);
            drawText("Using TTF font generated", 20, getScreenHeight() - 30, 20, GRAY);
        }

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadFont(fontBm);     // AngelCode Font unloading
unloadFont(fontTtf);    // TTF Font unloading

closeWindow();          // Close window and OpenGL context
//--------------------------------------------------------------------------------------