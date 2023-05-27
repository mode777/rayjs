import { HasColor } from "./entity"
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

export const wait = (time: number) => {
    const start = getTime()
    return makeUpdateablePromise(() => {
        const cur = getTime()-start
        if(cur < time){
            return false
        } else {
            return true
        }
    })
} 

export const fadeIn = (c: HasColor, time: number, easeFunc = easeLinearNone) => interpolate(0, 1, time, (v) => c.color = fade(c.color, v), easeFunc)
export const fadeOut = (c: HasColor, time: number, easeFunc = easeLinearNone) => interpolate(0, 1, time, (v) => c.color = fade(c.color, 1-v), easeFunc)