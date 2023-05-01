#include <bgfx/c99/bgfx.h>
#include <SDL_syswm.h>

#include "common.h"
#include "logo.h"

static bgfx_platform_data_t get_platform_data(SDL_Window* win);
uint16_t uint16_max(uint16_t _a, uint16_t _b)
{
	return _a < _b ? _b : _a;
}

int app_init_bgfx(){
    bgfx_init_t init;
	bgfx_init_ctor(&init);

    init.platformData = get_platform_data(app_state.window);
    init.resolution.width = app_config.width;
    init.resolution.height = app_config.height;
    init.resolution.reset = BGFX_RESET_VSYNC;

    // calling render_frame on the same thread before init to force single-threaded mode
    bgfx_render_frame(16);
	bgfx_init(&init);
	//bgfx_reset(WIDTH, HEIGHT, BGFX_RESET_VSYNC, init.resolution.format);

	bgfx_set_debug(BGFX_DEBUG_TEXT);

    bgfx_set_view_clear(0
		, BGFX_CLEAR_COLOR|BGFX_CLEAR_DEPTH
		, 0x303030ff
		, 1.0f
		, 0
		);

    return 0;
}

int app_update_bgfx(){
    // Set view 0 default viewport.
    bgfx_set_view_rect(0, 0, 0, (uint16_t)app_config.width, (uint16_t)app_config.height);

    // This dummy draw call is here to make sure that view 0 is cleared
    // if no other draw calls are submitted to view 0.
    bgfx_encoder_t* encoder = bgfx_encoder_begin(true);
    bgfx_encoder_touch(encoder, 0);
    bgfx_encoder_end(encoder);

    // Use debug font to print information about this example.
    bgfx_dbg_text_clear(0, false);
    bgfx_dbg_text_image(
        uint16_max( (uint16_t)app_config.width/2/8, 20)-20
        , uint16_max( (uint16_t)app_config.height/2/16, 6)-6
        , 40
        , 12
        , s_logo
        , 160
        );

    bgfx_dbg_text_printf(0, 1, 0x0f, "Color can be changed with ANSI \x1b[9;me\x1b[10;ms\x1b[11;mc\x1b[12;ma\x1b[13;mp\x1b[14;me\x1b[0m code too.");

    bgfx_dbg_text_printf(80, 1, 0x0f, "\x1b[;0m    \x1b[;1m    \x1b[; 2m    \x1b[; 3m    \x1b[; 4m    \x1b[; 5m    \x1b[; 6m    \x1b[; 7m    \x1b[0m");
    bgfx_dbg_text_printf(80, 2, 0x0f, "\x1b[;8m    \x1b[;9m    \x1b[;10m    \x1b[;11m    \x1b[;12m    \x1b[;13m    \x1b[;14m    \x1b[;15m    \x1b[0m");

    bgfx_dbg_text_printf(0, 3, 0x1f, "hello-bgfx");
    bgfx_dbg_text_printf(0, 4, 0x3f, "Description: Initialization and debug text with C99 API.");

    // Advance to next frame. Rendering thread will be kicked to
    // process submitted rendering primitives.
    bgfx_frame(false);
}

int app_dispose_bgfx(){
    bgfx_shutdown();
}

static bgfx_platform_data_t get_platform_data(SDL_Window* win){
    bgfx_platform_data_t pd = {0};
#if !BX_PLATFORM_EMSCRIPTEN
    SDL_SysWMinfo wmi;
    SDL_VERSION(&wmi.version);
    if (!SDL_GetWindowWMInfo(win, &wmi)) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "SDL_SysWMinfo could not be retrieved: %s", SDL_GetError());
        return pd;
    }
#endif 

#if BX_PLATFORM_WINDOWS
    pd.nwh = wmi.info.win.window;
#elif BX_PLATFORM_OSX
    pd.nwh = wmi.info.cocoa.window;
#elif BX_PLATFORM_LINUX
    pd.ndt = wmi.info.x11.display;
    pd.nwh = (void*)(uintptr_t)wmi.info.x11.window;
#elif BX_PLATFORM_EMSCRIPTEN
    pd.nwh = (void*)"#canvas";
#endif
    return pd;
}
