#ifndef SHADERS_H
#define SHADERS_H

#include <bgfx/c99/bgfx.h>

#if BX_PLATFORM_WINDOWS
#include <vs.sc.dx9.bin.h>
#include <vs.sc.dx11.bin.h>
#include <fs.sc.dx9.bin.h>
#include <fs.sc.dx11.bin.h>
#elif BX_PLATFORM_OSX
#include <generated/shaders/vs.sc.mtl.bin.h>
#include <generated/shaders/fs.sc.mtl.bin.h>
#elif (BX_PLATFORM_LINUX || BX_PLATFORM_EMSCRIPTEN)
#include <vs.sc.glsl.bin.h>
#include <fs.sc.glsl.bin.h>
#endif

#endif