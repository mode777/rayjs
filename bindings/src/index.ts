import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { RayLibApi, RayLibFunction, RayLibStruct } from "./interfaces";
import { RayLibHeader } from "./raylib-header";
import { HeaderParser } from "./header-parser";
import { RayLibAlias } from "./interfaces";
import { QuickJsGenerator } from "./quickjs";

let api: RayLibApi

function getFunction(funList: RayLibFunction[], name: string){
    return funList.find(x => x.name === name) 
}

function getStruct(strList: RayLibStruct[], name: string){
    return strList.find(x => x.name === name) 
}

function getAliases(aliasList: RayLibAlias[], name: string) {
    return aliasList.filter(x => x.type === name).map(x => x.name)
}

function ignore(name: string){
    getFunction(api.functions, name)!.binding = { ignore: true }
}

function main() {
    const baseDir = path.join(__dirname, "../../");
    process.chdir(baseDir);

    // Load the pre-generated raylib api
    api = <RayLibApi>JSON.parse(readFileSync("thirdparty/raylib/parser/output/raylib_api.json", 'utf8'))

    const parser = new HeaderParser()
    
    const rmathHeader = readFileSync("thirdparty/raylib/src/raymath.h","utf8");
    const mathApi = parser.parseFunctions(rmathHeader)
    mathApi.forEach(x => api.functions.push(x))
    
    const rcameraHeader = readFileSync("thirdparty/raylib/src/rcamera.h","utf8");
    const cameraApi = parser.parseFunctionDefinitions(rcameraHeader);
    cameraApi.forEach(x => api.functions.push(x))
    
    const rguiHeader = readFileSync("thirdparty/raygui/src/raygui.h","utf8");
    const rguiFunctions = parser.parseFunctionDefinitions(rguiHeader);
    const rguiEnums = parser.parseEnums(rguiHeader);
    //rguiApi.forEach(x => console.log(`core.addApiFunctionByName("${x.name}")`))
    rguiFunctions.forEach(x => api.functions.push(x))
    rguiEnums.forEach(x => api.enums.push(x))
    
    const rlightsHeader = readFileSync("include/rlights.h","utf8");
    const rlightsFunctions = parser.parseFunctions(rlightsHeader, true);
    api.functions.push(rlightsFunctions[0])
    api.functions.push(rlightsFunctions[1])
    const rlightsEnums = parser.parseEnums(rlightsHeader)
    rlightsEnums.forEach(x => api.enums.push(x))
    const rlightsStructs = parser.parseStructs(rlightsHeader)
    rlightsStructs[0].binding = {
        properties: {
            type: { get: true, set: true },
            enabled: { get: true, set: true },
            position: { get: true, set: true },
            target: { get: true, set: true },
            color: { get: true, set: true },
            attenuation: { get: true, set: true },
        },
    }
    api.structs.push(rlightsStructs[0])

    const reasingsHeader = readFileSync("include/reasings.h","utf8");
    const reasingsFunctions = parser.parseFunctions(reasingsHeader);
    reasingsFunctions.forEach(x => api.functions.push(x))

    const rlightmapperHeader = readFileSync("src/rlightmapper.h", "utf8");
    const rlightmapperFunctions = parser.parseFunctionDefinitions(rlightmapperHeader);
    const rlightmapperStructs = parser.parseStructs(rlightmapperHeader);
    rlightmapperFunctions.forEach(x => api.functions.push(x));
    rlightmapperStructs.forEach(x => api.structs.push(x));
    rlightmapperStructs[0].binding = {
        properties: {
            w: { get: true },
            h: { get: true },
            progress: { get: true }
        }
    }
    rlightmapperStructs[1].binding = {
        properties: {
            hemisphereSize: { get: true, set: true },
            zNear: { get: true, set: true },
            zFar: { get: true, set: true },
            backgroundColor: { get: true, set: true },
            interpolationPasses: { get: true, set: true },
            interpolationThreshold: { get: true, set: true },
            cameraToSurfaceDistanceModifier: { get: true, set: true },
        }
    }

    const rextensionsHeader = readFileSync("src/rextensions.h","utf8");
    const rextensionsFunctions = parser.parseFunctionDefinitions(rextensionsHeader);
    console.log(rextensionsFunctions);
    rextensionsFunctions.forEach(x => api.functions.push(x))

    // Define a new header
    const core = new RayLibHeader("raylib_core")
    core.includes.include("raymath.h")
    core.includes.include("rcamera.h")
    core.includes.line("#define RAYGUI_IMPLEMENTATION")
    core.includes.include("raygui.h")
    core.includes.line("#define RLIGHTS_IMPLEMENTATION")
    core.includes.include("rlights.h")
    core.includes.include("reasings.h")
    core.includes.line("#define RLIGHTMAPPER_IMPLEMENTATION")
    core.includes.include("rlightmapper.h")

    getStruct(api.structs, "Color")!.binding = {
        properties: {
            r: { get: true, set: true },
            g: { get: true, set: true },
            b: { get: true, set: true },
            a: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Rectangle")!.binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            width: { get: true, set: true },
            height: { get: true, set: true },
        },
        createConstructor: true
    }    
    getStruct(api.structs, "Vector2")!.binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Vector3")!.binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Vector4")!.binding = {
        properties: {
            x: { get: true, set: true },
            y: { get: true, set: true },
            z: { get: true, set: true },
            w: { get: true, set: true },
        },
        createConstructor: true,
        aliases: getAliases(api.aliases, "Vector4")
    }
    getStruct(api.structs, "Ray")!.binding = {
        properties: {
            position: { get: false, set: true },
            direction: { get: false, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "RayCollision")!.binding = {
        properties: {
            hit: { get: true, set: false },
            distance: { get: true, set: false },
            point: { get: true, set: false },
            normal: { get: true, set: false },
        },
        createConstructor: false
    }
    getStruct(api.structs, "Camera2D")!.binding = {
        properties: {
            offset: { get: true, set: true },
            target: { get: true, set: true },
            rotation: { get: true, set: true },
            zoom: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Camera3D")!.binding = {
        properties: {
            position: { get: true, set: true },
            target: { get: true, set: true },
            up: { get: false, set: true },
            fovy: { get: true, set: true },
            projection: { get: true, set: true },
        },
        createConstructor: true,
        aliases: getAliases(api.aliases, "Camera3D")
    }
    getStruct(api.structs, "BoundingBox")!.binding = {
        properties: {
            min: { get: true, set: true },
            max: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Matrix")!.binding = {
        properties: {},
        createConstructor: false
    }
    getStruct(api.structs, "NPatchInfo")!.binding = {
        properties: {
            source: { get: true, set: true },
            left: { get: true, set: true },
            top: { get: true, set: true },
            right: { get: true, set: true },
            bottom: { get: true, set: true },
            layout: { get: true, set: true },
        },
        createConstructor: true
    }
    getStruct(api.structs, "Image")!.binding = { 
        properties: { 
            data: { set: true },
            width: { get: true, set: true }, 
            height: { get: true, set: true },
            mipmaps: { get: true, set: true },
            format: { get: true, set: true }
        },
        createEmptyConstructor: true
        //destructor: "UnloadImage"
    }
    getStruct(api.structs, "Wave")!.binding = { 
        properties: { 
            frameCount: { get: true }, 
            sampleRate: { get: true },
            sampleSize: { get: true },
            channels: { get: true }
        },
        //destructor: "UnloadWave"
    }
    getStruct(api.structs, "Sound")!.binding = { 
        properties: { 
            frameCount: { get: true }
        },
        //destructor: "UnloadSound"
    }
    getStruct(api.structs, "Music")!.binding = { 
        properties: { 
            frameCount: { get: true },
            looping: { get: true, set: true },
            ctxType: { get: true },
        },
        //destructor: "UnloadMusicStream"
    }
    getStruct(api.structs, "Model")!.binding = { 
        properties: {
            transform: { get: true, set: true },
            meshCount: { get: true },
            materialCount: { get: true },
            boneCount: { get: true },
        },
        //destructor: "UnloadModel"
    }
    getStruct(api.structs, "Mesh")!.binding = { 
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
    }
    getStruct(api.structs, "Shader")!.binding = { 
        properties: {
            id: { get: true }
        },
        //destructor: "UnloadShader"
    }
    getStruct(api.structs, "Texture")!.binding = { 
        properties: { 
            width: { get: true }, 
            height: { get: true },
            mipmaps: { get: true },
            format: { get: true },
        },
        aliases: getAliases(api.aliases, "Texture")
        //destructor: "UnloadTexture"
    }
    getStruct(api.structs, "Font")!.binding = { 
        properties: { 
            baseSize: { get: true },
            glyphCount: { get: true },
            glyphPadding: { get: true },
        },
        //destructor: "UnloadFont"
    }
    getStruct(api.structs, "RenderTexture")!.binding = { 
        properties: {
            id: { get: true },
            texture: { get: true },
            depth: { get: true },
        },
        aliases: getAliases(api.aliases, "RenderTexture")
        //destructor: "UnloadRenderTexture"
    }
    getStruct(api.structs, "MaterialMap")!.binding = { 
        properties: { 
            texture: { set: true },
            color: { set: true, get: true },
            value: { get: true, set: true }
        },
        //destructor: "UnloadMaterialMap"
    }
    getStruct(api.structs, "Material")!.binding = { 
        properties: { 
            shader: { get: true, set: true }
        },
        //destructor: "UnloadMaterial"
    }

    const structDI = getStruct(api.structs, "VrDeviceInfo")!
    structDI.fields.filter(x => x.name === "lensDistortionValues")[0].type = "Vector4"
    structDI.binding = {
        createEmptyConstructor: true,
        properties: {
            hResolution: { set: true, get: true },
            vResolution: { set: true, get: true },
            hScreenSize: { set: true, get: true },
            vScreenSize: { set: true, get: true },
            eyeToScreenDistance: { set: true, get: true },
            lensSeparationDistance: { set: true, get: true },
            interpupillaryDistance: { set: true, get: true },
            // lensDistortionValues: { 
            //     set: true, 
            //     get: true, 
            //     overrideRead(fn) {
            //         fn.line("// TODO")
            //     },
            //     overrideWrite(fn) {
            //         fn.line("// TODO")
            //     },
            // },
        }
    }

    getFunction(api.functions, "EndDrawing")!.binding = { after: gen => gen.call("app_update_quickjs", []) }
    ignore("SetWindowIcons")
    ignore("GetWindowHandle")

    // Custom frame control functions
    // NOT SUPPORTED BECAUSE NEEDS COMPILER FLAG
    ignore("SwapScreenBuffer")
    ignore("PollInputEvents")
    ignore("WaitTime")
    
    //ignore("BeginVrStereoMode")
    //ignore("EndVrStereoMode")
    //ignore("LoadVrStereoConfig")
    //ignore("UnloadVrStereoConfig")
    
    getFunction(api.functions, "SetShaderValue")!.binding = { body: (gen) => {
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
    }} 
    ignore("SetShaderValueV")

    const traceLog = getFunction(api.functions, "TraceLog")!
    traceLog.params?.pop()

    // Memory functions not supported on JS, just use ArrayBuffer
    ignore("MemAlloc")
    ignore("MemRealloc")
    ignore("MemFree")
    
    // Callbacks not supported on JS
    ignore("SetTraceLogCallback")
    ignore("SetLoadFileDataCallback")
    ignore("SetSaveFileDataCallback")
    ignore("SetLoadFileTextCallback")
    ignore("SetSaveFileTextCallback")

    // Files management functions
    const lfd = getFunction(api.functions, "LoadFileData")!
    lfd.params![lfd.params!.length-1].binding = { ignore: true }
    lfd.binding = {
        body: gen => {
            gen.jsToC("const char *", "fileName", "argv[0]")
            gen.declare("bytesRead", "unsigned int")
            gen.call("LoadFileData", ["fileName", "&bytesRead"], { type: "unsigned char *", name: "retVal" })
            gen.statement("JSValue buffer = JS_NewArrayBufferCopy(ctx, (const uint8_t*)retVal, bytesRead)")
            gen.call("UnloadFileData", ["retVal"])
            gen.jsCleanUpParameter("const char*","fileName")
            gen.returnExp("buffer")
        } 
    }
    ignore("UnloadFileData")
    
    // TODO: SaveFileData works but unnecessary makes copy of memory
    getFunction(api.functions, "SaveFileData")!.binding = { }
    ignore("ExportDataAsCode")
    getFunction(api.functions, "LoadFileText")!.binding = { after: gen => gen.call("UnloadFileText", ["returnVal"]) } 
    getFunction(api.functions, "SaveFileText")!.params![1].binding = { typeAlias: "const char *" } 
    ignore("UnloadFileText")
    
    const createFileList = (gen: QuickJsGenerator, loadName: string, unloadName: string, args: string[]) => {
        gen.call(loadName, args, { type: "FilePathList", name: "files" })
        gen.call("JS_NewArray", ["ctx"], { type: "JSValue", name:"ret"})
        const f = gen.for("i", "files.count")
        f.call("JS_SetPropertyUint32", ["ctx","ret", "i", "JS_NewString(ctx,files.paths[i])"])
        gen.call(unloadName, ["files"])
    }
    getFunction(api.functions, "LoadDirectoryFiles")!.binding = { 
        jsReturns: "string[]",
        body: gen => {
            gen.jsToC("const char *", "dirPath", "argv[0]")
            createFileList(gen, "LoadDirectoryFiles", "UnloadDirectoryFiles", ["dirPath"])
            gen.jsCleanUpParameter("const char *", "dirPath")
            gen.returnExp("ret")
        }
    }
    getFunction(api.functions, "LoadDirectoryFilesEx")!.binding = { 
        jsReturns: "string[]",
        body: gen => {
            gen.jsToC("const char *", "basePath", "argv[0]")
            gen.jsToC("const char *", "filter", "argv[1]")
            gen.jsToC("bool", "scanSubdirs", "argv[2]")
            createFileList(gen, "LoadDirectoryFilesEx", "UnloadDirectoryFiles", ["basePath", "filter", "scanSubdirs"])
            gen.jsCleanUpParameter("const char *", "basePath")
            gen.jsCleanUpParameter("const char *", "filter")
            gen.returnExp("ret")
        }
    }
    ignore("UnloadDirectoryFiles")
    getFunction(api.functions, "LoadDroppedFiles")!.binding = { 
        jsReturns: "string[]",
        body: gen => { 
            createFileList(gen, "LoadDroppedFiles", "UnloadDroppedFiles", [])
            gen.returnExp("ret")
        }
    }
    ignore("UnloadDroppedFiles")
    
    // Compression/encoding functionality
    ignore("CompressData")
    ignore("DecompressData")
    ignore("EncodeDataBase64")
    ignore("DecodeDataBase64")

    ignore("DrawLineStrip")
    ignore("DrawTriangleFan")
    ignore("DrawTriangleStrip")
    ignore("CheckCollisionPointPoly")
    ignore("CheckCollisionLines")
    ignore("LoadImageAnim")
    ignore("ExportImageAsCode")

    getFunction(api.functions, "LoadImageColors")!.binding = {
        jsReturns: "ArrayBuffer",
        body: gen => {
            gen.jsToC("Image","image","argv[0]", core.structLookup)
            gen.call("LoadImageColors", ["image"], {name:"colors",type:"Color *"})
            gen.statement("JSValue retVal = JS_NewArrayBufferCopy(ctx, (const uint8_t*)colors, image.width*image.height*sizeof(Color))")
            gen.call("UnloadImageColors", ["colors"])
            gen.returnExp("retVal")
        }
    }

    ignore("LoadImagePalette")
    ignore("UnloadImageColors")
    ignore("UnloadImagePalette")
    ignore("GetPixelColor")
    ignore("SetPixelColor")

    const lfx = getFunction(api.functions, "LoadFontEx")!
    lfx.params![2].binding = { ignore: true }
    lfx.params![3].binding = { ignore: true }
    lfx.binding = { customizeCall: "Font returnVal = LoadFontEx(fileName, fontSize, NULL, 0);" }

    ignore("LoadFontFromMemory")
    ignore("LoadFontData")
    ignore("GenImageFontAtlas")
    ignore("UnloadFontData")
    ignore("ExportFontAsCode")
    ignore("DrawTextCodepoints")
    ignore("GetGlyphInfo")
    ignore("LoadUTF8")
    ignore("UnloadUTF8")
    ignore("LoadCodepoints")
    ignore("UnloadCodepoints")
    ignore("GetCodepointCount")
    ignore("GetCodepoint")
    ignore("GetCodepointNext")
    ignore("GetCodepointPrevious")
    ignore("CodepointToUTF8")

    // Not supported, use JS Stdlib instead
    api.functions.filter(x => x.name.startsWith("Text")).forEach(x => ignore(x.name))

    ignore("DrawTriangleStrip3D")
    ignore("LoadMaterials")
    ignore("LoadModelAnimations")
    ignore("UpdateModelAnimation")
    ignore("UnloadModelAnimation")
    ignore("UnloadModelAnimations")
    ignore("IsModelAnimationValid")
    ignore("ExportWaveAsCode")

    // Wave/Sound management functions
    ignore("LoadWaveSamples")
    ignore("UnloadWaveSamples")
    ignore("LoadMusicStreamFromMemory")
    ignore("LoadAudioStream")
    ignore("IsAudioStreamReady")
    ignore("UnloadAudioStream")
    ignore("UpdateAudioStream")
    ignore("IsAudioStreamProcessed")
    ignore("PlayAudioStream")
    ignore("PauseAudioStream")
    ignore("ResumeAudioStream")
    ignore("IsAudioStreamPlaying")
    ignore("StopAudioStream")
    ignore("SetAudioStreamVolume")
    ignore("SetAudioStreamPitch")
    ignore("SetAudioStreamPan")
    ignore("SetAudioStreamBufferSizeDefault")
    ignore("SetAudioStreamCallback")
    ignore("AttachAudioStreamProcessor")
    ignore("DetachAudioStreamProcessor")
    ignore("AttachAudioMixedProcessor")
    ignore("DetachAudioMixedProcessor")

    ignore("Vector3OrthoNormalize")
    ignore("Vector3ToFloatV")
    ignore("MatrixToFloatV")
    ignore("QuaternionToAxisAngle")
    core.exportGlobalDouble("DEG2RAD", "(PI/180.0)")
    core.exportGlobalDouble("RAD2DEG", "(180.0/PI)")

    const setOutParam = (fun: RayLibFunction, index: number) => {
        const param = fun!.params![index]
        param.binding = { 
            jsType: `{ ${param.name}: number }`,
            customConverter: (gen,src) => {
                gen.declare(param.name, param.type, false, "NULL");
                gen.declare(param.name+"_out", param.type.replace(" *",""))
                const body = gen.if("!JS_IsNull("+src+")")
                body.statement(param.name + " = &" + param.name + "_out")
                body.call("JS_GetPropertyStr", ["ctx",src, '"'+param.name+'"'], { name: param.name+"_js", type: "JSValue" })
                body.call("JS_ToInt32", ["ctx",param.name,param.name+"_js"])
            },
            customCleanup: (gen,src) => {
                const body = gen.if("!JS_IsNull("+src+")")
                body.call("JS_SetPropertyStr", ["ctx", src, `"${param.name}"`, "JS_NewInt32(ctx,"+param.name+"_out)"])
            } 
        }
    }
    const setOutParamString = (fun: RayLibFunction, index: number, indexLen: number) => {
        const lenParam = fun!.params![indexLen]
        lenParam.binding = { ignore: true }
        const param = fun!.params![index]
        param.binding = { 
            jsType: `{ ${param.name}: string }`,
            customConverter: (gen,src) => {
                gen.call("JS_GetPropertyStr", ["ctx",src, '"'+param.name+'"'], { name: param.name+"_js", type: "JSValue" })
                gen.declare(param.name+"_len", "size_t");
                gen.call("JS_ToCStringLen",["ctx", "&"+param.name+"_len", param.name+"_js"], { name: param.name+"_val", type: "const char *" })
                gen.call("memcpy", ["(void *)textbuffer", param.name+"_val", param.name+"_len"])
                gen.statement("textbuffer["+param.name+"_len] = 0")
                gen.declare(param.name, param.type, false, "textbuffer");
                gen.declare(lenParam.name, lenParam.type, false, "4096")
            },
            customCleanup: (gen, src) => {
                gen.jsCleanUpParameter("const char *", param.name + "_val")
                gen.call("JS_SetPropertyStr", ["ctx", src, `"${param.name}"`, "JS_NewString(ctx,"+param.name+")"])
            } 
        }

    }

    core.definitions.declare("textbuffer[4096]", "char", true)

    setOutParam(getFunction(api.functions, "GuiDropdownBox")!, 2)
    setOutParam(getFunction(api.functions, "GuiSpinner")!, 2)
    setOutParam(getFunction(api.functions, "GuiValueBox")!, 2)
    setOutParam(getFunction(api.functions, "GuiListView")!, 2)

    // const setStringListParam = (fun: RayLibFunction, index: number, indexLen: number) => {
    //     const lenParam = fun!.params![indexLen]
    //     lenParam.binding = { ignore: true }
    //     const param = fun!.params![index]
    //     fun.binding = { customizeCall: "int returnVal = GuiListViewEx(bounds, text, count, focus, scrollIndex, active);" }
    //     param.binding = { 
    //         jsType: `{ ${param.name}: string[] }`,
    //         customConverter: (gen,src) => {
    //             gen.line("// TODO: Read string values")
    //         },
    //         customCleanup: (gen, src) => {
    //             gen.line("// TODO: Dispose strings")
    //         }             
    //     }

    // }

    //const glve = getFunction(api.functions, "GuiListViewEx")!
    //setStringListParam(glve, 1,2)
    //setOutParam(glve, 3)
    //setOutParam(glve, 4)
    ignore("GuiListViewEx");

    setOutParamString(getFunction(api.functions, "GuiTextBox")!, 1,2)

    const gtib = getFunction(api.functions, "GuiTextInputBox")!
    setOutParamString(gtib,4,5)
    setOutParam(gtib, 6)
    
    // needs string array
    ignore("GuiTabBar")
    ignore("GuiGetIcons")
    ignore("GuiLoadIcons")

    api.structs.forEach(x => core.addApiStruct(x))
    api.functions.forEach(x => core.addApiFunction(x))
    api.defines.filter(x => x.type === "COLOR").map(x => ({ name: x.name, description: x.description, values: (x.value.match(/\{([^}]+)\}/) || "")[1].split(',').map(x => x.trim()) })).forEach(x => {
        core.exportGlobalStruct("Color", x.name, x.values, x.description)
    })
    api.enums.forEach(x => core.addEnum(x))
    core.exportGlobalInt("MATERIAL_MAP_DIFFUSE", "Albedo material (same as: MATERIAL_MAP_DIFFUSE")
    core.exportGlobalInt("MATERIAL_MAP_SPECULAR", "Metalness material (same as: MATERIAL_MAP_SPECULAR)")
    core.writeTo("src/bindings/js_raylib_core.h")
    core.typings.writeTo("examples/lib.raylib.d.ts")
    const ignored = api.functions.filter(x => x.binding?.ignore).length
    console.log(`Converted ${api.functions.length-ignored} function. ${ignored} ignored`)
    console.log("Success!")

    // TODO: Expose PLatform defines
}

main()
