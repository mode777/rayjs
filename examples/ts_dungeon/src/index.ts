/*******************************************************************************************
*
*   raylib [shaders] example - basic lighting
*
*   NOTE: This example requires raylib OpenGL 3.3 or ES2 versions for shaders support,
*         OpenGL 1.1 does not support shaders, recompile raylib to OpenGL 3.3 version.
*
*   NOTE: Shaders used in this example are #version 330 (OpenGL 3.3).
*
*   Example originally created with raylib 3.0, last time updated with raylib 4.2
*
*   Example contributed by Chris Camacho (@codifies) and reviewed by Ramon Santamaria (@raysan5)
*
*   Example licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2019-2023 Chris Camacho (@codifies) and Ramon Santamaria (@raysan5)
*
********************************************************************************************/

import { dispatchPromises } from "./promise-extensions";
import { interpolate, interpolateVec3, wait } from "./timing";

const GLSL_VERSION = "330"

// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 800;
const screenHeight = 450;

setConfigFlags(FLAG_MSAA_4X_HINT);  // Enable Multi Sampling Anti Aliasing 4x (if available)
initWindow(screenWidth, screenHeight, "raylib [shaders] example - basic lighting");

// Define the camera to look into our 3d world
const position = new Vector3(0.0,1.0,0.0);    // Camera position
const target = new Vector3(0.0,1.0,1.0);      // Camera looking at point
const up = new Vector3(0.0,1.0,0.0);          // Camera up vector (rotation towards target)
const fovy = 90.0;                                // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;             // Camera projection type
const camera = new Camera3D(position,target,up,fovy,projection)

// Load plane model from a generated mesh
const floor = loadModelFromMesh(genMeshPlane(2.0, 2.0, 1, 1));
const cube = loadModelFromMesh(genMeshCube(2.0, 2.0, 2.0));

// Load basic lighting shader
const shader = loadShader(`resources/shaders/glsl${GLSL_VERSION}/lighting.vs`,
                            `resources/shaders/glsl${GLSL_VERSION}/lighting.fs`);
// Get some required shader locations
const viewLoc = getShaderLocation(shader, "viewPos")
// NOTE: "matModel" location name is automatically assigned on shader loading, 
// no need to get the location again if using that uniform name
//shader.locs[SHADER_LOC_MATRIX_MODEL] = getShaderLocation(shader, "matModel");

// Ambient light level (some basic lighting)
const ambientLoc = getShaderLocation(shader, "ambient");
setShaderValue(shader, ambientLoc, new Vector4(0.1, 0.1, 0.1, 1.0), SHADER_UNIFORM_VEC4);

const textureWall = loadTexture("resources/retro-texture-pack-v9/png/BRICK_1A.png")
const textureFloor = loadTexture("resources/retro-texture-pack-v9/png/TILE_2C.png")

// Assign out lighting shader to model
const matModel = loadMaterialDefault()
matModel.shader = shader
setMaterialTexture(matModel, MATERIAL_MAP_DIFFUSE, textureFloor)
setModelMaterial(floor, 0, matModel)
const matCube = loadMaterialDefault()
setMaterialTexture(matCube, MATERIAL_MAP_DIFFUSE, textureWall)

matCube.shader = shader
setModelMaterial(cube, 0, matCube)

// Create lights
const lights: Light[] = new Array(4)
lights[0] = createLight(LIGHT_POINT, new Vector3(4,1,4), vector3Zero(), WHITE, shader);
lights[1] = createLight(LIGHT_POINT, new Vector3(4,1,8), vector3Zero(), RED, shader);
lights[2] = createLight(LIGHT_POINT, new Vector3(12,1,12), vector3Zero(), GREEN, shader);
lights[3] = createLight(LIGHT_POINT, new Vector3(8,1,4), vector3Zero(), BLUE, shader);

setTargetFPS(60);                   // Set our game to run at 60 frames-per-second
//--------------------------------------------------------------------------------------

//disableCursor()

class Map {
    private _image: Image;
    private _texture?: Texture
    get texture() { return (this._texture = this._texture ?? loadTextureFromImage(this._image)) }
    private _data?: number[]
    get data() { return (this._data = this._data ?? this.loadData()) }

    constructor(public readonly width: number, public readonly height: number){
        this._image = genImageColor(width,height,BLACK)
    }

    public iterateData(fn: (x: number, y: number, item: number) => void){
        this.foreachXY((x,y) => fn(x,y,this.data[y*this.width+x]))
    }

    private foreachXY(fn: (x: number, y: number) => void){
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                fn(x,y)
            }
        }
    }

    private loadData(){
        const data: number[] = []
        this.foreachXY((x,y) => data[y*this.width+x] = getImageColor(this._image,x,y).r)
        return data
    }

    makeWall(x: number, y: number){
        imageDrawPixel(this._image, x,y,WHITE)
        if(this._texture) unloadTexture(this._texture)
        this._texture = undefined
        this._data = undefined
    }
}

