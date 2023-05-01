#ifndef COMMON_H
#define COMMON_H

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include <SDL.h>


typedef struct {
    uint width;
    uint height;
} App_Config;

typedef struct {
    SDL_Window* window;
    bool quit;
} App_State;

extern App_Config app_config;
extern App_State app_state;;

int app_init_sdl();
int app_update_sdl();
int app_dispose_sdl();

int app_init_quickjs(int argc, char** argv);
int app_update_quickjs();
int app_dispose_quickjs();

int app_init_bgfx();
int app_update_bgfx();
int app_dispose_bgfx();

// utiles
char* app_read_file(const char* filename, size_t* out_size);

#endif