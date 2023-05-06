import { setWindowTitle, setWindowPosition } from "raylib.core"
import { loadImage, Image } from "raylib.texture"
import { gc } from "std"

console.log(loadImage("assets/planet00.png"))

const img = new Image("assets/planet00.png")

gc()
console.log(img.width)

setWindowTitle("My Window")
setWindowPosition(1920,50)


