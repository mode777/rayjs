// Optimized Bunnymark — Float32Array, no GC pressure
// Initialization
const screenWidth = 800;
const screenHeight = 450;
const MAX_BUNNIES = 50000;
const BUNNY_STRIDE = 8; // x, y, sx, sy, r, g, b, a

setConfigFlags(FLAG_MSAA_4X_HINT);
initWindow(screenWidth, screenHeight, "raylib bunnymark [OPTIMIZED]");

// Load bunny texture once
const texBunny = loadTexture("resources/wabbit_alpha.png");
const texW = texBunny.width;
const texH = texBunny.height;

// Flat Float32Array — no JS object overhead, no GC
const bunny = new Float32Array(MAX_BUNNIES * BUNNY_STRIDE);
let count = 0;

// Pre-allocate Color struct for drawing (reuse, no allocation per frame)
const drawColor = new Color(255, 255, 255, 255);

// Cache screen size
let width = screenWidth;
let height = screenHeight;

// Frame timing
let prevTime = getTime();

setTargetFPS(60);

// Main loop
while (!windowShouldClose()) {
    // === SPAWN ===
    if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
        const mx = getMouseX();
        const my = getMouseY();
        const limit = Math.min(count + 100, MAX_BUNNIES);
        for (let i = count; i < limit; i++) {
            const off = i * BUNNY_STRIDE;
            bunny[off]     = mx;                      // x
            bunny[off + 1] = my;                      // y
            bunny[off + 2] = getRandomValue(-250, 250) / 60.0; // sx
            bunny[off + 3] = getRandomValue(-250, 250) / 60.0; // sy
            bunny[off + 4] = getRandomValue(50, 240);  // r
            bunny[off + 5] = getRandomValue(80, 240);  // g
            bunny[off + 6] = getRandomValue(100, 240); // b
            bunny[off + 7] = 255;                      // a
        }
        count = limit;
    }

    // === UPDATE ===
    const hw = texW / 2;
    const hh = texH / 2;
    for (let i = 0; i < count; i++) {
        const off = i * BUNNY_STRIDE;
        bunny[off]     += bunny[off + 2];      // x += sx
        bunny[off + 1] += bunny[off + 3];      // y += sy

        if ((bunny[off] + hw) > width || (bunny[off] + hw) < 0)
            bunny[off + 2] *= -1;               // sx
        if ((bunny[off + 1] + hh) > height || (bunny[off + 1] + hh - 40) < 0)
            bunny[off + 3] *= -1;               // sy
    }

    // === DRAW ===
    beginDrawing();
    clearBackground(RAYWHITE);

    // Batch draw — reuse Color object, only update fields
    for (let i = 0; i < count; i++) {
        const off = i * BUNNY_STRIDE;
        drawColor.r = bunny[off + 4];
        drawColor.g = bunny[off + 5];
        drawColor.b = bunny[off + 6];
        drawColor.a = bunny[off + 7];
        drawTexture(texBunny, bunny[off], bunny[off + 1], drawColor);
    }

    // HUD
    drawRectangle(0, 0, screenWidth, 40, BLACK);
    const fps = getFPS();
    drawText(`bunnies: ${count}  fps: ${fps}`, 120, 10, 20, GREEN);
    drawText(`batched draws: ${1 + Math.floor(count / 8192)}`, 320, 10, 20, MAROON);

    endDrawing();
}

// Cleanup
unloadTexture(texBunny);
closeWindow();