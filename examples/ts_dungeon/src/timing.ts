import { makeUpdateablePromise } from "./promise-extensions"

export type easeFunc = (t: number, a: number, b: number, d: number) => number

export const interpolate = (a: number, b: number, d: number, setter: (v: number) => void, fn: easeFunc) => {
    const start = getTime()
    const delta = b - a
    return makeUpdateablePromise<void>(ctx => {
        const cur = getTime()-start
        if(cur < d && !ctx.isCancellationRequested){
            setter(fn(cur, a, delta, d))
        } else {
            setter(b)
            ctx.resolve()
        }
    })
}
export const interpolateVec2 = (a: Vector2, b: Vector2, d: number, setter: (v: Vector2) => void, fn: easeFunc) => {
    const start = getTime()
    const delta = vector2Subtract(b, a)
    return makeUpdateablePromise<void>(ctx => {
        const cur = getTime()-start
        if(cur < d && !ctx.isCancellationRequested){
            const x = fn(cur, a.x, delta.x, d)
            const y = fn(cur, a.y, delta.y, d)
            setter(new Vector2(x,y))
        } else {
            setter(b)
            ctx.resolve()
        }
    })
}
export const interpolateVec3 = (a: Vector3, b: Vector3, d: number, setter: (v: Vector3) => void, fn: easeFunc) => {
    const start = getTime()
    const delta = vector3Subtract(b, a)
    return makeUpdateablePromise<void>(ctx => {
        const cur = getTime()-start
        if(cur < d && !ctx.isCancellationRequested){
            const x = fn(cur, a.x, delta.x, d)
            const y = fn(cur, a.y, delta.y, d)
            const z = fn(cur, a.z, delta.z, d)
            setter(new Vector3(x,y,z))
        } else {
            setter(b)
            ctx.resolve()
        }
    })
}

export const waitCondition = (predicate: () => boolean) => makeUpdateablePromise<void>(ctx => {
    if(predicate() || ctx.isCancellationRequested){
        ctx.resolve()
    }
})
export const waitFirst = <T>(list: T[], predicate: (item: T) => boolean) => makeUpdateablePromise<number>(ctx => {
    let idx = list.findIndex(x => predicate(x))
    if(idx !== -1 || ctx.isCancellationRequested) ctx.resolve(idx)
})


export const wait = (time: number) => {
    const start = getTime()
    return waitCondition(() => (getTime()-start) >= time)
} 

export const waitKeyPressed = (key: number) => waitCondition(() => isKeyPressed(key))
export const waitClick = (button: number = MOUSE_BUTTON_LEFT) => waitCondition(() => isMouseButtonDown(button))