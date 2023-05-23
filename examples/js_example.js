import { Timers } from "./common/timers.js"

const timers = new Timers()
traceLog(LOG_INFO, clamp(-1.5,0,5))
traceLog(LOG_INFO, vector2Distance(new Vector2(0,0), new Vector2(1,0)))
initWindow(640, 480, "Javascript Tests")

const pos = new Vector2(getScreenWidth()/2,getScreenHeight()/2)
const radius = 100

timers.setTimeout(() => pos.x += 200, 2000)

while(!windowShouldClose()){
    timers.update(getFrameTime())
    beginDrawing()
    clearBackground(RAYWHITE)
    drawCircle(pos.x,pos.y, radius, LIME)
    endDrawing()
}

closeWindow()