const map = new Map(16,16)

let playerPos = new Vector3(2,1,2);
let playerAngle = 0
let playerDir = new Vector3(0,0,1)

const forward = new Vector3(2,0,2)
const backward = new Vector3(-2,0,-2)

async function main(){
    while(true){
        if(isKeyDown(KEY_UP)){
            await interpolateVec3(playerPos, vector3Add(playerPos, vector3Multiply(playerDir, forward)), 1, v => playerPos = v, easeCubicInOut)
        } else if(isKeyDown(KEY_DOWN)){
            await interpolateVec3(playerPos, vector3Add(playerPos, vector3Multiply(playerDir, backward)), 1, v => playerPos = v, easeCubicInOut)
        } else if(isKeyDown(KEY_LEFT)){
            await interpolate(playerAngle, playerAngle-90, 1, v => playerAngle = v, easeCubicInOut)
        } else if(isKeyDown(KEY_RIGHT)){
            await interpolate(playerAngle, playerAngle+90, 1, v => playerAngle = v, easeCubicInOut)
        }
        await wait(0.0)
    }
}

main()

const MAP_SCALE = 8
// Main game loop
while (!windowShouldClose())        // Detect window close button or ESC key
{
    dispatchPromises()
    // Update
    //----------------------------------------------------------------------------------
    //updateCamera(camera, CAMERA_FIRST_PERSON);
    
    camera.position = playerPos
    const dir = vector2Rotate(new Vector2(0,1), playerAngle*DEG2RAD)
    playerDir = new Vector3(dir.x, 0, dir.y)
    camera.target = vector3Add(playerDir, playerPos)


    const mousePos = getMousePosition()
    const mouseTile = new Vector2(Math.floor(mousePos.x/8),Math.floor(mousePos.y/8))
    if(isMouseButtonPressed(MOUSE_BUTTON_LEFT) && mouseTile.x < map.width && mouseTile.y < map.height){
        map.makeWall(mouseTile.x, mouseTile.y)
    }

    // Update the shader with the camera view vector (points towards { 0.0, 0.0, 0.0 })
    const cameraPos = new Vector3(camera.position.x, camera.position.y, camera.position.z);
    setShaderValue(shader, viewLoc, cameraPos, SHADER_UNIFORM_VEC3);
    
    // Check key inputs to enable/disable lights
    if (isKeyPressed(KEY_Y)) { lights[0].enabled = !lights[0].enabled; }
    if (isKeyPressed(KEY_R)) { lights[1].enabled = !lights[1].enabled; }
    if (isKeyPressed(KEY_G)) { lights[2].enabled = !lights[2].enabled; }
    if (isKeyPressed(KEY_B)) { lights[3].enabled = !lights[3].enabled; }
    

    lights[0].position = playerPos
    // Update light values (actually, only enable/disable them)
    for (let i = 0; i < 4; i++) updateLightValues(shader, lights[i]);
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(RAYWHITE);
        beginMode3D(camera);

            map.iterateData((x,y,e) => {
                if(e === 0) drawModel(floor, new Vector3(x*2,0,y*2), 1.0, WHITE)
                else drawModel(cube, new Vector3(x*2,1,y*2), 1.0, WHITE)
            })

            // Draw spheres to show where the lights are
            for (let i = 0; i < 4; i++)
            {
                if (lights[i].enabled) drawSphereEx(lights[i].position, 0.2, 8, 8, lights[i].color);
                else drawSphereWires(lights[i].position, 0.2, 8, 8, colorAlpha(lights[i].color, 0.3));
            }

            drawGrid(10, 1.0);

        endMode3D();

        drawTextureEx(map.texture, new Vector2(0,0), 0, MAP_SCALE, WHITE)
        const mrot = matrixRotateZ(playerAngle*DEG2RAD)
        const mscale = matrixScale(4,4,1)
        const trans = matrixTranslate(playerPos.x, playerPos.z, 0)
        const m = matrixMultiply(mrot, matrixMultiply(trans, mscale))
        const p1 = vector2Transform(new Vector2(-1,-1),m)
        const p2 = vector2Transform(new Vector2(1,-1),m)
        const p3 = vector2Transform(new Vector2(0.0,2),m)
        //drawCircle(p1.x, p1.y, 4, RED)
        //traceLog(LOG_INFO, playerPos.y.toString())
        drawTriangle(p2,p1,p3, BLUE)
        drawText("Click on the black square to place walls.\nUse direction keys to move around.", 150, 20, 16, BLACK)
    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
unloadModel(floor);     // Unload the model
unloadModel(cube);      // Unload the model
unloadShader(shader);   // Unload shader
unloadTexture(textureWall);

closeWindow();          // Close window and OpenGL context
//--------------------------------------------------------------------------------------


