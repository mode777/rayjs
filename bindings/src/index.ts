import { readFileSync, writeFileSync } from "fs";
import { RayLibApi, RayLibFunction, RayLibType } from "./interfaces";
import { ApiDescription, ApiFunction } from "./api";
import { RayLibHeader } from "./raylib-header";

function parseMathHeader(): RayLibFunction[] {
    return readFileSync("thirdparty/raylib/src/raymath.h", 'utf8')
    .split("\n")
    .filter(x => x.startsWith("RMAPI"))
    .map(inputString => {
        const matches = inputString.match(/^RMAPI\s+([\w<>]+)\s+([\w<>]+)\((.*)\)$/);
        if(!matches) throw new Error("Unable to match " + inputString)
        const args = matches[3].split(',').filter(x => x !== 'void').map(arg => {
            arg = arg.trim().replace(" *", "* ")
            const frags = arg.split(' ')
            const name = frags.pop()
            const type = frags.join(' ').replace("*", " *")
            console.log({ name: name || "", type: type })
            return { name: name || "", type: type }
        })
        return {
            name: matches[2],
            returnType: matches[1],
            params: args,
            description: ""
        }
    });
}

function main(){
 
    const mathApi = parseMathHeader();
    writeFileSync("bindings/raylib_math_api.json", JSON.stringify(mathApi))
    
    const api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))
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
            //point: { get: true, set: false },
            //normal: { get: true, set: false },
        },
        createConstructor: false
    })
    core.addApiStructByName("Camera2D",{
        properties: {
            offset: { get: false, set: true },
            target: { get: false, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("Camera3D",{
        properties: {
            position: { get: false, set: true },
            target: { get: false, set: true },
            up: { get: false, set: true },
            fovy: { get: true, set: true },
            projection: { get: true, set: true },
        },
        createConstructor: true
    })
    core.addApiStructByName("BoundingBox",{
        properties: {},
        createConstructor: true
    })
    core.addApiStructByName("Matrix",{
        properties: {},
        createConstructor: false
    })
    core.addApiStructByName("Image", { 
        properties: { 
            width: { get: true }, 
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true }
        },
        destructor: "UnloadImage"
    })
    core.addApiStructByName("Wave", { 
        properties: { 
            frameCount: { get: true }, 
            sampleRate: { get: true },
            sampleSize: { get: true },
            channels: { get: true }
        },
        destructor: "UnloadWave"
    })
    core.addApiStructByName("Sound", { 
        properties: { 
            frameCount: { get: true }
        },
        destructor: "UnloadSound"
    })
    core.addApiStructByName("Music", { 
        properties: { 
            frameCount: { get: true },
            looping: { get: true, set: true }
        },
        destructor: "UnloadMusicStream"
    })
    core.addApiStructByName("Model", { 
        properties: {},
        destructor: "UnloadModel"
    })
    core.addApiStructByName("Mesh", { 
        properties: {},
        destructor: "UnloadMesh"
    })
    core.addApiStructByName("Shader", { 
        properties: {},
        destructor: "UnloadShader"
    })
    core.addApiStructByName("Texture", { 
        properties: { 
            width: { get: true }, 
            height: { get: true }
        },
        destructor: "UnloadTexture"
    })
    core.addApiStructByName("Font", { 
        properties: { 
            baseSize: { get: true }
        },
        destructor: "UnloadFont"
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
    // SetWindowIcon
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
    //core.addApiFunctionByName("BeginTextureMode")
    //core.addApiFunctionByName("EndTextureMode")
    //core.addApiFunctionByName("BeginShaderMode")
    //core.addApiFunctionByName("EndShaderMode")
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
    // core.addApiFunctionByName("LoadShader")
    // core.addApiFunctionByName("LoadShaderFromMemory")
    // core.addApiFunctionByName("IsShaderReady")
    // core.addApiFunctionByName("GetShaderLocation")
    // core.addApiFunctionByName("GetShaderLocationAttrib")
    // core.addApiFunctionByName("SetShaderValue")
    // core.addApiFunctionByName("SetShaderValueV")
    // core.addApiFunctionByName("SetShaderValueMatrix")
    // core.addApiFunctionByName("SetShaderValueTexture")
    // // "UnloadShader" is destructor

    // ScreenSpaceRelatedFunctions
    //core.addApiFunctionByName("GetMouseRay")
    //core.addApiFunctionByName("GetCameraMatrix")
    core.addApiFunctionByName("GetCameraMatrix2D")
    //core.addApiFunctionByName("GetWorldToScreen")
    core.addApiFunctionByName("GetScreenToWorld2D")
    //core.addApiFunctionByName("GetScreenToWorldEx")
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
    //core.addApiFunctionByName("LoadFileData")
    //core.addApiFunctionByName("UnloadLoadFileData")
    //core.addApiFunctionByName("SaveFileData")
    // Export data as code not needed
    core.addApiFunctionByName("LoadFileText", null, { after: gen => gen.call("UnloadFileText", ["returnVal"]) })
    core.addApiFunctionByName("SaveFileText")
    core.addApiFunctionByName("FileExists")
    core.addApiFunctionByName("DirectoryExists")
    core.addApiFunctionByName("IsFileExtension")
    // TODO: Who needs to clean memory here?
    core.addApiFunctionByName("GetFileLength")
    core.addApiFunctionByName("GetFileExtension")
    core.addApiFunctionByName("GetFileName")
    core.addApiFunctionByName("GetFileNameWithoutExt")
    core.addApiFunctionByName("GetDirectoryPath")
    core.addApiFunctionByName("GetPrevDirectoryPath")
    core.addApiFunctionByName("GetWorkingDirectory")
    core.addApiFunctionByName("GetApplicationDirectory")
    core.addApiFunctionByName("ChangeDirectory")
    core.addApiFunctionByName("IsPathFile")
    //core.addApiFunctionByName("LoadPathFiles")
    //core.addApiFunctionByName("LoadPathFilesEx")
    // UnloadDirectoryFiles
    core.addApiFunctionByName("IsFileDropped")
    //core.addApiFunctionByName("LoadDroppedFiles")
    // UnloadDroppedFiles
    core.addApiFunctionByName("GetFileModTime")
    
    // Compression/encodeing functionality
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
    // core.addApiFunctionByName("UpdateCamera")
    // core.addApiFunctionByName("UpdateCameraPro")

    //api.functions.forEach(x => console.log(`core.addApiFunctionByName("${x.name}")`))

    // module: rshapes
    // TODO: Do we need ref-counting here?
    //core.addApiFunctionByName("SetShapesTexture")

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
    // core.addApiFunctionByName("LoadImageFromMemory")
    core.addApiFunctionByName("LoadImageFromTexture")
    core.addApiFunctionByName("LoadImageFromScreen")
    core.addApiFunctionByName("IsImageReady")
    // UnloadImage called by destructor
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
    // core.addApiFunctionByName("ImageTextEx")
    // core.addApiFunctionByName("ImageFormat")
    // core.addApiFunctionByName("ImageToPOT")
    // core.addApiFunctionByName("ImageCrop")
    // core.addApiFunctionByName("ImageAlphaCrop")
    // core.addApiFunctionByName("ImageAlphaClear")
    // core.addApiFunctionByName("ImageAlphaMask")
    // core.addApiFunctionByName("ImageAlphaPremultiply")
    // core.addApiFunctionByName("ImageBlurGaussian")
    // core.addApiFunctionByName("ImageResize")
    // core.addApiFunctionByName("ImageResizeNN")
    // core.addApiFunctionByName("ImageResizeCanvas")
    // core.addApiFunctionByName("ImageMipmaps")
    // core.addApiFunctionByName("ImageDither")
    // core.addApiFunctionByName("ImageFlipVertical")
    // core.addApiFunctionByName("ImageFlipHorizontal")
    // core.addApiFunctionByName("ImageRotateCW")
    // core.addApiFunctionByName("ImageRotateCCW")
    // core.addApiFunctionByName("ImageColorTint")
    // core.addApiFunctionByName("ImageColorInvert")
    // core.addApiFunctionByName("ImageColorGrayscale")
    // core.addApiFunctionByName("ImageColorContrast")
    // core.addApiFunctionByName("ImageColorBrightness")
    // core.addApiFunctionByName("ImageColorReplace")
    // core.addApiFunctionByName("LoadImageColors")
    // core.addApiFunctionByName("LoadImagePalette")
    // core.addApiFunctionByName("UnloadImageColors")
    // core.addApiFunctionByName("UnloadImagePalette")
    core.addApiFunctionByName("GetImageAlphaBorder")
    core.addApiFunctionByName("GetImageColor")

    // Image drawing functions
    // core.addApiFunctionByName("ImageClearBackground")
    // core.addApiFunctionByName("ImageDrawPixel")
    // core.addApiFunctionByName("ImageDrawPixelV")
    // core.addApiFunctionByName("ImageDrawLine")
    // core.addApiFunctionByName("ImageDrawLineV")
    // core.addApiFunctionByName("ImageDrawCircle")
    // core.addApiFunctionByName("ImageDrawCircleV")
    // core.addApiFunctionByName("ImageDrawCircleLines")
    // core.addApiFunctionByName("ImageDrawCircleLinesV")
    // core.addApiFunctionByName("ImageDrawRectangle")
    // core.addApiFunctionByName("ImageDrawRectangleV")
    // core.addApiFunctionByName("ImageDrawRectangleRec")
    // core.addApiFunctionByName("ImageDrawRectangleLines")
    // core.addApiFunctionByName("ImageDraw")
    // core.addApiFunctionByName("ImageDrawText")
    // core.addApiFunctionByName("ImageDrawTextEx")

    // Texture loading functions
    core.addApiFunctionByName("LoadTexture")
    core.addApiFunctionByName("LoadTextureFromImage")
    core.addApiFunctionByName("LoadTextureCubemap")
    // core.addApiFunctionByName("LoadRenderTexture")
    core.addApiFunctionByName("IsTextureReady")
    // "UnloadTexture" called by finalizer
    // core.addApiFunctionByName("IsRenderTextureReady")
    // core.addApiFunctionByName("UnloadRenderTexture")
    // core.addApiFunctionByName("UpdateTexture")
    // core.addApiFunctionByName("UpdateTextureRec")
    
    // Texture configuration functions
    // core.addApiFunctionByName("GenTextureMipmaps")
    core.addApiFunctionByName("SetTextureFilter")
    core.addApiFunctionByName("SetTextureWrap")

    // Texture drawing functions
    core.addApiFunctionByName("DrawTexture")
    core.addApiFunctionByName("DrawTextureV")
    core.addApiFunctionByName("DrawTextureEx")
    core.addApiFunctionByName("DrawTextureRec")
    core.addApiFunctionByName("DrawTexturePro")
    // core.addApiFunctionByName("DrawTextureNPatch")
    
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
    // "UnloadFont" called by finalizer
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
    // Probably not needed
    // core.addApiFunctionByName("TextCopy")
    // core.addApiFunctionByName("TextIsEqual")
    // core.addApiFunctionByName("TextLength")
    // core.addApiFunctionByName("TextFormat")
    // core.addApiFunctionByName("TextSubtext")
    // core.addApiFunctionByName("TextReplace")
    // core.addApiFunctionByName("TextInsert")
    // core.addApiFunctionByName("TextJoin")
    // core.addApiFunctionByName("TextSplit")
    // core.addApiFunctionByName("TextAppend")
    // core.addApiFunctionByName("TextFindIndex")
    // core.addApiFunctionByName("TextToUpper")
    // core.addApiFunctionByName("TextToLower")
    // core.addApiFunctionByName("TextToPascal")
    // core.addApiFunctionByName("TextToInteger")

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
    // "UnloadModel" called by finalizer
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
    // core.addApiFunctionByName("UploadMesh")
    // core.addApiFunctionByName("UpdateMeshBuffer")
    // "UnloadMesh" called by finalizer
    //core.addApiFunctionByName("DrawMesh")
    // core.addApiFunctionByName("DrawMeshInstanced")
    core.addApiFunctionByName("ExportMesh")
    core.addApiFunctionByName("GetMeshBoundingBox")
    // core.addApiFunctionByName("GenMeshTangents")

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
    // core.addApiFunctionByName("LoadMaterialDefault")
    // core.addApiFunctionByName("IsMaterialReady")
    // core.addApiFunctionByName("UnloadMaterial")
    // core.addApiFunctionByName("SetMaterialTexture")
    // core.addApiFunctionByName("SetModelMeshMaterial")

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
    // core.addApiFunctionByName("LoadWaveFromMemory")
    core.addApiFunctionByName("IsWaveReady")
    core.addApiFunctionByName("LoadSound")
    core.addApiFunctionByName("LoadSoundFromWave")
    core.addApiFunctionByName("IsSoundReady")
    // core.addApiFunctionByName("UpdateSound")
    // "UnloadWave" called by finalizer
    // "UnloadSound" called by finalizer
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
    // core.addApiFunctionByName("WaveCrop")
    // core.addApiFunctionByName("WaveFormat")
    // core.addApiFunctionByName("LoadWaveSamples")
    // core.addApiFunctionByName("UnloadWaveSamples")

    // Music management functions
    core.addApiFunctionByName("LoadMusicStream")
    // core.addApiFunctionByName("LoadMusicStreamFromMemory")
    core.addApiFunctionByName("IsMusicReady")
    // "UnloadMusicStream" called by finalizer
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

    //mathApi.forEach(x => console.log(`core.addApi`))

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
    core.writeTo("src/bindings/js_raylib_core.h")
    core.typings.writeTo("examples/lib.raylib.d.ts")
}

main()
