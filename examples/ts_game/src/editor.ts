import { Behaviour, Builder, Entity, HasBoundingBox, HasMouseInteraction, combine, hasDefault, hasDefaultFn, makeEntity, which, withBoundingBox, withComponent, withMouseInteraction } from "./entity"
import { entityAdd, runGame } from "./game"
import { HasText, withText } from "./text"

const withGuiBounds = withComponent<HasBoundingBox>(x => hasDefaultFn(x, 'boundingBox', () => new Rectangle(10,10,100,20)))

type Button = Entity & HasBoundingBox & HasMouseInteraction & HasText
const drawsButton: Behaviour<Button> = {
    draw: b => {
        b.isClicked = guiButton(b.boundingBox, b.text)
        if(b.isClicked && b.onClick) b.onClick()
    }
}
const makeButton: Builder<Button> = combine(
    makeEntity, 
    withGuiBounds, 
    withMouseInteraction, 
    withComponent<HasText>(x => hasDefault(x, 'text', 'Button')), 
    which(drawsButton))

interface HasActive {
    active: boolean
}
const withActive = withComponent<HasActive>(x => hasDefault(x,'active',false))
interface HasChangedEvent {
    onChange?: () => void
}
const withChangedEvent = withComponent<HasChangedEvent>()
type Textbox = Entity & HasBoundingBox & HasText & HasActive & HasChangedEvent
const drawsTextbox: Behaviour<Textbox> = {
    draw: t => {
        if(guiTextBox(t.boundingBox, t, t.active)){
            t.active = !t.active
            if(!t.active && t.onChange) t.onChange() 
        } 
    }
}
const makeTextbox = combine(makeEntity, 
    withGuiBounds, 
    withComponent<HasText>(x => hasDefault(x, 'text', '')), 
    withActive, 
    withChangedEvent, 
    which(drawsTextbox))


runGame({ width: 800, height: 600, title: 'My Editor', flags: FLAG_WINDOW_RESIZABLE }, async (quit) => {
    const but = makeButton({
        text: 'Click Me!',
        onClick: () => but.boundingBox.x += 20
    })
    const tb = makeTextbox({
        text: but.text,
        boundingBox: new Rectangle(10, 50, 100, 20),
        onChange: () => but.text = tb.text
    })
    entityAdd(but)
    entityAdd(tb)
})
