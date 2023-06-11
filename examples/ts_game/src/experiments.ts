import { Subject, BehaviorSubject, pipe, map, filter, Observable, combineLatest } from 'rxjs'
import { dispatchPromises, makeUpdateablePromise } from "./promise-extensions"
import { resourceUnloadAll, textureLoad } from "./resource"
import 'reflect-metadata'

interface WindowConfig {
    width: number,
    height: number,
    title: string,
    flags: number,
    targetFps: number,
}
const windowDefaults: WindowConfig = {
    width: 640,
    height: 480,
    title: "RayJS",
    flags: 0,
    targetFps: 60
}

class Game {
    config: WindowConfig
    private shouldQuit = false
    public clearColor = DARKBLUE

    constructor(options: Partial<WindowConfig> = {}){
        this.config = {
            ...windowDefaults,
            ...options
        }
        setConfigFlags(this.config.flags)
        initWindow(this.config.width,this.config.height,this.config.title)
        setTargetFPS(this.config.targetFps)
    }

    quit(){
        this.shouldQuit = true
    }

    async runCoroutine(fn: () => Promise<void>){
        const p = fn()
        let exception: any
        p.catch(e => exception = e)
        await p
        if(exception) throw exception; 
    }

    run(root: Node){

        while(!windowShouldClose() && !this.shouldQuit){
            const activePromises = dispatchPromises()
            root.notify("$update")
            beginDrawing()
            clearBackground(this.clearColor)
            root.notify("$beforeDraw")
            root.notify("$draw")
            root.notify("$afterDraw")
            drawText("Active promises: "+ activePromises, 10,10, 8, RAYWHITE)
            endDrawing()
        }
        resourceUnloadAll()
        closeWindow()
    }
}

enum NotifyOrder {
    ParentFirst,
    ChildFirst
}

class Entity {
    call(name: string, args: any[] = []){
        (<any>this)[name]?.apply(this,args)
    }
    callDeferred(name: string, args: any[] = []){
        return makeUpdateablePromise<void>(ctx => { 
            (<any>this)[name]?.apply(this,args)
            ctx.resolve()
         })
    }
    detectChanges$(){
        const v = JSON.stringify(Reflect.getMetadata("observe", this))
        traceLog(LOG_WARNING, v)
    }
}

class Node extends Entity {
    parent: Node | null = null
    children: Node[] = []
    createChild<T extends Node>(c: { new(): T }){
        return createNode(c, this)
    }
    notify(name: string, args: any[] = [], order = NotifyOrder.ChildFirst){
        if(order === NotifyOrder.ChildFirst){
            this.children.forEach(x => x.notify(name, args, order));
            this.call(name, args)
        } else {
            this.call(name, args)
            this.children.forEach(x => x.notify(name, args, order));
        }
    }
}
const createNode = <T extends Node>(c: { new(): T }, parent?: Node) => {
    const n = new c()
    n.notify("$init")
    if(parent){
        n.parent = parent
        parent.children.push(n)
        n.notify("$enterTree")
    }
    return n
};
const createResource = <T extends Resource>(c: { new(): T }) => {
    return new c()
};

class NodeCamera extends Node {
    camera = new Camera2D(new Vector2(getScreenWidth()/2.0, getScreenHeight()/2.0),new Vector2(0,0), 0, 1)

    $update(){
        this.camera.offset = new Vector2(getScreenWidth()/2.0, getScreenHeight()/2.0)
    }

    $beforeDraw(){
        beginMode2D(this.camera)
    }

    $afterDraw(){
        endMode2D()
    }
}

class Node2D extends Node {
    position = new Vector2(0,0)
}

const Observe = () => ((target: Entity, propertyKey: PropertyKey) => {
    let val = <PropertyKey[]>Reflect.getMetadata("observe", target)
    if(!val) {
        val = []
        Reflect.defineMetadata("observe", val, target)
    }
    val.push(propertyKey)
})

