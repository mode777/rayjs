import { readFileSync, writeFileSync } from "fs";
import { RayLibApi, RayLibFunction, RayLibType } from "./interfaces";
import { ApiDescription, ApiFunction } from "./api";
import { RayLibHeader } from "./raylib-header";

function parseMathHeader(): RayLibFunction[] {
    const i = readFileSync("thirdparty/raylib/src/raymath.h", 'utf8')
    const m = [...i.matchAll(/((?:\/\/ .+\n)*)RMAPI\s+([\w<>]+)\s+([\w<>]+)\((.*)\)/gm)]
    const res = m.map(groups => {
        const args = groups[4].split(',').filter(x => x !== 'void').map(arg => {
            arg = arg.trim().replace(" *", "* ")
            const frags = arg.split(' ')
            const name = frags.pop()
            const type = frags.join(' ').replace("*", " *")
            
            return { name: name || "", type: type }
        })
        const comments = groups[1].split('\n').map(x => x.replace("// ","")).join('\n').trim()
        return {
            name: groups[3],
            returnType: groups[2],
            params: args,
            description: comments
        }
    })
    return res;
}

function main(){
     
    // Load the pre-generated raylib api
    const api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))
    
    api.functions.push({
        name: "SetModelMaterial",
        description: "Replace material in slot materialIndex",
        returnType: "void",
        params: [{type: "Model *",name:"model"},{type:"int",name:"materialIndex"},{type:"Material",name:"material"}]
    })
    const mathApi = parseMathHeader();
    writeFileSync("bindings/raylib_math_api.json", JSON.stringify(mathApi))
    mathApi.forEach(x => api.functions.push(x))

    const apiDesc = new ApiDescription(api)
    const core = new RayLibHeader("raylib_core", apiDesc)
    core.addApiStructByName("Color", {
        properties: {
            r: { get: true, set: true },
            g: { get: true, set: true },
            b: { get: true, set: true },
            a: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Rectangle", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            width: { get: true, set: true },
            height: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Vector2", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Vector3", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Vector4", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
            w: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Ray", {
        properties: {
            position: { get: false, set: true },
            direction: { get: false, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("RayCollision", {
        properties: {
            hit: { get: true, set: false },
            distance: { get: true, set: false },
            point: { get: true, set: false },
            normal: { get: true, set: false },
        },
        createConstructor: false
    })
    core.addApiStructByName("Camera2D",{
        properties: {
            offset: { get: true, set: true },
            target: { get: true, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Camera3D",{
        properties: {
            position: { get: true, set: true },
            target: { get: true, set: true },
            up: { get: false, set: true },
            fovy: { get: true, set: true },
            projection: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("BoundingBox",{
        properties: {
            min: { get: true, set: true },
            max: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Matrix",{
        properties: {},
        createConstructor: false
    })
    core.addApiStructByName("NPatchInfo",{
        properties: {
            source: { get: true, set: true },
            left: { get: true, set: true },
            top: { get: true, set: true },
            right: { get: true, set: true },
            bottom: { get: true, set: true },
            layout: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Image", { 
        properties: { 
            //data: { set: true },
            width: { get: true }, 
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true }
        },
        //destructor: "UnloadImage"
    })
    core.addApiStructByName("Wave", { 
        properties: { 
            frameCount: { get: true }, 
            sampleRate: { get: true },
            sampleSize: { get: true },
            channels: { get: true }
        },
        //destructor: "UnloadWave"
    })
    core.addApiStructByName("Sound", { 
        properties: { 
            frameCount: { get: true }
        },
        //destructor: "UnloadSound"
    })
    core.addApiStructByName("Music", { 
        properties: { 
            frameCount: { get: true },
            looping: { get: true, set: true },
            ctxType: { get: true },
        },
        //destructor: "UnloadMusicStream"
    })
    core.addApiStructByName("Model", { 
        properties: {
            transform: { get: true, set: true },
            meshCount: { get: true },
            materialCount: { get: true },
            boneCount: { get: true },
        },
        //destructor: "UnloadModel"
    })
    core.addApiStructByName("Mesh", { 
        properties: {
            vertexCount: { get: true, set: true },
            triangleCount: { get: true, set: true },
            // TODO: Free previous pointers before overwriting
            vertices: { set: true },
            texcoords: { set: true },
            texcoords2: { set: true },
            normals: { set: true },
            tangents: { set: true },
            colors: { set: true },
            indices: { set: true },
            animVertices: { set: true },
            animNormals: { set: true },
            boneIds: { set: true },
            boneWeights: { set: true },
        },
        createEmptyConstructor: true
        //destructor: "UnloadMesh"
    })
    core.addApiStructByName("Shader", { 
        properties: {
            id: { get: true }
        },
        //destructor: "UnloadShader"
    })
    core.addApiStructByName("Texture", { 
        properties: { 
            width: { get: true }, 
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true },
        },
        //destructor: "UnloadTexture"
    })
    core.addApiStructByName("Font", { 
        properties: { 
            baseSize: { get: true },
            glyphCount: { get: true },
            glyphPadding: { get: true },
        },
        //destructor: "UnloadFont"
    })
    core.addApiStructByName("RenderTexture", { 
        properties: {
            id: { get: true }
        },
        //destructor: "UnloadRenderTexture"
    })
    core.addApiStructByName("MaterialMap", { 
        properties: { 
            texture: { set: true },
            color: { set: true, get: true },
            value: { get: true, set: true }
        },
        //destructor: "UnloadMaterialMap"
    })
    core.addApiStructByName("Material", { 
        properties: { 
            shader: { set: true }
        },
        //destructor: "UnloadMaterial"
    })

    // Window-related functions
    core.addApiFunctionByName("InitWindow")
    core.addApiFunctionByName("WindowShouldClose")
    core.addApiFunctionByName("CloseWindow")
    core.addApiFunctionByName("IsWindowReady")
    core.addApiFunctionByName("IsWindowFullscreen")
    core.addApiFunctionByName("IsWindowHidden")
    core.addApiFunctionByName("IsWindowMinimized")
    core.addApiFunctionByName("IsWindowMaximized")
    core.addApiFunctionByName("IsWindowFocused")
    core.addApiFunctionByName("IsWindowResized")
    core.addApiFunctionByName("IsWindowState")
    core.addApiFunctionByName("SetWindowState")
    core.addApiFunctionByName("ClearWindowState")
    core.addApiFunctionByName("ToggleFullscreen")
    core.addApiFunctionByName("MaximizeWindow")
    core.addApiFunctionByName("MinimizeWindow")
    core.addApiFunctionByName("RestoreWindow")
    core.addApiFunctionByName("SetWindowIcon")
    // SetWindowIcons
    core.addApiFunctionByName("SetWindowTitle")
    core.addApiFunctionByName("SetWindowPosition")
    core.addApiFunctionByName("SetWindowMonitor")
    core.addApiFunctionByName("SetWindowMinSize")
    core.addApiFunctionByName("SetWindowSize")
    core.addApiFunctionByName("SetWindowOpacity")
    // GetWindowHandle
    core.addApiFunctionByName("GetScreenWidth")
    core.addApiFunctionByName("GetScreenHeight")
    core.addApiFunctionByName("GetRenderWidth")
    core.addApiFunctionByName("GetRenderHeight")
    core.addApiFunctionByName("GetMonitorCount")
    core.addApiFunctionByName("GetCurrentMonitor")
    core.addApiFunctionByName("GetMonitorPosition")
    core.addApiFunctionByName("GetMonitorWidth")
    core.addApiFunctionByName("GetMonitorHeight")
    core.addApiFunctionByName("GetMonitorPhysicalWidth")
    core.addApiFunctionByName("GetMonitorPhysicalHeight")
    core.addApiFunctionByName("GetMonitorRefreshRate")
    core.addApiFunctionByName("GetWindowPosition")
    core.addApiFunctionByName("GetWindowScaleDPI")
    core.addApiFunctionByName("GetMonitorName")
    core.addApiFunctionByName("SetClipboardText")
    core.addApiFunctionByName("GetClipboardText")
    core.addApiFunctionByName("EnableEventWaiting")
    core.addApiFunctionByName("DisableEventWaiting")

    // Custom frame control functions
    // NOT SUPPORTED BECAUSE NEEDS COMPILER FLAG

    // Cursor-related functions
    core.addApiFunctionByName("ShowCursor")
    core.addApiFunctionByName("HideCursor")
    core.addApiFunctionByName("IsCursorHidden")
    core.addApiFunctionByName("EnableCursor")
    core.addApiFunctionByName("DisableCursor")
    core.addApiFunctionByName("IsCursorOnScreen")

    // Drawing related functions
    core.addApiFunctionByName("ClearBackground")
    core.addApiFunctionByName("BeginDrawing")
    core.addApiFunctionByName("EndDrawing", null, { before: fun => fun.call("app_update_quickjs", []) })
    core.addApiFunctionByName("BeginMode2D")
    core.addApiFunctionByName("EndMode2D")
    core.addApiFunctionByName("BeginMode3D")
    core.addApiFunctionByName("EndMode3D")
    core.addApiFunctionByName("BeginTextureMode")
    core.addApiFunctionByName("EndTextureMode")
    core.addApiFunctionByName("BeginShaderMode")
    core.addApiFunctionByName("EndShaderMode")
    core.addApiFunctionByName("BeginBlendMode")
    core.addApiFunctionByName("EndBlendMode")
    core.addApiFunctionByName("BeginScissorMode")
    core.addApiFunctionByName("EndScissorMode")
    //core.addApiFunctionByName("BeginVrStereoMode")
    //core.addApiFunctionByName("EndVrStereoMode")
    
    // VR Stereo config options
    //core.addApiFunctionByName("LoadVrStereoConfig")
    //core.addApiFunctionByName("UnloadVrStereoConfig")

    // Shader Management
    core.addApiFunctionByName("LoadShader")
    core.addApiFunctionByName("LoadShaderFromMemory")
    core.addApiFunctionByName("IsShaderReady")
    core.addApiFunctionByName("GetShaderLocation")
    core.addApiFunctionByName("GetShaderLocationAttrib")
    core.addApiFunctionByName("SetShaderValue", null, { body: (gen) => {
        gen.jsToC("Shader","shader","argv[0]", core.structLookup)
        gen.jsToC("int","locIndex","argv[1]", core.structLookup)
        gen.declare("value","void *", false, "NULL")
        gen.declare("valueFloat", "float")
        gen.declare("valueInt", "int")
        gen.jsToC("int","uniformType","argv[3]", core.structLookup)
        const sw = gen.switch("uniformType")
        let b = sw.caseBreak("SHADER_UNIFORM_FLOAT")
        b.jsToC("float", "valueFloat", "argv[2]", core.structLookup, true)
        b.statement("value = (void *)&valueFloat")
        b = sw.caseBreak("SHADER_UNIFORM_VEC2")
        b.jsToC("Vector2 *", "valueV2", "argv[2]", core.structLookup)
        b.statement("value = (void*)valueV2")
        b = sw.caseBreak("SHADER_UNIFORM_VEC3")
        b.jsToC("Vector3 *", "valueV3", "argv[2]", core.structLookup)
        b.statement("value = (void*)valueV3")
        b = sw.caseBreak("SHADER_UNIFORM_VEC4")
        b.jsToC("Vector4 *", "valueV4", "argv[2]", core.structLookup)
        b.statement("value = (void*)valueV4")
        b = sw.caseBreak("SHADER_UNIFORM_INT")
        b.jsToC("int", "valueInt", "argv[2]", core.structLookup, true)
        b.statement("value = (void*)&valueInt")
        b = sw.defaultBreak()
        b.returnExp("JS_EXCEPTION")
        gen.call("SetShaderValue", ["shader","locIndex","value","uniformType"])
        gen.returnExp("JS_UNDEFINED")
    }})
    // core.addApiFunctionByName("SetShaderValueV")
    core.addApiFunctionByName("SetShaderValueMatrix")
    core.addApiFunctionByName("SetShaderValueTexture")
    core.addApiFunctionByName("UnloadShader")

    // ScreenSpaceRelatedFunctions
    core.addApiFunctionByName("GetMouseRay")
    core.addApiFunctionByName("GetCameraMatrix")
    core.addApiFunctionByName("GetCameraMatrix2D")
    core.addApiFunctionByName("GetWorldToScreen")
    core.addApiFunctionByName("GetScreenToWorld2D")
    core.addApiFunctionByName("GetWorldToScreenEx")
    core.addApiFunctionByName("GetWorldToScreen2D")

    // Timing related functions
    core.addApiFunctionByName("SetTargetFPS")
    core.addApiFunctionByName("GetFPS")
    core.addApiFunctionByName("GetFrameTime")
    core.addApiFunctionByName("GetTime")

    // Misc functions
    core.addApiFunctionByName("GetRandomValue")
    core.addApiFunctionByName("SetRandomSeed")
    core.addApiFunctionByName("TakeScreenshot")
    core.addApiFunctionByName("SetConfigFlags")

    const traceLog = apiDesc.getFunction("TraceLog")
    if(!traceLog) throw new Error("TraceLog not found")
    traceLog.params.pop()
    core.addApiFunction(traceLog)
    core.addApiFunctionByName("SetTraceLogLevel")
    // Memory functions not supported on JS
    core.addApiFunctionByName("OpenURL")

    // Callbacks not supported on JS

    // Files management functions
    const lfd = apiDesc.getFunction("LoadFileData")
    lfd?.params.pop()
    core.addApiFunctionByName("LoadFileData", null, { body: gen => {
        gen.jsToC("const char *", "fileName", "argv[0]")
        gen.declare("bytesRead", "unsigned int")
        gen.call("LoadFileData", ["fileName", "&bytesRead"], { type: "unsigned char *", name: "retVal" })
        gen.statement("JSValue buffer = JS_NewArrayBufferCopy(ctx, (const uint8_t*)retVal, bytesRead)")
        gen.call("UnloadFileData", ["retVal"])
        gen.jsCleanUpParameter("const char*","fileName")
        gen.returnExp("buffer")
    } })
    //UnloadLoadFileData not needed, data is copied
    // TODO: Works but unnecessary makes copy of memory
    core.addApiFunctionByName("SaveFileData")
    // Export data as code not needed
    core.addApiFunctionByName("LoadFileText", null, { after: gen => gen.call("UnloadFileText", ["returnVal"]) })
    core.addApiFunctionByName("SaveFileText")
    core.addApiFunctionByName("FileExists")
    core.addApiFunctionByName("DirectoryExists")
    core.addApiFunctionByName("IsFileExtension")
    core.addApiFunctionByName("GetFileLength")
    // TODO: Who needs to clean memory here?
    core.addApiFunctionByName("GetFileExtension")
    core.addApiFunctionByName("GetFileName")
    core.addApiFunctionByName("GetFileNameWithoutExt")
    core.addApiFunctionByName("GetDirectoryPath")
    core.addApiFunctionByName("GetPrevDirectoryPath")
    core.addApiFunctionByName("GetWorkingDirectory")
    core.addApiFunctionByName("GetApplicationDirectory")
    core.addApiFunctionByName("ChangeDirectory")
    core.addApiFunctionByName("IsPathFile")
    //core.addApiFunctionByName("LoadDirectoryFiles")
    //core.addApiFunctionByName("LoadDirectoryFilesEx")
    // UnloadDirectoryFiles
    core.addApiFunctionByName("IsFileDropped")
    //core.addApiFunctionByName("LoadDroppedFiles")
    // UnloadDroppedFiles
    core.addApiFunctionByName("GetFileModTime")
    
    // Compression/encoding functionality
    //core.addApiFunctionByName("CompressData")
    //core.addApiFunctionByName("DecompressData")
    //core.addApiFunctionByName("EncodeDataBase64")
    //core.addApiFunctionByName("DecodeDataBase64")

    // input handling functions
    core.addApiFunctionByName("IsKeyPressed")
    core.addApiFunctionByName("IsKeyDown")
    core.addApiFunctionByName("IsKeyReleased")
    core.addApiFunctionByName("IsKeyUp")
    core.addApiFunctionByName("SetExitKey")
    core.addApiFunctionByName("GetKeyPressed")
    core.addApiFunctionByName("GetCharPressed")

    // input-related functions: gamepads
    core.addApiFunctionByName("IsGamepadAvailable")
    core.addApiFunctionByName("GetGamepadName")
    core.addApiFunctionByName("IsGamepadButtonPressed")
    core.addApiFunctionByName("IsGamepadButtonDown")
    core.addApiFunctionByName("IsGamepadButtonReleased")
    core.addApiFunctionByName("IsGamepadButtonUp")
    core.addApiFunctionByName("GetGamepadButtonPressed")
    core.addApiFunctionByName("GetGamepadAxisCount")
    core.addApiFunctionByName("GetGamepadAxisMovement")
    core.addApiFunctionByName("SetGamepadMappings")

    // input-related functions: mouse
    core.addApiFunctionByName("IsMouseButtonPressed")
    core.addApiFunctionByName("IsMouseButtonDown")
    core.addApiFunctionByName("IsMouseButtonReleased")
    core.addApiFunctionByName("IsMouseButtonUp")
    core.addApiFunctionByName("GetMouseX")
    core.addApiFunctionByName("GetMouseY")
    core.addApiFunctionByName("GetMousePosition")
    core.addApiFunctionByName("GetMouseDelta")
    core.addApiFunctionByName("SetMousePosition")
    core.addApiFunctionByName("SetMouseOffset")
    core.addApiFunctionByName("SetMouseScale")
    core.addApiFunctionByName("GetMouseWheelMove")
    core.addApiFunctionByName("GetMouseWheelMoveV")
    core.addApiFunctionByName("SetMouseCursor")

    // input-related functions: touch
    core.addApiFunctionByName("GetTouchX")
    core.addApiFunctionByName("GetTouchY")
    core.addApiFunctionByName("GetTouchPosition")
    core.addApiFunctionByName("GetTouchPointId")
    core.addApiFunctionByName("GetTouchPointCount")

    // Gesture and touch handling functions
    core.addApiFunctionByName("SetGesturesEnabled")
    core.addApiFunctionByName("IsGestureDetected")
    core.addApiFunctionByName("GetGestureDetected")
    core.addApiFunctionByName("GetGestureHoldDuration")
    core.addApiFunctionByName("GetGestureDragVector")
    core.addApiFunctionByName("GetGestureDragAngle")
    core.addApiFunctionByName("GetGesturePinchVector")
    core.addApiFunctionByName("GetGesturePinchAngle")
    
    // Camera system functions
    core.addApiFunctionByName("UpdateCamera")
    core.addApiFunctionByName("UpdateCameraPro")

    //api.functions.forEach(x => console.log(`core.addApiFunctionByName("${x.name}")`))

    // module: rshapes
    core.addApiFunctionByName("SetShapesTexture")

    // Basic shapes drawing functions
    core.addApiFunctionByName("DrawPixel")
    core.addApiFunctionByName("DrawPixelV")
    core.addApiFunctionByName("DrawLine")
    core.addApiFunctionByName("DrawLineV")
    core.addApiFunctionByName("DrawLineEx")
    core.addApiFunctionByName("DrawLineBezier")
    core.addApiFunctionByName("DrawLineBezierQuad")
    core.addApiFunctionByName("DrawLineBezierCubic")
    // core.addApiFunctionByName("DrawLineStrip")
    core.addApiFunctionByName("DrawCircle")
    core.addApiFunctionByName("DrawCircleSector")
    core.addApiFunctionByName("DrawCircleSectorLines")
    core.addApiFunctionByName("DrawCircleGradient")
    core.addApiFunctionByName("DrawCircleV")
    core.addApiFunctionByName("DrawCircleLines")
    core.addApiFunctionByName("DrawEllipse")
    core.addApiFunctionByName("DrawEllipseLines")
    core.addApiFunctionByName("DrawRing")
    core.addApiFunctionByName("DrawRingLines")
    core.addApiFunctionByName("DrawRectangle")
    core.addApiFunctionByName("DrawRectangleV")
    core.addApiFunctionByName("DrawRectangleRec")
    core.addApiFunctionByName("DrawRectanglePro")
    core.addApiFunctionByName("DrawRectangleGradientV")
    core.addApiFunctionByName("DrawRectangleGradientH")
    core.addApiFunctionByName("DrawRectangleGradientEx")
    core.addApiFunctionByName("DrawRectangleLines")
    core.addApiFunctionByName("DrawRectangleLinesEx")
    core.addApiFunctionByName("DrawRectangleRounded")
    core.addApiFunctionByName("DrawRectangleRoundedLines")
    core.addApiFunctionByName("DrawTriangle")
    core.addApiFunctionByName("DrawTriangleLines")
    //core.addApiFunctionByName("DrawTriangleFan")
    //core.addApiFunctionByName("DrawTriangleStrip")
    core.addApiFunctionByName("DrawPoly")
    core.addApiFunctionByName("DrawPolyLines")
    core.addApiFunctionByName("DrawPolyLinesEx")

    // Basic shapes collision detection functions
    core.addApiFunctionByName("CheckCollisionRecs")
    core.addApiFunctionByName("CheckCollisionCircles")
    core.addApiFunctionByName("CheckCollisionCircleRec")
    core.addApiFunctionByName("CheckCollisionPointRec")
    core.addApiFunctionByName("CheckCollisionPointCircle")
    core.addApiFunctionByName("CheckCollisionPointTriangle")
    // core.addApiFunctionByName("CheckCollisionPointPoly")
    // core.addApiFunctionByName("CheckCollisionLines")
    core.addApiFunctionByName("CheckCollisionPointLine")
    core.addApiFunctionByName("GetCollisionRec")

    // Image loading functions
    core.addApiFunctionByName("LoadImage")
    core.addApiFunctionByName("LoadImageRaw")
    // core.addApiFunctionByName("LoadImageAnim")
    core.addApiFunctionByName("LoadImageFromMemory")
    core.addApiFunctionByName("LoadImageFromTexture")
    core.addApiFunctionByName("LoadImageFromScreen")
    core.addApiFunctionByName("IsImageReady")
    core.addApiFunctionByName("UnloadImage")
    core.addApiFunctionByName("ExportImage")
    // needed?
    // core.addApiFunctionByName("ExportImageAsCode")

    // Image generation functions
    core.addApiFunctionByName("GenImageColor")
    core.addApiFunctionByName("GenImageGradientV")
    core.addApiFunctionByName("GenImageGradientH")
    core.addApiFunctionByName("GenImageGradientRadial")
    core.addApiFunctionByName("GenImageChecked")
    core.addApiFunctionByName("GenImageWhiteNoise")
    core.addApiFunctionByName("GenImagePerlinNoise")
    core.addApiFunctionByName("GenImageCellular")
    core.addApiFunctionByName("GenImageText")
    
    // Image manipulations functions
    core.addApiFunctionByName("ImageCopy")
    core.addApiFunctionByName("ImageFromImage")
    core.addApiFunctionByName("ImageText")
    core.addApiFunctionByName("ImageTextEx")
    core.addApiFunctionByName("ImageFormat")
    core.addApiFunctionByName("ImageToPOT")
    core.addApiFunctionByName("ImageCrop")
    core.addApiFunctionByName("ImageAlphaCrop")
    core.addApiFunctionByName("ImageAlphaClear")
    core.addApiFunctionByName("ImageAlphaMask")
    core.addApiFunctionByName("ImageAlphaPremultiply")
    core.addApiFunctionByName("ImageBlurGaussian")
    core.addApiFunctionByName("ImageResize")
    core.addApiFunctionByName("ImageResizeNN")
    core.addApiFunctionByName("ImageResizeCanvas")
    core.addApiFunctionByName("ImageMipmaps")
    core.addApiFunctionByName("ImageDither")
    core.addApiFunctionByName("ImageFlipVertical")
    core.addApiFunctionByName("ImageFlipHorizontal")
    core.addApiFunctionByName("ImageRotateCW")
    core.addApiFunctionByName("ImageRotateCCW")
    core.addApiFunctionByName("ImageColorTint")
    core.addApiFunctionByName("ImageColorInvert")
    core.addApiFunctionByName("ImageColorGrayscale")
    core.addApiFunctionByName("ImageColorContrast")
    core.addApiFunctionByName("ImageColorBrightness")
    core.addApiFunctionByName("ImageColorReplace")
    const lic = <ApiFunction>apiDesc.getFunction("LoadImageColors")
    lic.returnType = "unsigned char *"
    core.addApiFunction(lic, null, { body: (gen) => {
        gen.jsToC("Image","image","argv[0]", core.structLookup)
        gen.call("LoadImageColors", ["image"], {name:"colors",type:"Color *"})
        gen.statement("JSValue retVal = JS_NewArrayBufferCopy(ctx, (const uint8_t*)colors, image.width*image.height*sizeof(Color))")
        gen.call("UnloadImageColors", ["colors"])
        gen.returnExp("retVal")
    }})
    //core.addApiFunctionByName("LoadImagePalette")
    //core.addApiFunctionByName("UnloadImageColors")
    //core.addApiFunctionByName("UnloadImagePalette")
    core.addApiFunctionByName("GetImageAlphaBorder")
    core.addApiFunctionByName("GetImageColor")

    // Image drawing functions
    core.addApiFunctionByName("ImageClearBackground")
    core.addApiFunctionByName("ImageDrawPixel")
    core.addApiFunctionByName("ImageDrawPixelV")
    core.addApiFunctionByName("ImageDrawLine")
    core.addApiFunctionByName("ImageDrawLineV")
    core.addApiFunctionByName("ImageDrawCircle")
    core.addApiFunctionByName("ImageDrawCircleV")
    core.addApiFunctionByName("ImageDrawCircleLines")
    core.addApiFunctionByName("ImageDrawCircleLinesV")
    core.addApiFunctionByName("ImageDrawRectangle")
    core.addApiFunctionByName("ImageDrawRectangleV")
    core.addApiFunctionByName("ImageDrawRectangleRec")
    core.addApiFunctionByName("ImageDrawRectangleLines")
    core.addApiFunctionByName("ImageDraw")
    core.addApiFunctionByName("ImageDrawText")
    core.addApiFunctionByName("ImageDrawTextEx")

    // Texture loading functions
    core.addApiFunctionByName("LoadTexture")
    core.addApiFunctionByName("LoadTextureFromImage")
    core.addApiFunctionByName("LoadTextureCubemap")
    core.addApiFunctionByName("LoadRenderTexture")
    core.addApiFunctionByName("IsTextureReady")
    core.addApiFunctionByName("UnloadTexture")
    core.addApiFunctionByName("IsRenderTextureReady")
    core.addApiFunctionByName("UnloadRenderTexture")
    core.addApiFunctionByName("UpdateTexture")
    core.addApiFunctionByName("UpdateTextureRec")
    
    // Texture configuration functions
    core.addApiFunctionByName("GenTextureMipmaps")
    core.addApiFunctionByName("SetTextureFilter")
    core.addApiFunctionByName("SetTextureWrap")

    // Texture drawing functions
    core.addApiFunctionByName("DrawTexture")
    core.addApiFunctionByName("DrawTextureV")
    core.addApiFunctionByName("DrawTextureEx")
    core.addApiFunctionByName("DrawTextureRec")
    core.addApiFunctionByName("DrawTexturePro")
    core.addApiFunctionByName("DrawTextureNPatch")
    
    // Color/pixel related functions
    core.addApiFunctionByName("Fade")
    core.addApiFunctionByName("ColorToInt")
    core.addApiFunctionByName("ColorNormalize")
    core.addApiFunctionByName("ColorFromNormalized")
    core.addApiFunctionByName("ColorToHSV")
    core.addApiFunctionByName("ColorFromHSV")
    core.addApiFunctionByName("ColorTint")
    core.addApiFunctionByName("ColorBrightness")
    core.addApiFunctionByName("ColorContrast")
    core.addApiFunctionByName("ColorAlpha")
    core.addApiFunctionByName("ColorAlphaBlend")
    core.addApiFunctionByName("GetColor")
    // core.addApiFunctionByName("GetPixelColor")
    // core.addApiFunctionByName("SetPixelColor")
    core.addApiFunctionByName("GetPixelDataSize")

    // module: rtext

    // Font loading/unloading
    core.addApiFunctionByName("GetFontDefault")
    core.addApiFunctionByName("LoadFont")
    // core.addApiFunctionByName("LoadFontEx")
    core.addApiFunctionByName("LoadFontFromImage")
    // core.addApiFunctionByName("LoadFontFromMemory")
    core.addApiFunctionByName("IsFontReady")
    // core.addApiFunctionByName("LoadFontData")
    // core.addApiFunctionByName("GenImageFontAtlas")
    // core.addApiFunctionByName("UnloadFontData")
    core.addApiFunctionByName("UnloadFont")
    // core.addApiFunctionByName("ExportFontAsCode")

    // Text drawing functions
    core.addApiFunctionByName("DrawFPS")
    core.addApiFunctionByName("DrawText")
    core.addApiFunctionByName("DrawTextEx")
    core.addApiFunctionByName("DrawTextPro")
    core.addApiFunctionByName("DrawTextCodepoint")
    //core.addApiFunctionByName("DrawTextCodepoints")
    
    // Text font info functions
    core.addApiFunctionByName("MeasureText")
    core.addApiFunctionByName("MeasureTextEx")
    core.addApiFunctionByName("GetGlyphIndex")
    // core.addApiFunctionByName("GetGlyphInfo")
    core.addApiFunctionByName("GetGlyphAtlasRec")
    
    // Text codepoints management functions (unicode characters)
    // Is this needed?
    // core.addApiFunctionByName("LoadUTF8")
    // core.addApiFunctionByName("UnloadUTF8")
    // core.addApiFunctionByName("LoadCodepoints")
    // core.addApiFunctionByName("UnloadCodepoints")
    // core.addApiFunctionByName("GetCodepointCount")
    // core.addApiFunctionByName("GetCodepoint")
    // core.addApiFunctionByName("GetCodepointNext")
    // core.addApiFunctionByName("GetCodepointPrevious")
    // core.addApiFunctionByName("CodepointToUTF8")

    // Text strings management functions (no UTF-8 strings, only byte chars)
    // Not supported, use JS Stdlib instead

    // module: rmodels

    // Basic geometric 3D shapes drawing functions
    core.addApiFunctionByName("DrawLine3D")
    core.addApiFunctionByName("DrawPoint3D")
    core.addApiFunctionByName("DrawCircle3D")
    core.addApiFunctionByName("DrawTriangle3D")
    //core.addApiFunctionByName("DrawTriangleStrip3D")
    core.addApiFunctionByName("DrawCube")
    core.addApiFunctionByName("DrawCubeV")
    core.addApiFunctionByName("DrawCubeWires")
    core.addApiFunctionByName("DrawCubeWiresV")
    core.addApiFunctionByName("DrawSphere")
    core.addApiFunctionByName("DrawSphereEx")
    core.addApiFunctionByName("DrawSphereWires")
    core.addApiFunctionByName("DrawCylinder")
    core.addApiFunctionByName("DrawCylinderEx")
    core.addApiFunctionByName("DrawCylinderWires")
    core.addApiFunctionByName("DrawCylinderWiresEx")
    core.addApiFunctionByName("DrawCapsule")
    core.addApiFunctionByName("DrawCapsuleWires")
    core.addApiFunctionByName("DrawPlane")
    core.addApiFunctionByName("DrawRay")
    core.addApiFunctionByName("DrawGrid")
    
    // model management functions
    core.addApiFunctionByName("LoadModel")
    core.addApiFunctionByName("LoadModelFromMesh")
    core.addApiFunctionByName("IsModelReady")
    core.addApiFunctionByName("UnloadModel")
    core.addApiFunctionByName("GetModelBoundingBox")

    // model drawing functions
    core.addApiFunctionByName("DrawModel")
    core.addApiFunctionByName("DrawModelEx")
    core.addApiFunctionByName("DrawModelWires")
    core.addApiFunctionByName("DrawModelWiresEx")
    core.addApiFunctionByName("DrawBoundingBox")
    core.addApiFunctionByName("DrawBillboard")
    core.addApiFunctionByName("DrawBillboardRec")
    core.addApiFunctionByName("DrawBillboardPro")

    // Mesh management functions
    core.addApiFunctionByName("UploadMesh")
    core.addApiFunctionByName("UpdateMeshBuffer")
    core.addApiFunctionByName("UnloadMesh")
    core.addApiFunctionByName("DrawMesh")
    core.addApiFunctionByName("DrawMeshInstanced")
    core.addApiFunctionByName("ExportMesh")
    core.addApiFunctionByName("GetMeshBoundingBox")
    core.addApiFunctionByName("GenMeshTangents")

    // Mesh generation functions
    core.addApiFunctionByName("GenMeshPoly")
    core.addApiFunctionByName("GenMeshPlane")
    core.addApiFunctionByName("GenMeshCube")
    core.addApiFunctionByName("GenMeshSphere")
    core.addApiFunctionByName("GenMeshHemiSphere")
    core.addApiFunctionByName("GenMeshCylinder")
    core.addApiFunctionByName("GenMeshCone")
    core.addApiFunctionByName("GenMeshTorus")
    core.addApiFunctionByName("GenMeshKnot")
    core.addApiFunctionByName("GenMeshHeightmap")
    core.addApiFunctionByName("GenMeshCubicmap")

    // Material loading/unloading functions
    // core.addApiFunctionByName("LoadMaterials")
    core.addApiFunctionByName("LoadMaterialDefault")
    core.addApiFunctionByName("IsMaterialReady")
    core.addApiFunctionByName("UnloadMaterial")
    core.addApiFunctionByName("SetMaterialTexture")
    core.addApiFunctionByName("SetModelMaterial")
    core.addApiFunctionByName("SetModelMeshMaterial")

    // Model animations loading/unloading functions
    // core.addApiFunctionByName("LoadModelAnimations")
    // core.addApiFunctionByName("UpdateModelAnimation")
    // core.addApiFunctionByName("UnloadModelAnimation")
    // core.addApiFunctionByName("UnloadModelAnimations")
    // core.addApiFunctionByName("IsModelAnimationValid")

    // Collision detection functions
    core.addApiFunctionByName("CheckCollisionSpheres")
    core.addApiFunctionByName("CheckCollisionBoxes")
    core.addApiFunctionByName("CheckCollisionBoxSphere")
    core.addApiFunctionByName("GetRayCollisionSphere")
    core.addApiFunctionByName("GetRayCollisionBox")
    core.addApiFunctionByName("GetRayCollisionMesh")
    core.addApiFunctionByName("GetRayCollisionTriangle")
    core.addApiFunctionByName("GetRayCollisionQuad")

    // module: raudio

    // Audio device management functions
    core.addApiFunctionByName("InitAudioDevice")
    core.addApiFunctionByName("CloseAudioDevice")
    core.addApiFunctionByName("IsAudioDeviceReady")
    core.addApiFunctionByName("SetMasterVolume")

    // Wave/Sound loading/unloading functions
    core.addApiFunctionByName("LoadWave")
    core.addApiFunctionByName("LoadWaveFromMemory")
    core.addApiFunctionByName("IsWaveReady")
    core.addApiFunctionByName("LoadSound")
    core.addApiFunctionByName("LoadSoundFromWave")
    core.addApiFunctionByName("IsSoundReady")
    core.addApiFunctionByName("UpdateSound")
    core.addApiFunctionByName("UnloadWave")
    core.addApiFunctionByName("UnloadSound")
    core.addApiFunctionByName("ExportWave")
    // core.addApiFunctionByName("ExportWaveAsCode")

    // Wave/Sound management functions
    core.addApiFunctionByName("PlaySound")
    core.addApiFunctionByName("StopSound")
    core.addApiFunctionByName("PauseSound")
    core.addApiFunctionByName("ResumeSound")
    core.addApiFunctionByName("IsSoundPlaying")
    core.addApiFunctionByName("SetSoundVolume")
    core.addApiFunctionByName("SetSoundPitch")
    core.addApiFunctionByName("SetSoundPan")
    core.addApiFunctionByName("WaveCopy")
    core.addApiFunctionByName("WaveCrop")
    core.addApiFunctionByName("WaveFormat")
    // core.addApiFunctionByName("LoadWaveSamples")
    // core.addApiFunctionByName("UnloadWaveSamples")

    // Music management functions
    core.addApiFunctionByName("LoadMusicStream")
    // core.addApiFunctionByName("LoadMusicStreamFromMemory")
    core.addApiFunctionByName("IsMusicReady")
    core.addApiFunctionByName("UnloadMusicStream")
    core.addApiFunctionByName("PlayMusicStream")
    core.addApiFunctionByName("IsMusicStreamPlaying")
    core.addApiFunctionByName("UpdateMusicStream")
    core.addApiFunctionByName("StopMusicStream")
    core.addApiFunctionByName("PauseMusicStream")
    core.addApiFunctionByName("ResumeMusicStream")
    core.addApiFunctionByName("SeekMusicStream")
    core.addApiFunctionByName("SetMusicVolume")
    core.addApiFunctionByName("SetMusicPitch")
    core.addApiFunctionByName("SetMusicPan")
    core.addApiFunctionByName("GetMusicTimeLength")
    core.addApiFunctionByName("GetMusicTimePlayed")

    // AudioStream management functions
    // core.addApiFunctionByName("LoadAudioStream")
    // core.addApiFunctionByName("IsAudioStreamReady")
    // core.addApiFunctionByName("UnloadAudioStream")
    // core.addApiFunctionByName("UpdateAudioStream")
    // core.addApiFunctionByName("IsAudioStreamProcessed")
    // core.addApiFunctionByName("PlayAudioStream")
    // core.addApiFunctionByName("PauseAudioStream")
    // core.addApiFunctionByName("ResumeAudioStream")
    // core.addApiFunctionByName("IsAudioStreamPlaying")
    // core.addApiFunctionByName("StopAudioStream")
    // core.addApiFunctionByName("SetAudioStreamVolume")
    // core.addApiFunctionByName("SetAudioStreamPitch")
    // core.addApiFunctionByName("SetAudioStreamPan")
    // core.addApiFunctionByName("SetAudioStreamBufferSizeDefault")
    // core.addApiFunctionByName("SetAudioStreamCallback")

    // core.addApiFunctionByName("AttachAudioStreamProcessor")
    // core.addApiFunctionByName("DetachAudioStreamProcessor")

    // core.addApiFunctionByName("AttachAudioMixedProcessor")
    // core.addApiFunctionByName("DetachAudioMixedProcessor")

    // module: raymath

    core.addApiFunctionByName("Clamp")
    core.addApiFunctionByName("Lerp")
    core.addApiFunctionByName("Normalize")
    core.addApiFunctionByName("Remap")
    core.addApiFunctionByName("Wrap")
    core.addApiFunctionByName("FloatEquals")
    core.addApiFunctionByName("Vector2Zero")
    core.addApiFunctionByName("Vector2One")
    core.addApiFunctionByName("Vector2Add")
    core.addApiFunctionByName("Vector2AddValue")
    core.addApiFunctionByName("Vector2Subtract")
    core.addApiFunctionByName("Vector2SubtractValue")
    core.addApiFunctionByName("Vector2Length")
    core.addApiFunctionByName("Vector2LengthSqr")
    core.addApiFunctionByName("Vector2DotProduct")
    core.addApiFunctionByName("Vector2Distance")
    core.addApiFunctionByName("Vector2DistanceSqr")
    core.addApiFunctionByName("Vector2Angle")
    core.addApiFunctionByName("Vector2LineAngle")
    core.addApiFunctionByName("Vector2Scale")
    core.addApiFunctionByName("Vector2Multiply")
    core.addApiFunctionByName("Vector2Negate")
    core.addApiFunctionByName("Vector2Divide")
    core.addApiFunctionByName("Vector2Normalize")
    core.addApiFunctionByName("Vector2Transform")
    core.addApiFunctionByName("Vector2Lerp")
    core.addApiFunctionByName("Vector2Reflect")
    core.addApiFunctionByName("Vector2Rotate")
    core.addApiFunctionByName("Vector2MoveTowards")
    core.addApiFunctionByName("Vector2Invert")
    core.addApiFunctionByName("Vector2Clamp")
    core.addApiFunctionByName("Vector2ClampValue")
    core.addApiFunctionByName("Vector2Equals")
    core.addApiFunctionByName("Vector3Zero")
    core.addApiFunctionByName("Vector3One")
    core.addApiFunctionByName("Vector3Add")
    core.addApiFunctionByName("Vector3AddValue")
    core.addApiFunctionByName("Vector3Subtract")
    core.addApiFunctionByName("Vector3SubtractValue")
    core.addApiFunctionByName("Vector3Scale")
    core.addApiFunctionByName("Vector3Multiply")
    core.addApiFunctionByName("Vector3CrossProduct")
    core.addApiFunctionByName("Vector3Perpendicular")
    core.addApiFunctionByName("Vector3Length")
    core.addApiFunctionByName("Vector3LengthSqr")
    core.addApiFunctionByName("Vector3DotProduct")
    core.addApiFunctionByName("Vector3Distance")
    core.addApiFunctionByName("Vector3DistanceSqr")
    core.addApiFunctionByName("Vector3Angle")
    core.addApiFunctionByName("Vector3Negate")
    core.addApiFunctionByName("Vector3Divide")
    core.addApiFunctionByName("Vector3Normalize")
    //core.addApiFunctionByName("Vector3OrthoNormalize")
    core.addApiFunctionByName("Vector3Transform")
    core.addApiFunctionByName("Vector3RotateByQuaternion")
    core.addApiFunctionByName("Vector3RotateByAxisAngle")
    core.addApiFunctionByName("Vector3Lerp")
    core.addApiFunctionByName("Vector3Reflect")
    core.addApiFunctionByName("Vector3Min")
    core.addApiFunctionByName("Vector3Max")
    core.addApiFunctionByName("Vector3Barycenter")
    core.addApiFunctionByName("Vector3Unproject")
    //core.addApiFunctionByName("Vector3ToFloatV")
    core.addApiFunctionByName("Vector3Invert")
    core.addApiFunctionByName("Vector3Clamp")
    core.addApiFunctionByName("Vector3ClampValue")
    core.addApiFunctionByName("Vector3Equals")
    core.addApiFunctionByName("Vector3Refract")
    core.addApiFunctionByName("MatrixDeterminant")
    core.addApiFunctionByName("MatrixTrace")
    core.addApiFunctionByName("MatrixTranspose")
    core.addApiFunctionByName("MatrixInvert")
    core.addApiFunctionByName("MatrixIdentity")
    core.addApiFunctionByName("MatrixAdd")
    core.addApiFunctionByName("MatrixSubtract")
    core.addApiFunctionByName("MatrixMultiply")
    core.addApiFunctionByName("MatrixTranslate")
    core.addApiFunctionByName("MatrixRotate")
    core.addApiFunctionByName("MatrixRotateX")
    core.addApiFunctionByName("MatrixRotateY")
    core.addApiFunctionByName("MatrixRotateZ")
    core.addApiFunctionByName("MatrixRotateXYZ")
    core.addApiFunctionByName("MatrixRotateZYX")
    core.addApiFunctionByName("MatrixScale")
    core.addApiFunctionByName("MatrixFrustum")
    core.addApiFunctionByName("MatrixPerspective")
    core.addApiFunctionByName("MatrixOrtho")
    core.addApiFunctionByName("MatrixLookAt")
    //core.addApiFunctionByName("MatrixToFloatV")
    core.addApiFunctionByName("QuaternionAdd")
    core.addApiFunctionByName("QuaternionAddValue")
    core.addApiFunctionByName("QuaternionSubtract")
    core.addApiFunctionByName("QuaternionSubtractValue")
    core.addApiFunctionByName("QuaternionIdentity")
    core.addApiFunctionByName("QuaternionLength")
    core.addApiFunctionByName("QuaternionNormalize")
    core.addApiFunctionByName("QuaternionInvert")
    core.addApiFunctionByName("QuaternionMultiply")
    core.addApiFunctionByName("QuaternionScale")
    core.addApiFunctionByName("QuaternionDivide")
    core.addApiFunctionByName("QuaternionLerp")
    core.addApiFunctionByName("QuaternionNlerp")
    core.addApiFunctionByName("QuaternionSlerp")
    core.addApiFunctionByName("QuaternionFromVector3ToVector3")
    core.addApiFunctionByName("QuaternionFromMatrix")
    core.addApiFunctionByName("QuaternionToMatrix")
    core.addApiFunctionByName("QuaternionFromAxisAngle")
    //core.addApiFunctionByName("QuaternionToAxisAngle")
    core.addApiFunctionByName("QuaternionFromEuler")
    core.addApiFunctionByName("QuaternionToEuler")
    core.addApiFunctionByName("QuaternionTransform")
    core.addApiFunctionByName("QuaternionEquals")

    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, description: x.description, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core.exportGlobalStruct("Color", x.name, x.values, x.description)
    })
    api.enums.find(x => x.name === "KeyboardKey")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "MouseButton")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "ConfigFlags")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "BlendMode")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "TraceLogLevel")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "MouseCursor")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "PixelFormat")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "CameraProjection")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "CameraMode")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "ShaderLocationIndex")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "ShaderUniformDataType")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    api.enums.find(x => x.name === "MaterialMapIndex")?.values.forEach(x => core.exportGlobalConstant(x.name, x.description))
    core.exportGlobalConstant("MATERIAL_MAP_DIFFUSE", "Albedo material (same as: MATERIAL_MAP_DIFFUSE")
    core.exportGlobalConstant("MATERIAL_MAP_SPECULAR", "Metalness material (same as: MATERIAL_MAP_SPECULAR)")
    core.writeTo("src/bindings/js_raylib_core.h")
    core.typings.writeTo("examples/lib.raylib.d.ts")
}

main()
