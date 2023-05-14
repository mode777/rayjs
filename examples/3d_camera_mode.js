// Initialization
    //--------------------------------------------------------------------------------------
    const screenWidth = 800;
    const screenHeight = 450;

    initWindow(screenWidth, screenHeight, "raylib [core] example - 3d camera mode");

    // Define the camera to look into our 3d world
    const position = new Vector3(0,10,10);
    const target = new Vector3(0,0,0);
    const up = new Vector3(0,1,0);
    const camera = new Camera3D(position,target,up, 45, CAMERA_PERSPECTIVE);

    const cubePosition = new Vector3(0,0,0);

    setTargetFPS(60);               // Set our game to run at 60 frames-per-second
    //--------------------------------------------------------------------------------------

    // Main game loop
    while (!windowShouldClose())    // Detect window close button or ESC key
    {
        // Update
        //----------------------------------------------------------------------------------
        // TODO: Update your variables here
        //----------------------------------------------------------------------------------
        
        // Draw
        //----------------------------------------------------------------------------------
        beginDrawing();

            clearBackground(RAYWHITE);

            beginMode3D(camera);

                drawCube(cubePosition, 2.0, 2.0, 2.0, RED);
                drawCubeWires(cubePosition, 2.0, 2.0, 2.0, MAROON);

                drawGrid(10, 1.0);

            endMode3D();

            drawText("Welcome to the third dimension!", 10, 40, 20, DARKGRAY);

            drawFPS(10, 10);

        endDrawing();
        //----------------------------------------------------------------------------------
    }

    // De-Initialization
    //--------------------------------------------------------------------------------------
    closeWindow();        // Close window and OpenGL context
    //--------------------------------------------------------------------------------------