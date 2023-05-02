#include <Magnum/GL/DefaultFramebuffer.h>
#include <Magnum/GL/Context.h>
#include <Magnum/Platform/GLContext.h>
#include "common.h"
//#include "shaders.h"

using namespace Magnum;

App_Config app_config = { 640, 480 };
App_State app_state = { NULL, 0 };

int main(int argc, char *argv[]) {
    
    app_init_quickjs(argc, argv);    
    app_init_sdl();
    Platform::GLContext context;

    // Main loop
    while (!app_state.quit) {
        app_update_sdl();
        app_update_quickjs();
    }

    app_dispose_sdl();
    app_dispose_quickjs();
    return 0;
}