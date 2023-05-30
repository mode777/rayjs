import { Behaviour, HasMouseInteraction, Entity, HasBehaviour, HasBoundingBox, HasColor, HasPosition, withBehaviour, withBoundingBox, withColor, combine, makeEntity, withPosition, hasDefault, which, withComponent, Builder, withMouseInteraction, checksBoundingBoxClicks } from "./entity"
import { fontLoad, resourceUnload } from "./resource"

// FONT
export interface HasFont {
    font?: string,
    fontSize: number,
    fontSpacing: number
    fontResource?: Font
    fontResourceId?: string
}
export const loadsFont: Behaviour<HasFont> = {
    load: t => {
        t.fontResourceId = t.font ? t.font + ":" + t.fontSize : undefined
        t.fontResource = (t.font ? fontLoad(t.fontResourceId!) : getFontDefault())
    },
    unload: t => t.font ? resourceUnload(t.fontResourceId!) : undefined
}
export const withFont = combine(withBehaviour, withComponent<HasFont>(x => {
    hasDefault(x, 'fontSize', 20)
    hasDefault(x, 'fontSpacing', 1)
}), which<HasFont&HasBehaviour>(loadsFont))

// TEXT
export interface HasText {
    text: string
}
export const textDrawFn = (t: Text, text?: string, position?: Vector2) => drawTextEx(t.fontResource!, text ?? t.text, position ?? t.position, t.fontSize, t.fontSpacing, t.color);
export const withText = withComponent<Text>(x => hasDefault(x,'text', ''))
export type Text = Entity & HasFont & HasPosition & HasColor & HasText
export const makeText: Builder<Text> = combine(makeEntity, withFont, withPosition, withColor, withText)

// INLINE TEXT
export type InlineText = Entity & Text
export const drawsInlineText: Behaviour<InlineText> = {
    draw: textDrawFn
}
export const makeInlineText: Builder<InlineText> = combine(makeText, which(drawsInlineText))

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
export const drawsParagraph: Behaviour<Paragraph> = {
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
export const makeParagraph = combine(makeText, withComponent<Paragraph>(obj => {
    hasDefault(obj, 'lines', [])
    hasDefault(obj, 'maxWidth', 100)
    hasDefault(obj, "_textCached", "")
}), which(drawsParagraph))

// CLICKABLE TEXT
export interface HasTextDecoration {
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
export type ClickableText = InlineText & HasMouseInteraction & HasTextDecoration & HasBoundingBox
export const drawsClickableText: Behaviour<ClickableText> = {
    load: calcTextBoundsFn,
    draw: t => t.hasMouseOver ? drawRectangle(t.boundingBox.x, t.boundingBox.y + t.boundingBox.height, t.boundingBox.width, t.underlineWidth, t.color) : undefined
}
export const makeClickableText: Builder<ClickableText> = combine(makeInlineText, 
    withBoundingBox,
    withMouseInteraction, 
    withComponent<HasTextDecoration>(obj => hasDefault(obj,'underlineWidth',1)),
    which<ClickableText>(checksBoundingBoxClicks), 
    which(drawsClickableText))
