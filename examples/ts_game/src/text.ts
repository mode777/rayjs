import { EntityOf, HasColor, HasPosition, makeColorRgb, makeEntity, makePosition } from "./entity"
import { fontLoad, resourceUnload } from "./resource"

export interface Text extends HasPosition, HasColor {
    text: string,
    font?: string,
    size: number,
    spacing: number
}

export interface TextEntity extends EntityOf<Text> {
    type: "text"
    fontResource?: Font
}

export const makeText = (text = "", size = 20, font: string | null = null, spacing = 1) => (<Text>{
    ...makePosition(),
    ...makeColorRgb(),
    text: text,
    font: font,
    size: size,
    spacing: spacing
})

export const textDrawFn = (t: TextEntity) => drawTextEx(t.fontResource!, t.text, t.position, t.size, t.spacing, t.color);
export const textLoadFn = (t: TextEntity) => {
    t.fontResource = (t.font ? fontLoad(t.font) : getFontDefault())
    return
}
export const textUnloadFn = (t: TextEntity) => t.font ? resourceUnload(t.font) : undefined

export const makeTextEntity = (text: string = "") => (<TextEntity>{
    ...makeEntity(),
    ...makeText(text),
    type: "text",
    draw: textDrawFn,
    load: textLoadFn,
    unload: textUnloadFn
})


