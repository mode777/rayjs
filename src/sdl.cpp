#include "common.h"

static SDL_Event event;
static bool is_initialized = false;
static bool is_window_created = false;
static Uint32 init_flags = SDL_INIT_VIDEO;

int app_init_sdl(){
    // Initialize SDL
    if (SDL_Init(init_flags) < 0) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Failed to initialize SDL: %s", SDL_GetError());
        return -1;
    }
    is_initialized = true;
    // Create a window and renderer
    app_state.window = SDL_CreateWindow("hello bgfx", 
        SDL_WINDOWPOS_UNDEFINED, 
        SDL_WINDOWPOS_UNDEFINED, 
        app_config.width, 
        app_config.height, 
        SDL_WINDOW_SHOWN | SDL_WINDOW_RESIZABLE | SDL_WINDOW_ALLOW_HIGHDPI);
    if (!app_state.window) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Failed to create window: %s", SDL_GetError());
        return -1;
    }
    is_window_created = true;

    SDL_GLContext context = SDL_GL_CreateContext(app_state.window);
    if (context == nullptr) {
        // handle error
        return 1;
    }

    return 0;
}

int app_update_sdl(){
    // Handle events
    while (SDL_PollEvent(&event)) {
        SDL_KeyCode keycode;
        switch (event.type) {
            case SDL_QUIT:
                app_state.quit = true;
                break;
            default:
                break;
        }   
    }
    return 0;
}

int app_dispose_sdl(){
    if(is_window_created)
        SDL_DestroyWindow(app_state.window);

    if(is_initialized)
        SDL_Quit();
}