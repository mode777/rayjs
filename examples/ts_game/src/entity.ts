
export interface HasIdentity {
    id: number
}

export interface Drawable<T> {
    draw: (entity: T) => void
}

export interface Updatable<T> {
    update: (entity: T) => void
}

export interface HasResources<T> {
    load: (entity: T) => void
    unload: (entity: T) => void
}

export interface HasPosition {
    position: Vector2
}

export interface HasColor {
    color: Color
}

export type EntityOf<T> = HasIdentity & Partial<HasResources<EntityOf<T>>> & Partial<Updatable<EntityOf<T>>> & Partial<Drawable<EntityOf<T>>> & T

let ID = 0
export const makeEntity = () => ({
    id: ID++
})

export const makePosition = (x = 0, y = 0) => ({
    position: new Vector2(x, y)
})

export const makeColorRgb = (r = 255, g = 255, b = 255, a = 255) => ({
    color: new Color(r, g, b, a)
})

export const makeColorClone = (c = WHITE) => ({
    color: new Color(c.r, c.g, c.b, c.a)
})



