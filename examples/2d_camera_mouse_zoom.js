import * as rl from "raylib"

for (const key in rl) {
    globalThis[key] = rl[key]
}


// Initialization
    //--------------------------------------------------------------------------------------
    const screenWidth = 800;
    const screenHeight = 450;

    initWindow(screenWidth, screenHeight, "raylib [core] example - 2d camera mouse zoom");

    const camera = new Camera2D(new Vector2(), new Vector2(), 0, 1);

    setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------

    // Main game loop
    while (!windowShouldClose())        // Detect window close button or ESC key
    {
        // Update
        //----------------------------------------------------------------------------------
        // Translate based on mouse right click
        if (isMouseButtonDown(MOUSE_BUTTON_RIGHT))
        {
            const delta = getMouseDelta();
            delta = vector2Scale(delta, -1.0/camera.zoom);

            camera.target = vector2Add(camera.target, delta);
        }

        // Zoom based on mouse wheel
        let wheel = getMouseWheelMove();
        if (wheel != 0)
        {
            // Get the world point that is under the mouse
            const mouseWorldPos = getScreenToWorld2D(getMousePosition(), camera);
            
            // Set the offset to where the mouse is
            camera.offset = getMousePosition();

            // Set the target to match, so that the camera maps the world space point 
            // under the cursor to the screen space point under the cursor at any zoom
            camera.target = mouseWorldPos;

            // Zoom increment
            const zoomIncrement = 0.125;

            camera.zoom += (wheel*zoomIncrement);
            if (camera.zoom < zoomIncrement) camera.zoom = zoomIncrement;
        }

        //----------------------------------------------------------------------------------

        // Draw
        //----------------------------------------------------------------------------------
        beginDrawing();
            clearBackground(BLACK);

            beginMode2D(camera);

                // Draw the 3d grid, rotated 90 degrees and centered around 0,0 
                // just so we have something in the XY plane
                rlPushMatrix();
                    rlTranslatef(0, 25*50, 0);
                    rlRotatef(90, 1, 0, 0);
                    drawGrid(100, 50);
                rlPopMatrix();

                // Draw a reference circle
                drawCircle(100, 100, 50, YELLOW);
                
            endMode2D();

            drawText("Mouse right button drag to move, mouse wheel to zoom", 10, 10, 20, WHITE);
        
        endDrawing();
        //----------------------------------------------------------------------------------
    }

    // De-Initialization
    //--------------------------------------------------------------------------------------
    closeWindow();        // Close window and OpenGL context
    //--------------------------------------------------------------------------------------
