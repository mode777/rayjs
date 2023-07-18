// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;
const MAX_BUNNIES = 50000
const MAX_BATCH_ELEMENTS = 8192

initWindow(screenWidth, screenHeight, "raylib [textures] example - bunnymark");

// Load bunny texture
const texBunny = loadTexture("resources/wabbit_alpha.png");

const bunnies = new Array(MAX_BUNNIES)


let bunniesCount = 0;           // Bunnies counter

setTargetFPS(60);               // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

// Main game loop
while (!windowShouldClose())    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    if (isMouseButtonDown(MOUSE_BUTTON_LEFT))
    {
        // Create more bunnies
        for (let i = 0; i < 100; i++)
        {
            if (bunniesCount < MAX_BUNNIES)
            {
                const bunny = {
                    position: getMousePosition(),
                    speed: new Vector2(getRandomValue(-250, 250)/60.0, getRandomValue(-250, 250)/60.0),
                    color: new Color(getRandomValue(50, 240), getRandomValue(80, 240), getRandomValue(100, 240), 255)
                }
                bunnies[bunniesCount] = bunny
                bunniesCount++;
            }
        }
    }

    // Update bunnies
    const width = getScreenWidth()
    const height = getScreenHeight()
    for (let i = 0; i < bunniesCount; i++)
    {
        const bunny = bunnies[i]

        bunny.position.x += bunny.speed.x;
        bunny.position.y += bunny.speed.y;

        if (((bunny.position.x + texBunny.width/2) > width) ||
            ((bunny.position.x + texBunny.width/2) < 0)) bunny.speed.x *= -1;
        if (((bunny.position.y + texBunny.height/2) > height) ||
            ((bunny.position.y + texBunny.height/2 - 40) < 0)) bunny.speed.y *= -1;
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);

        for (let i = 0; i < bunniesCount; i++)
        {
            const bunny = bunnies[i]
            // NOTE: When internal batch buffer limit is reached (MAX_BATCH_ELEMENTS),
            // a draw call is launched and buffer starts being filled again;
            // before issuing a draw call, updated vertex data from internal CPU buffer is send to GPU...
            // Process of sending data is costly and it could happen that GPU data has not been completely
            // processed for drawing while new data is tried to be sent (updating current in-use buffers)
            // it could generates a stall and consequently a frame drop, limiting the number of drawn bunnies
            drawTexture(texBunny, bunny.position.x, bunny.position.y, bunny.color);
        }

        drawRectangle(0, 0, screenWidth, 40, BLACK);
        drawText("bunnies: " + bunniesCount, 120, 10, 20, GREEN);
        drawText("batched draw calls: " + (1 + bunniesCount/MAX_BATCH_ELEMENTS), 320, 10, 20, MAROON);

        drawFPS(10, 10);

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadTexture(texBunny);
closeWindow();              // Close window and OpenGL context
//--------------------------------------------------------------------------------------