import { SystemBase, SystemContainer } from "./systems";

export class GameController extends SystemContainer {
    private currentId!: number
    private currentIndex!: number
    private systems = [
        new BasicWindow(),
        new FirstPersonMaze()
    ]

    load(): void {
        super.load()
        this.currentIndex = 0
        this.currentId = this.addSystem(this.systems[this.currentIndex])
    }

    update(dt: number): void {
        if(isKeyPressed(KEY_RIGHT)){
            this.removeSystem(this.currentId)
            this.currentIndex = (this.currentIndex+1)%this.systems.length 
            this.currentId = this.addSystem(this.systems[this.currentIndex])
        }
        super.update(dt)
    }
}

class BasicWindow extends SystemBase {
    draw(): void {
        super.draw()
        drawText("Congrats! You created your first window!", 190, 200, 20, LIGHTGRAY);
    }
}

export class FirstPersonMaze extends SystemBase {

    private camera!: Camera3D;
    private playerCellX!: number;
    private playerCellY!: number;
    private cubicmap!: Texture;
    private texture!: Texture;
    private mapPixels!: Uint8Array;
    private model!: Model;
    private mapPosition!: Vector3;

    load(): void {
        super.load()
        // Define the camera to look into our 3d world
        this.camera = new Camera3D(new Vector3(0.2, 0.4, 0.2), new Vector3(0.185, 0.4, 0.0), new Vector3(0, 1, 0), 45, CAMERA_PERSPECTIVE);
        const position = new Vector3(0, 0, 0); // Set model position

        const imMap = loadImage("assets/cubicmap.png"); // Load cubicmap image (RAM)
        this.cubicmap = loadTextureFromImage(imMap); // Convert image to texture to display (VRAM)
        const mesh = genMeshCubicmap(imMap, new Vector3(1.0, 1.0, 1.0));
        this.model = loadModelFromMesh(mesh);

        // NOTE: By default each cube is mapped to one part of texture atlas
        this.texture = loadTexture("assets/cubicmap_atlas.png"); // Load map texture

        //model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = texture;    // Set map diffuse texture
        const mat = loadMaterialDefault();
        setMaterialTexture(mat, MATERIAL_MAP_DIFFUSE, this.texture);
        setModelMaterial(this.model, 0, mat);

        // Get map image data to be used for collision detection
        this.mapPixels = new Uint8Array(loadImageColors(imMap));
        unloadImage(imMap); // Unload image from RAM

        this.mapPosition = new Vector3(-16.0, 0.0, -8.0); // Set model position

        disableCursor();
    }

    update(dt: number): void {
        super.update(dt);
        let oldCamPos = this.camera.position; // Store old camera position

        updateCamera(this.camera, CAMERA_FIRST_PERSON);

        // Check player collision (we simplify to 2D collision detection)
        const playerPos = new Vector2(this.camera.position.x, this.camera.position.z);
        const playerRadius = 0.1; // Collision radius (player is modelled as a cilinder for collision)

        this.playerCellX = Math.floor(playerPos.x - this.mapPosition.x + 0.5);
        this.playerCellY = Math.floor(playerPos.y - this.mapPosition.z + 0.5);

        // Out-of-limits security check
        if (this.playerCellX < 0)
            this.playerCellX = 0;
        else if (this.playerCellX >= this.cubicmap.width)
            this.playerCellX = this.cubicmap.width - 1;

        if (this.playerCellY < 0)
            this.playerCellY = 0;
        else if (this.playerCellY >= this.cubicmap.height)
            this.playerCellY = this.cubicmap.height - 1;

        // Check map collisions using image data and player position
        // TODO: Improvement: Just check player surrounding cells for collision
        for (let y = 0; y < this.cubicmap.height; y++) {
            for (let x = 0; x < this.cubicmap.width; x++) {
                const pixelValR = this.mapPixels[((y * this.cubicmap.width + x) * 4)];
                if ((pixelValR == 255) && // Collision: white pixel, only check R channel
                    (checkCollisionCircleRec(playerPos, playerRadius, new Rectangle(
                        this.mapPosition.x - 0.5 + x * 1.0,
                        this.mapPosition.z - 0.5 + y * 1.0, 1.0, 1.0)))) {
                    // Collision detected, reset camera position
                    this.camera.position = oldCamPos;
                }
            }
        }
    }

    draw(): void {
        super.draw()
        beginMode3D(this.camera);
        drawModel(this.model, this.mapPosition, 1.0, WHITE); // Draw maze map
        endMode3D();

        drawTextureEx(this.cubicmap, new Vector2(getScreenWidth() - this.cubicmap.width * 4.0 - 20, 20.0), 0.0, 4.0, WHITE);
        drawRectangleLines(getScreenWidth() - this.cubicmap.width * 4 - 20, 20, this.cubicmap.width * 4, this.cubicmap.height * 4, GREEN);

        // Draw player position radar
        drawRectangle(getScreenWidth() - this.cubicmap.width * 4 - 20 + this.playerCellX * 4, 20 + this.playerCellY * 4, 4, 4, RED);

        drawFPS(10, 10);
    }

    unload(): void {
        enableCursor();
        unloadTexture(this.cubicmap); // Unload cubicmap texture
        unloadTexture(this.texture); // Unload map texture
        unloadModel(this.model); // Unload map model
        super.unload()
    }
}
