import { Behaviour, Builder, Creator, Entity, HasBoundingBox, HasMouseInteraction, HasPosition, HasSize, combine, hasDefault, hasDefaultFn, makeEntity, which, withBoundingBox, withComponent, withMouseInteraction, withPosition, withSize } from "./entity"
import { entityAdd, gameRun, gameSetClearColor } from "./game"
import { HasText, withText } from "./text"

const withGuiSize = withComponent<HasSize>(x => hasDefaultFn(x, 'size', () => new Vector2(100,20)))

type UiControl = Entity & HasPosition & HasSize
const makeControl = combine(makeEntity, withPosition, withSize)

type Button = Entity & HasPosition & HasSize & HasMouseInteraction & HasText
const drawsButton: Behaviour<Button> = {
    draw: x => {
        x.isClicked = guiButton(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text)
        if(x.isClicked && x.onClick) x.onClick()
    }
}
const makeButton: Builder<Button> = combine(
    makeEntity, 
    withPosition,
    withSize, 
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
type Textbox = Entity & HasPosition & HasSize & HasText & HasActive & HasChangedEvent
const drawsTextbox: Behaviour<Textbox> = {
    draw: x => {
        if(guiTextBox(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x, x.active)){
            x.active = !x.active
            if(!x.active && x.onChange) x.onChange() 
        } 
    }
}
const makeTextbox: Builder<Textbox> = combine(makeEntity, 
    withGuiBounds, 
    withText,
    withActive, 
    withChangedEvent, 
    which(drawsTextbox))
type CheckBox = Entity & HasBoundingBox & HasText & HasActive & HasChangedEvent
const drawsCheckbox: Behaviour<CheckBox> = {
    draw: c => {
        const old = c.active
        c.active = guiCheckBox(c.boundingBox, c.text, c.active)
        if(old != c.active && c.onChange) c.onChange()
    }
}
const makeCheckbox: Builder<CheckBox> = combine(makeEntity, 
    withGuiBounds, 
    withText,
    withActive, 
    withChangedEvent, 
    which(drawsCheckbox))

type Label = Entity & HasBoundingBox & HasText
const drawsLabel: Behaviour<Label> = { draw: c => guiLabel(c.boundingBox, c.text) }
const makeLabel: Builder<Label> = combine(makeEntity, withGuiBounds, withText, which(drawsLabel))

type WindowBox = Entity & HasBoundingBox & HasText
const drawsWindowBox: Behaviour<WindowBox> = { draw: c => guiWindowBox(c.boundingBox, c.text) }
const builderWindowBox: Builder<WindowBox> = combine(makeEntity, withGuiBounds, withText, which(drawsWindowBox))

type GroupBox = Entity & HasBoundingBox & HasText
const drawsGroupBox: Behaviour<WindowBox> = { draw: c => guiGroupBox(c.boundingBox, c.text) }
const makeGroupBox: Builder<GroupBox> = combine(makeEntity, withGuiBounds, withText, which(drawsGroupBox))

type Line = Entity & HasBoundingBox & HasText
const drawsLine: Behaviour<Line> = { draw: c => guiLine(c.boundingBox, c.text) }
const makeLine: Builder<Line> = combine(makeEntity, withGuiBounds, withText, which(drawsLine))

type Panel = Entity & HasBoundingBox & HasText
const drawsPanel: Behaviour<Panel> = { draw: c => guiPanel(c.boundingBox, c.text) }
const makePanel: Builder<Panel> = combine(makeEntity, withGuiBounds, withText, which(drawsPanel))

interface HasScrollView {
    contentArea: Rectangle,
    scroll: Vector2,
    viewArea: Rectangle
}
const withScrollView = withComponent<HasScrollView & HasBoundingBox>(x => {
    hasDefaultFn(x, 'contentArea', () => new Rectangle(x.boundingBox!.x, x.boundingBox!.y, x.boundingBox!.width, x.boundingBox!.height))
    hasDefaultFn(x, 'viewArea', () => new Rectangle(x.boundingBox!.x, x.boundingBox!.y, x.boundingBox!.width, x.boundingBox!.height))
    hasDefaultFn(x, 'scroll', () => new Vector2(0,0))
})
type ScrollPanel = Entity & HasBoundingBox & Partial<HasText> & HasScrollView
const drawsScrollView: Behaviour<ScrollPanel> = {
    draw: s => {
        s.viewArea = guiScrollPanel(s.boundingBox, s.text, s.contentArea, s.scroll)
    }
}
const makeScollPanel: Builder<ScrollPanel>  = combine(makeEntity, withComponent<Partial<HasText>>(), withGuiBounds, withScrollView, )

interface HasGuiGlobalState {}
type GuiGlobalState = Entity & HasGuiGlobalState
const appliesGuiGlobalState: Behaviour<GuiGlobalState> = {
    update: g => gameSetClearColor(getColor(guiGetStyle(DEFAULT, BACKGROUND_COLOR)))
}
const guiState: GuiGlobalState = combine(makeEntity,withComponent<HasGuiGlobalState>(), which(appliesGuiGlobalState))({})



gameRun({ width: 800, height: 600, title: 'My Editor', flags: FLAG_WINDOW_RESIZABLE }, async (quit) => {
    const but = makeButton({
        text: 'Click Me!',
        onClick: () => but.boundingBox.x += 20
    })
    const tb = makeTextbox({
        text: but.text,
        boundingBox: new Rectangle(10, 50, 100, 20),
        onChange: () => but.text = tb.text
    })
    const cb = makeCheckbox({
        boundingBox: new Rectangle(10, 75, 20, 20),
        text: "Check Me!",
        onChange: () => cb.text = "Checkbox is "+ (cb.active ? "checked" : "not checked")
    })
    const l = makeLabel({
        boundingBox: new Rectangle(10, 100, 100, 20),
        text: "This is a label"
    })
    entityAdd(guiState)
    entityAdd(but)
    entityAdd(tb)
    entityAdd(cb)
    entityAdd(l)
})
