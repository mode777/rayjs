import { makeInlineText } from "./text"

export interface Behaviour<T> {
    load?: (entity: T) => void,
    unload?: (entity: T) => void,
    update?: (entity: T) => void,
    beforeDraw?: (entity: T) => void
    draw?: (entity: T) => void
    afterDraw?: (entity: T) => void
}

export function addBehaviour<T extends HasBehaviour>(obj: T, behaviour: Behaviour<T>){
    obj.behaviours.push(behaviour)
}
export function removeBehaviour<T extends HasBehaviour>(obj: T, behaviour: Behaviour<T>){
    const idx = obj.behaviours.findIndex(x => x === behaviour)
    if(idx !== -1) obj.behaviours.splice(idx, 1)
}

export type Creator<A,B> = (objIn: A) => B 
export type Builder<A> = Creator<Partial<A>, A> 
export type Extender<A,B> = Creator<A & Partial<B>, B> 

export function combine<A>(fn1: Builder<A>): Builder<A> 
export function combine<A,B>(fn1: Builder<A>, fn2: Extender<A,B>): Builder<A&B> 
export function combine<A,B,C>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>): Builder<A&B&C> 
export function combine<A,B,C,D>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>): Builder<A&B&C&D> 
export function combine<A,B,C,D,E>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>, fn5: Extender<A&B&C&D,E>): Builder<A&B&C&D&E> 
export function combine<A,B,C,D,E,F>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>, fn5: Extender<A&B&C&D,E>, fn6: Extender<A&B&C&D&E,F>): Builder<A&B&C&D&E&F> 
export function combine<A,B,C,D,E,F,G>(fn1: Builder<A>, fn2: Extender<A,B>, fn3: Extender<A&B,C>, fn4: Extender<A&B&C,D>, fn5: Extender<A&B&C&D,E>, fn6: Extender<A&B&C&D&E,F>, fn7: Extender<A&B&C&D&E&F,G>): Builder<A&B&C&D&E&F&G> 
export function combine<A,B,C,D,E,F,G>(fn1: Builder<A>, fn2?: Extender<A,B>, fn3?: Extender<A&B,C>, fn4?: Extender<A&B&C,D>, fn5?: Extender<A&B&C&D,E>, fn6?: Extender<A&B&C&D&E,F>, fn7?: Extender<A&B&C&D&E&F,G>): Builder<A> | Builder<A&B> | Builder<A&B&C> | Builder<A&B&C&D> | Builder<A&B&C&D&E> | Builder<A&B&C&D&E&F> | Builder<A&B&C&D&E&F&G> 
{
    if(fn2 && fn3 && fn4 && fn5 && fn6 && fn7) return combine(combine(fn1, fn2, fn3, fn4, fn5, fn6), fn7)
    if(fn2 && fn3 && fn4 && fn5 && fn6) return combine(combine(fn1, fn2, fn3, fn4, fn5), fn6)
    if(fn2 && fn3 && fn4 && fn5) return combine(combine(fn1, fn2, fn3, fn4), fn5)
    if(fn2 && fn3 && fn4) return combine(combine(fn1, fn2, fn3), fn4)
    if(fn2 && fn3) return combine(combine(fn1, fn2), fn3)
    if(fn2) return (objIn: Partial<A&B> = {}) => <A&B>fn2(<A&Partial<B>>fn1(objIn))
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

export interface HasSize {
    size: Vector2
}

export interface HasBehaviour {
    behaviours: Behaviour<any>[]
}

export type Entity = HasIdentity & HasBehaviour
export type EntityOf<T> = Entity & T

export const hasDefaultFn = <T>(obj: T, key: keyof T, valueFn: () => any) => { if(obj[key] === undefined) obj[key] = valueFn() }
export const hasDefault = <T>(obj: T, key: keyof T, value: any) => { if(obj[key] === undefined) obj[key] = value }

export const withComponent = <T>(fn?: (obj: Partial<T>) => void) => (obj: Partial<T>) => { if(fn){fn(obj)}; return <T>obj }
export const which = <T extends HasBehaviour>(behaviour: Behaviour<T>) => (obj: T) => { addBehaviour(obj,behaviour); return obj; }
let ID = 0
export const withIdentity = withComponent<HasIdentity>(x => hasDefaultFn(x,'id', () => ID++))
export const withBehaviour = withComponent<HasBehaviour>(x => hasDefaultFn(x, 'behaviours', () => []))
export const withPosition = withComponent<HasPosition>(x => hasDefaultFn(x, 'position', () => new Vector2(0,0)))
export const withSize = withComponent<HasSize>(x => hasDefaultFn(x, 'size', () => new Vector2(0,0)))
export const withColor = withComponent<HasColor>(x => hasDefaultFn(x, 'color', () => new Color(255,255,255,255)))
export const withBoundingBox = withComponent<HasBoundingBox>(x => hasDefaultFn(x, 'boundingBox', () => new Rectangle(0,0,0,0)))

export const makeEntity: Builder<Entity> = combine(withIdentity, withBehaviour)

export const debugRectDrawFn = (obj: HasBoundingBox, color = GREEN) => drawRectangleLines(obj.boundingBox.x, obj.boundingBox.y, obj.boundingBox.width, obj.boundingBox.height, color)
export const debugRectDrawBehaviour = { draw: debugRectDrawFn }

export interface HasMouseInteraction {
    isClicked: boolean
    hasMouseOver: boolean,
    hasMouseEntered: boolean,
    hasMouseLeft: boolean
    debugClickable: boolean,
    onClick?: () => void
}
export const withMouseInteraction = withComponent<HasMouseInteraction>()
export const checksBoundingBoxClicks: Behaviour<HasMouseInteraction&HasBoundingBox> = { 
    update: obj => {
        const over = checkCollisionPointRec(getMousePosition(), obj.boundingBox)
        obj.hasMouseEntered = !obj.hasMouseOver && over
        obj.hasMouseLeft = obj.hasMouseOver && !over
        obj.hasMouseOver = over
        obj.isClicked = obj.hasMouseOver && isMouseButtonPressed(MOUSE_BUTTON_LEFT)
        if(obj.hasMouseEntered) setMouseCursor(MOUSE_CURSOR_POINTING_HAND)
        if(obj.hasMouseLeft) setMouseCursor(MOUSE_CURSOR_DEFAULT)
    },
    draw: obj => {
        if(obj.debugClickable){
            debugRectDrawFn(obj, obj.hasMouseOver ? RED : GREEN)
            drawCircle(getMouseX(), getMouseY(), 10, YELLOW)
        }
    },
    unload: obj => obj.hasMouseOver && setMouseCursor(MOUSE_CURSOR_DEFAULT)
}




