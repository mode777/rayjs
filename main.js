import { setWindowTitle, setWindowPosition, Color } from "raylib.core"
import { loadImage } from "raylib.texture"
import { gc } from "std"

const img = loadImage("assets/planet00.png")
console.log(img.width)

//const img = new Image("assets/planet00.png")

gc()

const color = new Color(1,2,3,4)
color.r = 10
console.log(color.r,color.g,color.b,color.a, color)

setWindowTitle("My Window")
setWindowPosition(20,50)


