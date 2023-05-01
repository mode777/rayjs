cmake_minimum_required(VERSION 3.1)
project(hello-bgfx)

# set(BGFX_AMALGAMATED      OFF CACHE INTERNAL "" FORCE)
# set(BGFX_BUILD_EXAMPLES   OFF CACHE INTERNAL "" FORCE)
set(BGFX_CONFIG_DEBUG     OFF CACHE INTERNAL "" FORCE)
set(BX_CONFIG_DEBUG     OFF CACHE INTERNAL "" FORCE)
# set(BGFX_CUSTOM_TARGETS   OFF CACHE INTERNAL "" FORCE)
# set(BGFX_INSTALL          OFF CACHE INTERNAL "" FORCE)
# set(BGFX_INSTALL_EXAMPLES OFF CACHE INTERNAL "" FORCE)
# set(BGFX_USE_DEBUG_SUFFIX OFF CACHE INTERNAL "" FORCE)
# set(BGFX_USE_OVR          OFF CACHE INTERNAL "" FORCE)
# set(BUILD_SHARED_LIBS     OFF CACHE INTERNAL "" FORCE)
# set(BX_AMALGAMATED        OFF CACHE INTERNAL "" FORCE)
# if (HELLO_BGFX_BUILD_SHADERS)
#   set(BGFX_BUILD_TOOLS ON CACHE INTERNAL "" FORCE)
# else()
#   set(BGFX_BUILD_TOOLS OFF CACHE INTERNAL "" FORCE)
# endif()
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/bgfx.cmake)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/SDL)

# add quickjs
set(quickjs_version 2021-03-27)
set(quickjs_sources_root ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/quickjs)
set(quickjs_sources
	${quickjs_sources_root}/quickjs.h
	${quickjs_sources_root}/quickjs-libc.h
	${quickjs_sources_root}/quickjs.c
	${quickjs_sources_root}/libregexp.c
	${quickjs_sources_root}/libunicode.c
	${quickjs_sources_root}/libbf.c
	${quickjs_sources_root}/cutils.c
	${quickjs_sources_root}/quickjs-libc.c
)
add_library(quickjs STATIC
	${quickjs_sources}
)
target_compile_definitions(quickjs
	PRIVATE
		CONFIG_VERSION="${quickjs_version}"
)
target_include_directories(quickjs
	PRIVATE
		${quickjs_sources_root}
)


# Note: This was necessary to avoid a run-time error on macOS/OpenGL. Without
# this option, the NSOpenGLViewContext's setView method was called from a
# wrong (?) thread during bgfx::init and then the app crashes. This needs to be
# investigated further.
#target_compile_definitions(bgfx PUBLIC BGFX_CONFIG_MULTITHREADED=0)

# workaraound to resolve shaderc
if (NOT TARGET bgfx::shaderc AND TARGET shaderc)
    add_executable(bgfx::shaderc ALIAS shaderc)
endif()

bgfx_compile_shader_to_header(
  TYPE VERTEX
  SHADERS ${CMAKE_CURRENT_SOURCE_DIR}/shaders/vs.sc
  VARYING_DEF ${CMAKE_CURRENT_SOURCE_DIR}/shaders/varying.def.sc
  OUTPUT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/include/generated/shaders
)
bgfx_compile_shader_to_header(
  TYPE FRAGMENT
  SHADERS ${CMAKE_CURRENT_SOURCE_DIR}/shaders/fs.sc
  VARYING_DEF ${CMAKE_CURRENT_SOURCE_DIR}/shaders/varying.def.sc
  OUTPUT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/include/generated/shaders
)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})
file(GLOB files src/*.cpp)
add_executable(hello-bgfx ${files} shaders/vs.sc shaders/fs.sc shaders/varying.def.sc)

#target_include_directories(hello-bgfx PRIVATE ${quickjs_sources_root})
target_include_directories(hello-bgfx PRIVATE include)
target_include_directories(hello-bgfx PRIVATE src)
target_link_libraries(hello-bgfx bgfx bx SDL2-static quickjs)