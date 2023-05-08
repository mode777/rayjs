import { setWindowTitle, setWindowPosition } from "raylib.core"
import { loadImage } from "raylib.texture"
import { gc } from "std"

const img = loadImage("assets/planet00.png")
console.log(img.width)

//const img = new Image("assets/planet00.png")

gc()

setWindowTitle("My Window")
setWindowPosition(20,50)


