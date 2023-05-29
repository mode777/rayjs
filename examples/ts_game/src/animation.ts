import { Clickable, HasColor } from "./entity"
import { makeUpdateablePromise } from "./game"

export type easeFunc = (t: number, a: number, b: number, d: number) => number

export const interpolate = (a: number, b: number, d: number, setter: (v: number) => void, fn: easeFunc) => {
    const start = getTime()
    return makeUpdateablePromise(() => {
        const cur = getTime()-start
        if(cur < d){
            setter(fn(cur, a, b, d))
            return false
        } else {
            setter(b)
            return true
        }
    })
}

export const waitCondition = (predicate: () => boolean) => {
    const start = getTime()
    return makeUpdateablePromise(() => {
        if(predicate()){
            return false
        } else {
            return true
        }
    })
} 

export const wait = (time: number) => {
    const start = getTime()
    return waitCondition(() => (getTime()-start) < time)
} 

export const waitFrame = (frames = 1) => waitCondition(() => !!(frames--) || frames <= 0) 

export const waitKeyPressed = (key: number) => waitCondition(() => !isKeyPressed(key))
export const waitClick = (button: number = MOUSE_BUTTON_LEFT) => waitCondition(() => !isMouseButtonDown(button))
export const waitEntityClicked = (entity: Clickable) => waitCondition(() => !entity.isClicked)

export const fadeIn = (c: HasColor, time: number, easeFunc = easeLinearNone) => interpolate(0, 1, time, (v) => c.color = fade(c.color, v), easeFunc)
export const fadeOut = (c: HasColor, time: number, easeFunc = easeLinearNone) => interpolate(0, 1, time, (v) => c.color = fade(c.color, 1-v), easeFunc)