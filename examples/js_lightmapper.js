function drawScene(scene){
	drawModel(scene.raylib_model, new Vector3(0,0,0), 1, WHITE);
}

setConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI | FLAG_VSYNC_HINT);

initWindow(1024,768,"Test");

const scene = {}

scene.raylib_model = loadModel("../assets/models/gazebo.obj");

// Demonstration how to merge models into a single mesh
// let m = loadModel("../assets/models/untitled_no_lm.obj");
// if(m.meshCount > 1){
//     traceLog(LOG_INFO, "Starting merge of "+ m.meshCount + " meshes")
//     let currentMesh = getModelMesh(m, 0);
//     for (let i = 1; i < m.meshCount; i++) {
//         const mesh = getModelMesh(m, i)
//         const merged = meshMerge(mesh, currentMesh);
//         if(i > 1) unloadMesh(currentMesh)
//         currentMesh = merged
//     }
//     unloadModel(m)
//     uploadMesh(currentMesh)
//     traceLog(LOG_INFO, "Mesh successfully merged")
//     m = loadModelFromMesh(currentMesh)
// }

const bbox = getModelBoundingBox(scene.raylib_model)

scene.w = 256;
scene.h = 256;
scene.raylib_texture = loadTextureFromImage(genImageColor(1,1,BLACK));
const defMat = loadMaterialDefault();
setMaterialTexture(defMat, MATERIAL_MAP_ALBEDO, scene.raylib_texture);
setModelMaterial(scene.raylib_model, 0, defMat);

const position = new Vector3( 0, bbox.min.y + ((bbox.max.y - bbox.min.y) / 2), bbox.max.z - bbox.min.z ); // Camera position
const target = new Vector3( 0.0, bbox.min.y + ((bbox.max.y - bbox.min.y) / 2), 0.0);     // Camera looking at point
const up = new Vector3(0.0, 1.0, 0.0);          // Camera up vector (rotation towards target)
const fovy = 45.0;                                // Camera field-of-view Y
const projection = CAMERA_PERSPECTIVE;                   // Camera mode type
scene.camera = new Camera3D(position, target, up, fovy, projection);
const config = getDefaultLightmapperConfig();
//config.backgroundColor = new Color(10,10,10);
//config.hemisphereSize = 512;
const mesh = getModelMesh(scene.raylib_model, 0);
const lm = loadLightmapper(scene.w, scene.h, mesh, config);
const lmMat = loadMaterialLightmapper(BLACK, 0);
const light = genMeshCube(0.2,0.2,0.2);
const lightMaterial = loadMaterialLightmapper(ORANGE, .1); 

while (!windowShouldClose())
{
    const wm = getMouseWheelMove()
    if(wm !== 0){
        const camPos = scene.camera.position;
        const fac = 1 + (wm * -0.1)
        scene.camera.position = vector3Multiply(camPos, new Vector3(fac, fac, fac));
    }

    if(isMouseButtonDown(MOUSE_BUTTON_LEFT))
        updateCamera(scene.camera, CAMERA_THIRD_PERSON);

    if(lm.progress < 1.0){
        let startTime = getTime();
        beginLightmap();
        while(beginLightmapFragment(lm)){
            drawMesh(mesh, lmMat, matrixIdentity());
            // drawMesh(light, lightMaterial, matrixTranslate(0.0,0.3,0.5));
            // drawMesh(light, lightMaterial, matrixTranslate(0.0,0.3,-0.5));
            //drawMesh(light, lightMaterial, matrixMultiply(matrixScale(60,60,60), matrixTranslate(0.0,150,0)));
            // drawMesh(light, lightMaterial, matrixTranslate(0.5,0.3,0));
            // drawMesh(light, lightMaterial, matrixTranslate(-0.5,0.3,0));
            endLightmapFragment(lm);
            // display progress every second (printf is expensive)
            let time = getTime();
            if (getTime() - startTime > 0.03) break;
        }
        endLightmap();
        if(lm.progress == 1.0){
            const img = loadImageFromLightmapper(lm);
            //exportImage(img, "my_result.png");
            const old = scene.raylib_texture;
            scene.raylib_texture = loadTextureFromImage(img);
            setTextureFilter(scene.raylib_texture, TEXTURE_FILTER_TRILINEAR);
            unloadTexture(old);
            let mat = loadMaterialDefault();
            setMaterialTexture(mat, MATERIAL_MAP_DIFFUSE, scene.raylib_texture);
            setModelMaterial(scene.raylib_model, 0, mat);
            unloadLightmapper(lm);
        }
    }

    beginDrawing();
        clearBackground(BLUE);
        
            beginMode3D(scene.camera);
            drawScene(scene);
            endMode3D();
        
        // printf("%d\n",(int)(lm.progress*GetScreenWidth()));
        if(lm.progress < 1.0){
            drawRectangle(0,0,getScreenWidth(),20, fade(GREEN,0.5));
            drawRectangle(0,0,getScreenWidth()*lm.progress,20, GREEN);
        }
    endDrawing();
}

unloadModel(scene.raylib_model);
unloadTexture(scene.raylib_texture);
closeWindow();