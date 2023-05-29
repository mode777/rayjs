import { Behaviour, Clickable, Entity, EntityOf, HasBehaviour, HasBoundingBox, HasColor, HasPosition, addBehaviour, makeBehaviour, makeBoundingBox, makeClickable, makeColor, makeColorRgb, makeCombined, makeEntity, makePosition, removeBehaviour, setProp, setPropFn } from "./entity"
import { fontLoad, resourceUnload, textureLoad } from "./resource"

// FONT
export interface HasFont extends HasBehaviour, HasColor {
    font?: string,
    fontSize: number,
    fontSpacing: number
    fontResource?: Font
    fontResourceId?: string
}
export const fontLoadBehaviour: Behaviour<HasFont> = {
    load: t => {
        t.fontResourceId = t.font ? t.font + ":" + t.fontSize : undefined
        t.fontResource = (t.font ? fontLoad(t.fontResourceId!) : getFontDefault())
    },
    unload: t => t.font ? resourceUnload(t.fontResourceId!) : undefined
}
export const makeFont = makeCombined(makeBehaviour, makeColor, (obj: HasBehaviour & Partial<HasFont>) => {
    setProp(obj, 'font', undefined)
    setProp(obj, 'fontSize', 20)
    setProp(obj, 'fontSpacing', 1)
    addBehaviour(<HasFont>obj, fontLoadBehaviour)
    return <HasFont>obj
})

// TEXT
export interface Text extends Entity, HasFont, HasPosition {
    text: string,
}
export const makeText = makeCombined(makeEntity, makeFont, makePosition, (obj: Partial<Text>) => {
    setProp(obj, 'text', "")
    addBehaviour(<Text>obj, textBehaviour)
    return <Text>obj
})
export const textDrawFn = (t: Text, text?: string, position?: Vector2) => drawTextEx(t.fontResource!, text ?? t.text, position ?? t.position, t.fontSize, t.fontSpacing, t.color);
export const textBehaviour: Behaviour<Text> = {
    draw: textDrawFn
}

// PARAGRAPH
export interface Line {
    text: string,
    width: number
}
export interface Paragraph extends Text {
    lines: Line[],
    maxWidth: number,
    _textCached: string
}
export const breakTextLinesFn = (p: Paragraph) => {
    const words = p.text.split(" ");
    const lines: Line[] = [];
    let currentLine = words[0];

    let lastw = 0;
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = measureTextEx(p.fontResource!, currentLine + " " + word, p.fontSize, p.fontSpacing).x
        if (width < p.maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push({ text: currentLine, width: lastw });
            currentLine = word;
            //lastw = width;
        }
        lastw = width;
        if (i === words.length - 1)
            lastw = measureTextEx(p.fontResource!, currentLine, p.fontSize, p.fontSpacing).x;
    }
    if (words.length === 1) lastw = measureTextEx(p.fontResource!, currentLine, p.fontSize, p.fontSpacing).x
    lines.push({ text: currentLine, width: lastw });
    return lines;
}
export const paragraphBehaviour: Behaviour<Paragraph> = {
    update: p => {
        if (p._textCached !== p.text) {
            p.lines = breakTextLinesFn(p)
            p._textCached = p.text
        }
    },
    draw: p => {
        const v2 = new Vector2(p.position.x, p.position.y)
        for (const line of p.lines) {
            textDrawFn(p, line.text, v2)
            v2.y += p.fontSize
        }
    }
}
export const makeParagraph = makeCombined(makeText, (obj: Partial<Paragraph>) => {
    setProp(obj, 'lines', [])
    setProp(obj, 'maxWidth', 100)
    setProp(obj, "_textCached", "")
    removeBehaviour(<Paragraph>obj, textBehaviour)
    addBehaviour(<Paragraph>obj, paragraphBehaviour)
    return <Paragraph>obj
})

// CLICKABLE TEXT
export interface ClickableText extends Text, Clickable {
    underlineWidth: number
}
export const calcTextBoundsFn = (obj: Text & HasBoundingBox) => {
    const rec = obj.boundingBox = new Rectangle(obj.position.x, obj.position.y, 0, 0)
    if (obj.fontResource) {
        const size = measureTextEx(obj.fontResource!, obj.text, obj.fontSize, obj.fontSpacing)
        rec.width = size.x
        rec.height = size.y
    }
    obj.boundingBox = rec
}
export const clickableTextBehaviour: Behaviour<ClickableText> = {
    load: calcTextBoundsFn,
    draw: t => t.hasMouseOver ? drawRectangle(t.boundingBox.x, t.boundingBox.y + t.boundingBox.height, t.boundingBox.width, t.underlineWidth, t.color) : undefined
}
export const makeClickableText = makeCombined(makeText, makeClickable, (obj: Entity & Clickable & Partial<ClickableText>) => {
    setProp(obj, 'underlineWidth', 1)
    addBehaviour(<ClickableText>obj, clickableTextBehaviour)
    return <ClickableText>obj
})
