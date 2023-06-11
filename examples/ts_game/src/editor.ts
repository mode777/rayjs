import { Behaviour, Builder, Creator, Entity, HasBehaviour, HasBoundingBox, HasMouseInteraction, HasPosition, HasSize, combine, hasDefault, hasDefaultFn, makeEntity, which, withBehaviour, withBoundingBox, withComponent, withMouseInteraction, withPosition, withSize } from "./entity"
import { entityAdd, gameRun, gameSetClearColor } from "./game"
import { resourceUnload, textureLoad } from "./resource"
import { HasText, withText } from "./text"

const withGuiSize = withComponent<HasSize>(x => hasDefaultFn(x, 'size', () => new Vector2(100,20)))

type UiControl = Entity & HasPosition & HasSize
const makeControl = combine(makeEntity, withPosition, withGuiSize)

type Button = UiControl & HasMouseInteraction & HasText
const drawsButton: Behaviour<Button> = {
    draw: x => {
        x.isClicked = guiButton(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text)
        if(x.isClicked && x.onClick) x.onClick()
    }
}
const makeButton: Builder<Button> = combine(
    makeControl, 
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
type Textbox = UiControl & HasText & HasActive & HasChangedEvent
const drawsTextbox: Behaviour<Textbox> = {
    draw: x => {
        if(guiTextBox(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x, x.active)){
            x.active = !x.active
            if(!x.active && x.onChange) x.onChange() 
        } 
    }
}
const makeTextbox: Builder<Textbox> = combine(
    makeControl,
    withText,
    withActive, 
    withChangedEvent, 
    which(drawsTextbox))
type CheckBox = UiControl & HasText & HasActive & HasChangedEvent
const drawsCheckbox: Behaviour<CheckBox> = {
    draw: x => {
        const old = x.active
        x.active = guiCheckBox(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text, x.active)
        if(old != x.active && x.onChange) x.onChange()
    }
}
const makeCheckbox: Builder<CheckBox> = combine(
    makeControl,
    withText,
    withActive, 
    withChangedEvent, 
    which(drawsCheckbox))

type Label = UiControl & HasText
const drawsLabel: Behaviour<Label> = { draw: x => guiLabel(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text) }
const makeLabel: Builder<Label> = combine(makeControl, withText, which(drawsLabel))

type WindowBox = UiControl & HasText
const drawsWindowBox: Behaviour<WindowBox> = { draw: x => guiWindowBox(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text) }
const builderWindowBox: Builder<WindowBox> = combine(makeControl, withText, which(drawsWindowBox))

type GroupBox = UiControl & HasText
const drawsGroupBox: Behaviour<WindowBox> = { draw: x => guiGroupBox(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text) }
const makeGroupBox: Builder<GroupBox> = combine(makeControl, withText, which(drawsGroupBox))

type Line = UiControl & HasText
const drawsLine: Behaviour<Line> = { draw: x => guiLine(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text) }
const makeLine: Builder<Line> = combine(makeControl, withText, which(drawsLine))

type Panel = UiControl & HasText
const drawsPanel: Behaviour<Panel> = { draw: x => guiPanel(new Rectangle(x.position.x,x.position.y,x.size.x, x.size.y), x.text) }
const makePanel: Builder<Panel> = combine(makeControl, withText, which(drawsPanel))

// interface HasScrollView {
//     contentArea: Rectangle,
//     scroll: Vector2,
//     viewArea: Rectangle
// }
// const withScrollView = withComponent<HasScrollView & HasPosition & HasSize>(x => {
//     hasDefaultFn(x, 'contentArea', () => new Rectangle(x.boundingBox!.x, x.boundingBox!.y, x.boundingBox!.width, x.boundingBox!.height))
//     hasDefaultFn(x, 'viewArea', () => new Rectangle(x.boundingBox!.x, x.boundingBox!.y, x.boundingBox!.width, x.boundingBox!.height))
//     hasDefaultFn(x, 'scroll', () => new Vector2(0,0))
// })
// type ScrollPanel = UiControl & Partial<HasText> & HasScrollView
// const drawsScrollView: Behaviour<ScrollPanel> = {
//     draw: s => {
//         s.viewArea = guiScrollPanel(s.boundingBox, s.text, s.contentArea, s.scroll)
//     }
// }
// const makeScollPanel: Builder<ScrollPanel>  = combine(makeEntity, withComponent<Partial<HasText>>(), withGuiBounds, withScrollView, )

// interface HasChildControls {
//     controls: UiControl[]
// }
// const withChildControls = withComponent<HasChildControls>(x => hasDefault(x, 'controls', []))

// type StackPanel = UiControl & HasChildControls
// const drawsStackLayout: Behaviour<StackPanel> = {
//     update: x => {

//     }
// }
// const makeStackPanel = combine(makeControl, withChildControls)

interface HasGuiGlobalState {}
type GuiGlobalState = Entity & HasGuiGlobalState
const appliesGuiGlobalState: Behaviour<GuiGlobalState> = {
    update: g => gameSetClearColor(getColor(guiGetStyle(DEFAULT, BACKGROUND_COLOR)))
}
const guiState: GuiGlobalState = combine(makeEntity,withComponent<HasGuiGlobalState>(), which(appliesGuiGlobalState))({})

interface HasTexture {
    texture: string,
    textureResource: Texture
}
const loadsTexture: Behaviour<HasTexture> = {
    load: x => x.textureResource = textureLoad(x.texture),
    unload: x => resourceUnload(x.texture)
}
const withTexture: Builder<HasTexture> = withComponent<HasTexture>()

interface HasTiles {
    tileWidth: number,
    tileHeight: number
}
const withTiles = withComponent<HasTiles>(x => {
    hasDefault(x, 'tileWidth', 16)
    hasDefault(x, 'tileHeight', 16)
})

interface HasTilemap {
    width: number,
    height: number,
    tileData: number[]
}
const withTilemap = withComponent<HasTilemap>(x => {
    hasDefault(x, 'width', 0)
    hasDefault(x, 'height', 0)
    hasDefaultFn(x, 'tileData', () => [])
})
type Tilemap = Entity & HasPosition & HasTexture & HasTiles & HasTilemap
const drawsTilemap: Behaviour<Tilemap> = {
    draw: map => {
        const position = new Vector2(0,0)
        const src = new Rectangle(0,0,map.tileWidth,map.tileHeight)
        const tilesX = Math.floor(map.textureResource.width/map.tileWidth)
        for (let y = 0; y < map.width; y++) {
            for (let x = 0; x < map.height; x++) {
                let tileId = map.tileData[y*map.width+x]
                if(tileId === 0) continue
                tileId--
                position.x = map.position.x + x * map.tileWidth
                position.y = map.position.y + y * map.tileHeight
                src.x = (tileId % tilesX) * map.tileWidth
                src.y = Math.floor(tileId / tilesX) * map.tileHeight
                drawTextureRec(map.textureResource, src, position, WHITE)
            }        
        }
    }
}
const makeTilemap: Builder<Tilemap> = combine(makeEntity, 
    withPosition, 
    withTexture, 
    withTiles, 
    withTilemap, 
    which<Tilemap>(loadsTexture), 
    which(drawsTilemap))

interface HasChildren {
    children: Entity[]
}
const withChildren = withComponent<HasChildren>(x => hasDefaultFn(x, 'children', () => []))
type Container = Entity & HasChildren
const processesChildren: Behaviour<Container> = {
    load: x => x.children.forEach(y => y.behaviours.forEach(z => z.load ? z.load(y) : undefined)),
    update: x => x.children.forEach(y => y.behaviours.forEach(z => z.update ? z.update(y) : undefined)),
    draw: x => x.children.forEach(y => {
        y.behaviours.forEach(z => z.beforeDraw ? z.beforeDraw(y) : undefined)
        y.behaviours.forEach(z => z.draw ? z.draw(y) : undefined)
        y.behaviours.forEach(z => z.afterDraw ? z.afterDraw(y) : undefined)
    }),
    unload: x => x.children.forEach(y => y.behaviours.forEach(z => z.unload ? z.unload(y) : undefined))
}
const makeContainer = combine(makeEntity, withChildren, which(processesChildren))

interface HasCamera2D {
    camera2D: Camera2D 
}
const withCamera2D = withComponent<HasCamera2D>(x => hasDefaultFn(x,'camera2D',() => new Camera2D(new Vector2(getScreenWidth()/2.0, getScreenHeight()/2.0),new Vector2(0,0), 0, 1)))
type Space2D = Container & HasCamera2D
const applies2dSpace: Behaviour<Space2D> = {
    beforeDraw: x => beginMode2D(x.camera2D),
    afterDraw: x => endMode2D()
} 
const makeSpace2D = combine(makeContainer, withCamera2D, which(applies2dSpace))

type TileCursor = Entity & HasPosition & HasTiles & HasActive & HasCamera2D
const drawsTileCursor: Behaviour<TileCursor> = {
    draw: x => {
        x.position = getScreenToWorld2D(getMousePosition(), x.camera2D)
        const tx = Math.floor(x.position.x/x.tileWidth)
        const ty = Math.floor(x.position.y/x.tileHeight)
        const px = tx * x.tileWidth
        const py = ty * x.tileHeight
        drawText(`${tx},${ty}`, px, py-9, 8, WHITE)
        drawRectangleLines(px, py, x.tileWidth, x.tileHeight, BLUE)
    }
}
const makeTileCursor = combine(makeEntity, withPosition, withTiles, withActive, withCamera2D, which(drawsTileCursor))

gameRun({ width: 800, height: 600, title: 'My Editor', flags: FLAG_WINDOW_RESIZABLE }, async (quit) => {
    const map = makeTilemap({
        texture: "resources/tilemap_packed.png",
        width: 16,
        height: 16,
        tileData: new Array(16*16).fill(1)
    })
    const space2d = makeSpace2D({})
    space2d.children.push(map)
    space2d.camera2D.zoom = 2
    space2d.camera2D.target = new Vector2((map.width/2)*map.tileWidth,(map.height/2)*map.tileHeight)
    
    const cursor = makeTileCursor({
        camera2D: space2d.camera2D
    })
    space2d.children.push(cursor)

    entityAdd(space2d)

    const but = makeButton({
        position: new Vector2(10,10),
        text: 'Click Me!',
        onClick: () => but.position.x += 20
    })
    const tb = makeTextbox({
        text: but.text,
        position: new Vector2(10,50),
        onChange: () => but.text = tb.text
    })
    const cb = makeCheckbox({
        position: new Vector2(10,75),
        size: new Vector2(20,20),
        text: "Check Me!",
        onChange: () => cb.text = "Checkbox is "+ (cb.active ? "checked" : "not checked")
    })
    const l = makeLabel({
        position: new Vector2(10,100),
        text: "This is a label"
    })
    entityAdd(guiState)
    entityAdd(but)
    entityAdd(tb)
    entityAdd(cb)
    entityAdd(l)


})
