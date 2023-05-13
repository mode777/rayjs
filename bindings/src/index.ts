import { readFileSync, writeFileSync } from "fs";
import { RayLibApi } from "./interfaces";
import { ApiDescription } from "./api";
import { RayLibHeader } from "./raylib-header";

function main(){
    const api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))
    const apiDesc = new ApiDescription(api)

    const core_gen = new RayLibHeader("raylib_core", apiDesc)
    core_gen.addApiStructByName("Color", {
        properties: {
            r: { get: true, set: true },
            g: { get: true, set: true },
            b: { get: true, set: true },
            a: { get: true, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Rectangle", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            width: { get: true, set: true },
            height: { get: true, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Vector2", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Vector3", {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Ray", {
        properties: {
            position: { get: false, set: true },
            direction: { get: false, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Camera2D",{
        properties: {
            offset: { get: false, set: true },
            target: { get: false, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    })
    core_gen.addApiStructByName("Matrix",{
        properties: {},
        createConstructor: false
    })
    // Window-related functions
    core_gen.addApiFunctionByName("InitWindow")
    core_gen.addApiFunctionByName("WindowShouldClose")
    core_gen.addApiFunctionByName("CloseWindow")
    core_gen.addApiFunctionByName("IsWindowReady")
    core_gen.addApiFunctionByName("IsWindowFullscreen")
    core_gen.addApiFunctionByName("IsWindowHidden")
    core_gen.addApiFunctionByName("IsWindowMinimized")
    core_gen.addApiFunctionByName("IsWindowMaximized")
    core_gen.addApiFunctionByName("IsWindowFocused")
    core_gen.addApiFunctionByName("IsWindowResized")
    core_gen.addApiFunctionByName("IsWindowState")
    core_gen.addApiFunctionByName("SetWindowState")
    core_gen.addApiFunctionByName("ClearWindowState")
    core_gen.addApiFunctionByName("ToggleFullscreen")
    core_gen.addApiFunctionByName("MaximizeWindow")
    core_gen.addApiFunctionByName("MinimizeWindow")
    core_gen.addApiFunctionByName("RestoreWindow")
    // SetWindowIcon
    // SetWindowIcons
    core_gen.addApiFunctionByName("SetWindowTitle")
    core_gen.addApiFunctionByName("SetWindowPosition")
    core_gen.addApiFunctionByName("SetWindowMonitor")
    core_gen.addApiFunctionByName("SetWindowMinSize")
    core_gen.addApiFunctionByName("SetWindowSize")
    core_gen.addApiFunctionByName("SetWindowOpacity")
    // GetWindowHandle
    core_gen.addApiFunctionByName("GetScreenWidth")
    core_gen.addApiFunctionByName("GetScreenHeight")
    core_gen.addApiFunctionByName("GetRenderWidth")
    core_gen.addApiFunctionByName("GetRenderHeight")
    core_gen.addApiFunctionByName("GetMonitorCount")
    core_gen.addApiFunctionByName("GetCurrentMonitor")
    core_gen.addApiFunctionByName("GetMonitorPosition")
    core_gen.addApiFunctionByName("GetMonitorWidth")
    core_gen.addApiFunctionByName("GetMonitorHeight")
    core_gen.addApiFunctionByName("GetMonitorPhysicalWidth")
    core_gen.addApiFunctionByName("GetMonitorPhysicalHeight")
    core_gen.addApiFunctionByName("GetMonitorRefreshRate")
    core_gen.addApiFunctionByName("GetWindowPosition")
    core_gen.addApiFunctionByName("GetWindowScaleDPI")
    core_gen.addApiFunctionByName("GetMonitorName")
    core_gen.addApiFunctionByName("SetClipboardText")
    core_gen.addApiFunctionByName("GetClipboardText")
    core_gen.addApiFunctionByName("EnableEventWaiting")
    core_gen.addApiFunctionByName("DisableEventWaiting")

    // Custom frame control functions
    // NOT SUPPORTED BECAUSE NEEDS COMPILER FLAG

    // Cursor-related functions
    core_gen.addApiFunctionByName("ShowCursor")
    core_gen.addApiFunctionByName("HideCursor")
    core_gen.addApiFunctionByName("IsCursorHidden")
    core_gen.addApiFunctionByName("EnableCursor")
    core_gen.addApiFunctionByName("DisableCursor")
    core_gen.addApiFunctionByName("IsCursorOnScreen")

    // Drawing related functions
    core_gen.addApiFunctionByName("ClearBackground")
    core_gen.addApiFunctionByName("BeginDrawing")
    core_gen.addApiFunctionByName("EndDrawing", null, { before: fun => fun.call("app_update_quickjs", []) })
    core_gen.addApiFunctionByName("BeginMode2D")
    core_gen.addApiFunctionByName("EndMode2D")
    //core_gen.addApiFunctionByName("BeginMode3D")
    //core_gen.addApiFunctionByName("EndMode3D")
    //core_gen.addApiFunctionByName("BeginTextureMode")
    //core_gen.addApiFunctionByName("EndTextureMode")
    //core_gen.addApiFunctionByName("BeginShaderMode")
    //core_gen.addApiFunctionByName("EndShaderMode")
    core_gen.addApiFunctionByName("BeginBlendMode")
    core_gen.addApiFunctionByName("EndBlendMode")
    core_gen.addApiFunctionByName("BeginScissorMode")
    core_gen.addApiFunctionByName("EndScissorMode")
    //core_gen.addApiFunctionByName("BeginVrStereoMode")
    //core_gen.addApiFunctionByName("EndVrStereoMode")
    
    // VR Stereo config options
    //core_gen.addApiFunctionByName("LoadVrStereoConfig")
    //core_gen.addApiFunctionByName("UnloadVrStereoConfig")

    // Shader Management
    // core_gen.addApiFunctionByName("LoadShader")
    // core_gen.addApiFunctionByName("LoadShaderFromMemory")
    // core_gen.addApiFunctionByName("IsShaderReady")
    // core_gen.addApiFunctionByName("GetShaderLocation")
    // core_gen.addApiFunctionByName("GetShaderLocationAttrib")
    // core_gen.addApiFunctionByName("SetShaderValue")
    // core_gen.addApiFunctionByName("SetShaderValueV")
    // core_gen.addApiFunctionByName("SetShaderValueMatrix")
    // core_gen.addApiFunctionByName("SetShaderValueTexture")
    // // "UnloadShader" is destructor

    // ScreenSpaceRelatedFunctions
    //core_gen.addApiFunctionByName("GetMouseRay")
    //core_gen.addApiFunctionByName("GetCameraMatrix")
    core_gen.addApiFunctionByName("GetCameraMatrix2D")
    //core_gen.addApiFunctionByName("GetWorldToScreen")
    core_gen.addApiFunctionByName("GetScreenToWorld2D")
    //core_gen.addApiFunctionByName("GetScreenToWorldEx")
    core_gen.addApiFunctionByName("GetWorldToScreen2D")

    // Timing related functions
    core_gen.addApiFunctionByName("SetTargetFPS")
    core_gen.addApiFunctionByName("GetFPS")
    core_gen.addApiFunctionByName("GetFrameTime")
    core_gen.addApiFunctionByName("GetTime")

    // Misc functions
    core_gen.addApiFunctionByName("GetRandomValue")
    core_gen.addApiFunctionByName("SetRandomSeed")
    core_gen.addApiFunctionByName("TakeScreenshot")
    core_gen.addApiFunctionByName("SetConfigFlags")

    const traceLog = apiDesc.getFunction("TraceLog")
    if(!traceLog) throw new Error("TraceLog not found")
    traceLog.params.pop()
    core_gen.addApiFunction(traceLog)
    core_gen.addApiFunctionByName("SetTraceLogLevel")
    // Memory functions not supported on JS
    core_gen.addApiFunctionByName("OpenURL")

    // Callbacks not supported on JS

    // Files management functions
    //core_gen.addApiFunctionByName("LoadFileData")
    //core_gen.addApiFunctionByName("UnloadLoadFileData")
    //core_gen.addApiFunctionByName("SaveFileData")
    // Export data as code not needed
    core_gen.addApiFunctionByName("LoadFileText", null, { after: gen => gen.call("UnloadFileText", ["returnVal"]) })
    core_gen.addApiFunctionByName("SaveFileText")
    core_gen.addApiFunctionByName("FileExists")
    core_gen.addApiFunctionByName("DirectoryExists")
    core_gen.addApiFunctionByName("IsFileExtension")
    // TODO: Who needs to clean memory here?
    core_gen.addApiFunctionByName("GetFileLength")
    core_gen.addApiFunctionByName("GetFileExtension")
    core_gen.addApiFunctionByName("GetFileName")
    core_gen.addApiFunctionByName("GetFileNameWithoutExt")
    core_gen.addApiFunctionByName("GetDirectoryPath")
    core_gen.addApiFunctionByName("GetPrevDirectoryPath")
    core_gen.addApiFunctionByName("GetWorkingDirectory")
    core_gen.addApiFunctionByName("GetApplicationDirectory")
    core_gen.addApiFunctionByName("ChangeDirectory")
    core_gen.addApiFunctionByName("IsPathFile")
    //core_gen.addApiFunctionByName("LoadPathFiles")
    //core_gen.addApiFunctionByName("LoadPathFilesEx")
    // UnloadDirectoryFiles
    core_gen.addApiFunctionByName("IsFileDropped")
    //core_gen.addApiFunctionByName("LoadDroppedFiles")
    // UnloadDroppedFiles
    core_gen.addApiFunctionByName("GetFileModTime")
    
    core_gen.addApiFunctionByName("DrawText")
    core_gen.addApiFunctionByName("DrawLine")
    core_gen.addApiFunctionByName("DrawCircleV")
    core_gen.addApiFunctionByName("IsKeyDown")
    core_gen.addApiFunctionByName("IsKeyPressed")
    core_gen.addApiFunctionByName("GetMousePosition")
    core_gen.addApiFunctionByName("IsMouseButtonPressed")
    core_gen.addApiFunctionByName("GetMouseWheelMove")
    core_gen.addApiFunctionByName("DrawRectangle")
    core_gen.addApiFunctionByName("DrawRectangleRec")
    core_gen.addApiFunctionByName("DrawRectangleLines")
    core_gen.addApiFunctionByName("Fade")
    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core_gen.exportGlobalStruct("Color", x.name, x.values)
    })
    api.enums.find(x => x.name === "KeyboardKey")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    api.enums.find(x => x.name === "MouseButton")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    api.enums.find(x => x.name === "ConfigFlags")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    api.enums.find(x => x.name === "BlendMode")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    api.enums.find(x => x.name === "TraceLogLevel")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    core_gen.writeTo("src/bindings/js_raylib_core.h")

    const texture_gen = new RayLibHeader("raylib_texture", apiDesc)
    texture_gen.addApiStructByName("Image", { 
        properties: { 
            width: { get: true }, 
            height: { get: true }
        },
        destructor: "UnloadImage"
    })
    texture_gen.addApiFunctionByName("LoadImage")
    texture_gen.writeTo("src/bindings/js_raylib_texture.h")
}

main()
