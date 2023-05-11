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
    core_gen.addApiFunctionByName("SetWindowTitle")
    core_gen.addApiFunctionByName("SetWindowPosition")
    core_gen.addApiFunctionByName("BeginDrawing")
    core_gen.addApiFunctionByName("EndDrawing", null, { before: fun => fun.call("app_update_quickjs", []) })
    core_gen.addApiFunctionByName("InitWindow")
    core_gen.addApiFunctionByName("SetTargetFPS")
    core_gen.addApiFunctionByName("WindowShouldClose")
    core_gen.addApiFunctionByName("ClearBackground")
    core_gen.addApiFunctionByName("CloseWindow")
    core_gen.addApiFunctionByName("DrawText")
    core_gen.addApiFunctionByName("DrawCircleV")
    core_gen.addApiFunctionByName("IsKeyDown")
    core_gen.addApiFunctionByName("GetMousePosition")
    core_gen.addApiFunctionByName("IsMouseButtonPressed")
    core_gen.addApiFunctionByName("GetMouseWheelMove")
    core_gen.addApiFunctionByName("DrawRectangle")
    core_gen.addApiFunctionByName("GetRandomValue")
    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core_gen.exportGlobalStruct("Color", x.name, x.values)
    })
    api.enums.find(x => x.name === "KeyboardKey")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
    api.enums.find(x => x.name === "MouseButton")?.values.forEach(x => core_gen.exportGlobalConstant(x.name))
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
