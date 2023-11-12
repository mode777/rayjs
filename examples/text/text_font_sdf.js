/*******************************************************************************************
*
*   raylib [text] example - Font SDF loading
*
*   Example originally created with raylib 1.3, last time updated with raylib 4.0
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2015-2023 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

const GLSL_VERSION= 330

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800
const screenHeight = 450

initWindow(screenWidth, screenHeight, "raylib [text] example - SDF fonts")

// NOTE: Textures/Fonts MUST be loaded after Window initialization (OpenGL context is required)

const msg = "Signed Distance Fields"

// font generation from TTF font
const font = loadFontEx("resources/anonymous_pro_bold.ttf", 16, null, 0)

// Load SDF required shader (we use default vertex shader)
const shader = loadShader(0, "resources/shaders/glsl"+GLSL_VERSION+"/sdf.fs")
setTextureFilter(font.texture, TEXTURE_FILTER_BILINEAR)      // Required for SDF font

const fontPosition = new Vector2( 40, screenHeight/2 - 50 )
let fontSize = 16

setTargetFPS(60)               // Set our game to run at 60 frames-per-second
 
// Main game loop
while (!windowShouldClose())   // Detect window close button or ESC key
{
	// Update
	//----------------------------------------------------------------------------------
	fontSize += getMouseWheelMove()*8

	if (fontSize < 6) fontSize = 6

	let useSDF= isKeyDown(KEY_SPACE)

	let textSize = measureTextEx(font, msg, fontSize, 0)
	fontPosition.x = getScreenWidth()/2 - textSize.x/2
	fontPosition.y = getScreenHeight()/2 - textSize.y/2 + 80
	//----------------------------------------------------------------------------------

	// Draw
	//----------------------------------------------------------------------------------
	beginDrawing() 
	{
		clearBackground(RAYWHITE)

		// NOTE: SDF fonts require a custom SDf shader to compute fragment color
		if(useSDF) beginShaderMode(shader)     // Activate SDF font shader
		drawTextEx(font, msg, fontPosition, fontSize, 0, BLACK)
		if(useSDF) endShaderMode()             // Activate our default shader for next drawings

		drawTexture(font.texture, 10, 10, BLACK)

		drawText( useSDF ? "SDF!" : "default shader", 315, 40, 30, GRAY)

		drawText("FONT SIZE: 16.0", getScreenWidth() - 240, 20, 20, DARKGRAY)
		drawText("RENDER SIZE: "+ fontSize, getScreenWidth() - 240, 50, 20, DARKGRAY)
		drawText("Use MOUSE WHEEL to SCALE TEXT!", getScreenWidth() - 240, 90, 10, DARKGRAY)

		drawText("HOLD SPACE to USE SDF SHADER!", 340, getScreenHeight() - 30, 20, MAROON)	
	}
	endDrawing()
	//----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadFont(font)         // font unloading
unloadShader(shader)     // Unload SDF shader

closeWindow()            // Close window and OpenGL context
//--------------------------------------------------------------------------------------