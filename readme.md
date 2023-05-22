![rayjs logo](./doc/logo.png)
# rayjs - Javascript Bindings for Raylib
Javascript bindings for raylib in a single ~3mb executable
## Building

### Check out required files
```bash
git clone https://github.com/mode777/rayjs.git
git submodule update --init --recursive
```

### Build with cmake
Make sure you have cmake installed and in your path.
```bash
cd rayjs
mkdir build
cd build
cmake ..
make
```