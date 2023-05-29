import { makeText } from "./text"

export type Creator<A,B> = (objIn: A) => B 
export type Builder<A> = Creator<Partial<A>, A> 
export type Extender<A,B> = Creator<A & Partial<B>, B> 

export function makeCombined<A>(fn1: Builder<A>): Builder<A> 
export function makeCombined<A,B>(fn1: Builder<A>, fn2: Extender<A,B>): Builder<A&B> 
export function makeCombined<A,B,C>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>): Builder<A&B&C> 
export function makeCombined<A,B,C,D>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>): Builder<A&B&C&D> 
export function makeCombined<A,B,C,D,E>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>, fn5: Extender<A&B&C&D,E>): Builder<A&B&C&D&E> 
export function makeCombined<A,B,C,D,E,F>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>, fn5: Extender<A&B&C&D,E>, fn6: Extender<A&B&C&D&E,F>): Builder<A&B&C&D&E&F> 
export function makeCombined<A,B,C,D,E,F>(fn1: Builder<A>, fn2?: Extender<A,B>, fn3?: Extender<A&B,C>, fn4?: Extender<A&B&C,D>, fn5?: Extender<A&B&C&D,E>, fn6?: Extender<A&B&C&D&E,F>): Builder<A> | Builder<A&B> | Builder<A&B&C> | Builder<A&B&C&D> | Builder<A&B&C&D&E> | Builder<A&B&C&D&E&F> 
{
    if(fn2 && fn3 && fn4 && fn5 && fn6) return makeCombined(makeCombined(fn1, fn2, fn3, fn4, fn5), fn6)
    if(fn2 && fn3 && fn4 && fn5) return makeCombined(makeCombined(fn1, fn2, fn3, fn4), fn5)
    if(fn2 && fn3 && fn4) return makeCombined(makeCombined(fn1, fn2, fn3), fn4)
    if(fn2 && fn3) return makeCombined(makeCombined(fn1, fn2), fn3)
    if(fn2) return (objIn: Partial<A&B>) => <A&B>fn2(<A&Partial<B>>fn1(objIn))
    return fn1
}

export interface HasIdentity {
    id: number
}

export interface HasPosition {
    position: Vector2
}

export interface HasColor {
    color: Color
}

export interface HasBoundingBox {
    boundingBox: Rectangle
}

export interface Behaviour<T> {
    load?: (entity: T) => void,
    unload?: (entity: T) => void,
    update?: (entity: T) => void,
    draw?: (entity: T) => void
}

export function addBehaviour<T extends HasBehaviour>(obj: T, behaviour: Behaviour<T>){
    obj.behaviours.push(behaviour)
}
export function removeBehaviour<T extends HasBehaviour>(obj: T, behaviour: Behaviour<T>){
    const idx = obj.behaviours.findIndex(x => x === behaviour)
    if(idx !== -1) obj.behaviours.splice(idx, 1)
}

export interface HasBehaviour {
    behaviours: Behaviour<any>[]
}

export type Entity = HasIdentity & HasBehaviour
export type EntityOf<T> = Entity & T

export const setPropFn = <T>(obj: T, key: keyof T, valueFn: () => any) => { if(obj[key] === undefined) obj[key] = valueFn() }
export const setProp = <T>(obj: T, key: keyof T, value: any) => { if(obj[key] === undefined) obj[key] = value }

let ID = 0

export const makeIdentity = (obj: Partial<HasIdentity>) => {
    setPropFn(obj, 'id', () => ID++)
    return <HasIdentity>obj
}

export const makeBehaviour = (obj: Partial<HasBehaviour>) => {
    setPropFn(obj, 'behaviours', () => [])
    return <HasBehaviour>obj
}

export const makeEntity: Builder<Entity> = makeCombined(makeIdentity, makeBehaviour)

export const makePosition = (obj: Partial<HasPosition>,x = 0, y = 0) => {
    setPropFn(obj, 'position', () => new Vector2(x,y))
    return <HasPosition>obj
}

export const makeColorRgb = (obj: Partial<HasColor>, r = 255, g = 255, b = 255, a = 255) => {
    setPropFn(obj, 'color', () => new Color(r, g, b, a))
    return <HasColor>obj
}

export const makeColor = (obj: Partial<HasColor>, c = WHITE) => {
    setPropFn(obj, 'color', () => new Color(c.r, c.g, c.b, c.a))
    return <HasColor>obj
}

export const makeBoundingBox = (obj: Partial<HasBoundingBox>, x = 0, y = 0, width = 0, height = 0) => {
    setPropFn(obj, 'boundingBox', () => new Rectangle(x,y,width,height))
    return <HasBoundingBox>obj
}

export const debugRectDrawFn = (obj: HasBoundingBox, color = GREEN) => drawRectangleLines(obj.boundingBox.x, obj.boundingBox.y, obj.boundingBox.width, obj.boundingBox.height, color)
export const debugRectDrawBehaviour = { draw: debugRectDrawFn }

export interface Clickable extends HasBoundingBox, HasBehaviour {
    isClicked: boolean
    hasMouseOver: boolean,
    hasMouseEntered: boolean,
    hasMouseLeft: boolean
    debugClickable: boolean
}
export const clickableBehaviour: Behaviour<Clickable> = { 
    update: (obj: Clickable) => {
        const over = checkCollisionPointRec(getMousePosition(), obj.boundingBox)
        obj.hasMouseEntered = !obj.hasMouseOver && over
        obj.hasMouseLeft = obj.hasMouseOver && !over
        obj.hasMouseOver = over
        obj.isClicked = obj.hasMouseOver && isMouseButtonPressed(MOUSE_BUTTON_LEFT)
        if(obj.hasMouseEntered) setMouseCursor(MOUSE_CURSOR_POINTING_HAND)
        if(obj.hasMouseLeft) setMouseCursor(MOUSE_CURSOR_DEFAULT)
    },
    draw: (obj: Clickable) => {
        if(obj.debugClickable){
            debugRectDrawFn(obj, obj.hasMouseOver ? RED : GREEN)
            drawCircle(getMouseX(), getMouseY(), 10, YELLOW)
        }
    },
    unload: obj => setMouseCursor(MOUSE_CURSOR_DEFAULT)
}
export const makeClickable: Builder<Clickable> = makeCombined(makeBehaviour, makeBoundingBox, (obj: HasBehaviour & HasBoundingBox & Partial<Clickable>) => {
    setProp(obj, 'hasMouseOver', false)
    setProp(obj, 'isClicked', false)
    setProp(obj, 'hasMouseEntered', false)
    setProp(obj, 'hasMouseLeft', false)
    setProp(obj, 'debugClickable', false)
    addBehaviour(<Clickable>obj, clickableBehaviour)
    return <Clickable>obj
})




