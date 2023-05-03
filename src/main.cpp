#include <Magnum/GL/Buffer.h>
#include <Magnum/GL/DefaultFramebuffer.h>
#include <Magnum/GL/Mesh.h>
#include <Magnum/Math/Color.h>
#include <Magnum/Platform/Sdl2Application.h>
#include <Magnum/Shaders/VertexColorGL.h>

#include <common.h>

using namespace Magnum;
using namespace Magnum::GL;
using namespace Magnum::Shaders;
using namespace Magnum::Platform;
using namespace Math::Literals;


class MyApplication: public Platform::Application {
    public:
        explicit MyApplication(const Arguments& arguments);

    private:
        void drawEvent() override;
        Mesh _mesh;
        VertexColorGL2D _shader;
};

MyApplication::MyApplication(const Arguments& arguments):
    Application(
        arguments, 
        Configuration()
            .setTitle("Magnum Triangle Example")
            .setSize(Vector2i{640,480})
            .setWindowFlags(Sdl2Application::Configuration::WindowFlag::Resizable))
{
    app_init_quickjs(arguments.argc, arguments.argv);

    struct TriangleVertex {
        Vector2 position;
        Color3 color;
    };
    const TriangleVertex vertices[]{
        {{-0.5f, -0.5f}, 0xff0000_rgbf},    /* Left vertex, red color */
        {{ 0.5f, -0.5f}, 0x00ff00_rgbf},    /* Right vertex, green color */
        {{ 0.0f,  0.5f}, 0x0000ff_rgbf}     /* Top vertex, blue color */
    };
    _mesh.setCount(Containers::arraySize(vertices))
        .addVertexBuffer(Buffer(vertices), 0,
            VertexColorGL2D::Position(),
            VertexColorGL2D::Color3());
}

void MyApplication::drawEvent() {
    defaultFramebuffer.clear(FramebufferClear::Color);
    app_update_quickjs();

    _shader.draw(_mesh);

    swapBuffers();
}

MAGNUM_APPLICATION_MAIN(MyApplication)