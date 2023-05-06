import { readFileSync, writeFileSync } from "fs";
import { Bindings, RayLibApi } from "./interfaces";
import { CodeWriter, HeaderGenerator } from "./generation";
import { ApiDescription } from "./api";
import { RayLibHeaderGenerator } from "./header";

const bindings = <Bindings>JSON.parse(readFileSync("bindings.json", 'utf8'))

function writeHeader(header: HeaderGenerator, filename: string){
    const writer = new CodeWriter()
    writer.writeGenerator(header)
    writeFileSync(filename, writer.toString())
}

function main(){
    const api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))
    const apiDesc = new ApiDescription(api)

    const core_gen = new RayLibHeaderGenerator("raylib_core", apiDesc)
    core_gen.addApiFunctionByName("SetWindowTitle")
    core_gen.addApiFunctionByName("SetWindowPosition")
    core_gen.addApiFunctionByName("BeginDrawing")
    core_gen.addApiFunctionByName("EndDrawing")
    writeHeader(core_gen, "src/bindings/js_raylib_core.h")

    const texture_gen = new RayLibHeaderGenerator("raylib_texture", apiDesc)
    texture_gen.addApiStructByName("Image", "UnloadImage")
    writeHeader(texture_gen, "src/bindings/js_raylib_texture.h")
}

main()