class Resource extends Entity {
    private _path$ = new BehaviorSubject<string | undefined>(undefined)
    get path$() { return this._path$.asObservable() }
    get path() { return this._path$.value }
    set path(v) { this._path$.next(v); }
}

class ObservableValue<T> {
    private _value: T
    get value() { return this._value }
    constructor(public readonly observable: Observable<T>, initalValue: T){
        this._value = initalValue
        this.observable.subscribe(x => this._value = x)
    }
}

class ResourceTexture2D extends Resource {
    private _texture = new ObservableValue(this.path$.pipe(map(x => x ? textureLoad(x!) : null)), null)
    get texture$() { return this._texture.observable }
    get texture() { return this._texture.value }
    private _size = new ObservableValue(this._texture.observable.pipe(map(x => x ? new Vector2(x.width,x.height) : vector2Zero())), vector2Zero())
    get size() { return this._size.value }
}

class ResourceTileset extends Resource {
    private _textureResource = new BehaviorSubject<ResourceTexture2D|undefined>(undefined)
    get textureResource() { return this._textureResource.value }
    set textureResource(v) { this._textureResource.next(v) }
    private _tileSize = new BehaviorSubject<Vector2>(new Vector2(16,16))
    get tileSize() { return this._tileSize.value }
    set tileSize(v) { this._tileSize.next(v) }

    private _rectangles = new ObservableValue<Rectangle[]>(combineLatest([this._textureResource,this._tileSize])
        .pipe(filter(arr => arr[0] !== undefined), map(x => ResourceTileset.getRects(x[0]!, x[1]))), [])
    get rectangles() { return this._rectangles.value }

    private static getRects(tex: ResourceTexture2D, tileSize: Vector2){
        const rects: Rectangle[] = []
        const tw = Math.floor(tex.size.x / tileSize.x)
        const th = Math.floor(tex.size.y / tileSize.y)
        for (let y = 0; y < th; y++) {
            for (let x = 0; x < tw; x++) {
                rects[1+(y*tw+x)] = new Rectangle(x*tileSize.x,y*tileSize.y,tileSize.x,tileSize.y)
            }
        }
        return rects
    }
}

class Tilemap extends Node2D {
    tileset?: ResourceTileset
    
    size = vector2Zero()
    data: number[] = []

    fill(fn: (x:number,y:number) => number){
        this.$update()

        const size = this.size;
        for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
                this.data[y*size.x+x] = fn(x,y)
            }
        }
    }

    $update(){
        if(this.data.length !== this.size.x * this.size.y)
            this.data = new Array(this.size.x * this.size.y)
    }

    $draw(){
        const data = this.data
        if(!this.tileset) {
            traceLog(LOG_WARNING, "No tileset found")
            return
        }
        const texture = this.tileset.textureResource?.texture
        if(!texture) return
        const size = this.size
        const tilesize = this.tileset.tileSize
        const position = new Vector2(0,0)

        for (let y = 0; y < size.x; y++) {
            for (let x = 0; x < size.y; x++) {
                let tileId = data[y*size.x+x]
                if(tileId === 0) continue
                const src = this.tileset.rectangles[tileId]
                position.x = this.position.x + (x * tilesize.x)
                position.y = this.position.y + (y * tilesize.y)
                drawTextureRec(texture, src, position, WHITE)
            }        
        }
    }
}

const game = new Game()

const camera = createNode(NodeCamera)
const tex = createResource(ResourceTexture2D)
const tileset = createResource(ResourceTileset)
const tilemap = createNode(Tilemap, camera)

tex.path = "resources/tilemap_packed.png"
tileset.textureResource = tex
tilemap.size = new Vector2(16,16)
tilemap.tileset = tileset
camera.camera.zoom = 2
camera.camera.target = new Vector2(16*8,16*8)
tilemap.fill((x,y) => 1)    

game.run(camera)


