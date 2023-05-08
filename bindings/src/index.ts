import { readFileSync, writeFileSync } from "fs";
import { Bindings, RayLibApi } from "./interfaces";
import { ApiDescription } from "./api";
import { RayLibHeader } from "./raylib-header";

function main(){
    const api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))
    const apiDesc = new ApiDescription(api)

    const core_gen = new RayLibHeader("raylib_core", apiDesc)
    core_gen.addApiFunctionByName("SetWindowTitle")
    core_gen.addApiFunctionByName("SetWindowPosition")
    core_gen.addApiFunctionByName("BeginDrawing")
    core_gen.addApiFunctionByName("EndDrawing")
    core_gen.writeTo("src/bindings/js_raylib_core.h")

    const texture_gen = new RayLibHeader("raylib_texture", apiDesc)
    texture_gen.addApiStructByName("Image", "UnloadImage")
    texture_gen.writeTo("src/bindings/js_raylib_texture.h")
}

main()
