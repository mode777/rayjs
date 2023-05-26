cmake_minimum_required(VERSION 3.1)
set(CMAKE_OSX_ARCHITECTURES "arm64;x86_64" CACHE STRING "" FORCE)
project(rayjs)

message("=== Configure raylib ===")
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/raylib EXCLUDE_FROM_ALL)

message("=== Configure QuickJS ===")
# add quickjs
set(quickjs_version 2021-03-27)
set(quickjs_sources_root ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/quickjs)
set(quickjs_sources
	${quickjs_sources_root}/quickjs.h
	#${quickjs_sources_root}/quickjs-libc.h
	${quickjs_sources_root}/quickjs.c
	${quickjs_sources_root}/libregexp.c
	${quickjs_sources_root}/libunicode.c
	${quickjs_sources_root}/libbf.c
	${quickjs_sources_root}/cutils.c
	#${quickjs_sources_root}/quickjs-libc.c
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

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})
file(GLOB files src/*.c)
#add_executable(${CMAKE_PROJECT_NAME} MACOSX_BUNDLE ${files})
add_executable(${CMAKE_PROJECT_NAME} ${files})
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE include)
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE src)
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE thirdparty/raylib/examples/shapes)
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE thirdparty/raylib/examples/shaders)
target_link_libraries(${CMAKE_PROJECT_NAME} quickjs raylib)