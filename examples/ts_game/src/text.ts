import { EntityOf, HasColor, HasPosition, makeColorRgb, makeEntity, makePosition } from "./entity"

export interface Text extends HasPosition, HasColor {
    text: string,
    font: Font,
    size: number,
    spacing: number
}

export interface TextEntity extends EntityOf<Text> {
    type: "text"
}

export const makeText = (text = "", size = 20, font = null, spacing = 1) => (<Text>{
    ...makePosition(),
    ...makeColorRgb(),
    text: text,
    font: font === null ? getFontDefault() : loadFont(font),
    size: size,
    spacing: spacing
})

export const textDraw = (t: Text) => {
    return drawTextEx(t.font, t.text, t.position, t.size, t.spacing, t.color);
}

export const makeTextEntity = (text: string = "") => (<TextEntity>{
    ...makeEntity(),
    ...makeText(text),
    type: "text",
    draw: textDraw,
})


