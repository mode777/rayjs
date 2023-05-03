cmake_minimum_required(VERSION 3.1)
project(my-game)

message("=== Configure SDL2 ===")
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/SDL EXCLUDE_FROM_ALL)

message("=== Configure Corrade ===")
set(CORRADE_BUILD_STATIC ON CACHE BOOL "" FORCE)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/corrade EXCLUDE_FROM_ALL)

message("=== Configure Magnum ===")
# Add Magnum as a subproject, enable Sdl2Application
set(MAGNUM_BUILD_STATIC ON CACHE BOOL "" FORCE)
set(MAGNUM_WITH_SDL2APPLICATION ON CACHE BOOL "" FORCE)
# hack to force magnum to link against static sdl
add_library(SDL2::SDL2 ALIAS SDL2-static) 
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/magnum EXCLUDE_FROM_ALL)

message("=== Configure QuickJS ===")
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

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})
file(GLOB files src/main.cpp)
add_executable(${CMAKE_PROJECT_NAME} ${files})
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE include)
target_include_directories(${CMAKE_PROJECT_NAME} PRIVATE src)
target_link_libraries(${CMAKE_PROJECT_NAME} Magnum::Magnum Magnum::GL Magnum::Sdl2Application quickjs)