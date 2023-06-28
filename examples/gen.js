initWindow(100,100,"Gen")

const input = [["orange",ORANGE],["green", LIME], ["purple", PURPLE],["red", MAROON], ["lightgrey", LIGHTGRAY], ["grey", GRAY], ["blue", BLUE]]

input.forEach(t => {
    traceLog(LOG_INFO, t)
    const [name, color] = t
    const outDir = "../build/out/"
    createPlaceholder(128,128,color, 64, 32, `${outDir}grid_128_${name}.png`)
    createPlaceholder(64,64,color, 32, 16, `${outDir}grid_64_${name}.png`)
    createPlaceholder(32,32,color, 16, 8, `${outDir}grid_32_${name}.png`)
    createDoor(128,128, color, `${outDir}door_${name}.png`)
    createWindow(128,128, color, `${outDir}window_${name}.png`)
});


closeWindow()

function createDoor(sizex, sizey, color, filename){
    const img = genImageColor(sizex, sizey, color)
    drawGrid(img, sizex, sizey, 8, blend(color, WHITE, 0.12))
    drawGrid(img, sizex, sizey, 16, blend(color, WHITE, 0.25))
    drawGrid(img, sizex, sizey, 32, blend(color, WHITE, 0.5))
    imageDrawLine(img, 0,0,sizex,0, WHITE)
    imageDrawLine(img, 0,0,0,sizey, WHITE)
    imageDrawText(img, `Door 48x64`, 2, 1, 10, WHITE)
    imageDrawRectangle(img, 40, 64, 48, 64, blend(color, BLACK, 0.5))
    imageDrawRectangleLines(img, new Rectangle(40,64,48,64+1),1,WHITE)
    exportImage(img, filename)
    unloadImage(img)
}

function createWindow(sizex, sizey, color, filename){
    const img = genImageColor(sizex, sizey, color)
    drawGrid(img, sizex, sizey, 8, blend(color, WHITE, 0.12))
    drawGrid(img, sizex, sizey, 16, blend(color, WHITE, 0.25))
    drawGrid(img, sizex, sizey, 32, blend(color, WHITE, 0.5))
    imageDrawLine(img, 0,0,sizex,0, WHITE)
    imageDrawLine(img, 0,0,0,sizey, WHITE)
    imageDrawText(img, `Window 32x48`, 2, 1, 10, WHITE)
    imageDrawRectangle(img, 48, 48, 32, 48, blend(color, BLACK, 0.5))
    imageDrawRectangleLines(img, new Rectangle(48,48,32,48),1,WHITE)
    exportImage(img, filename)
    unloadImage(img)
}

function createPlaceholder(sizex, sizey, color, grid, subgrid, filename){
    const img = genImageColor(sizex, sizey, color)
    drawGrid(img, sizex, sizey, subgrid, blend(color, WHITE, 0.25))
    drawGrid(img, sizex, sizey, grid, blend(color, WHITE, 0.5))
    imageDrawLine(img, 0,0,sizex,0, WHITE)
    imageDrawLine(img, 0,0,0,sizey, WHITE)
    imageDrawText(img, `${sizex}x${sizey}`, 2, 1, 10, WHITE)
    exportImage(img, filename)
    unloadImage(img)
}

function drawGrid(img, w,h,size,color){
for (let y = 0; y < h; y+=size) {
        imageDrawLine(img, 0, y, w, y, color)
    }
    for (let x = 0; x < w; x+=size) {
        imageDrawLine(img, x, 0, x, h, color)
    }
}

function blend(c1, c2, alpha){
    const b = (v1, v2) => v1 * (1-alpha) + v2 * alpha
    return new Color(b(c1.r,c2.r), b(c1.g, c2.g), b(c1.b, c2.b), c1.a)  
}