#include <Magnum/GL/DefaultFramebuffer.h>
#include <Magnum/Platform/Sdl2Application.h>

using namespace Magnum;

class MyApplication: public Platform::Application {
    public:
        explicit MyApplication(const Arguments& arguments);

    private:
        void drawEvent() override;
};

MyApplication::MyApplication(const Arguments& arguments):
    Platform::Application{arguments}
{
    // TODO: Add your initialization code here
}

void MyApplication::drawEvent() {
    GL::defaultFramebuffer.clear(GL::FramebufferClear::Color);

    // TODO: Add your drawing code here

    swapBuffers();
}

MAGNUM_APPLICATION_MAIN(MyApplication)