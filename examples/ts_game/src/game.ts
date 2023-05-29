import { Behaviour, Entity, EntityOf } from "./entity";
import { forEachReverse } from "./helpers";
import { resourceUnloadAll } from "./resource";

const promiseUpdateList: (()=>boolean)[] = []
const entitiyList: Entity[] = []


const dispatchPromises = () => {
    for (var i = promiseUpdateList.length - 1; i >= 0; i--) {
        const finished = promiseUpdateList[i]()
        if (finished) { 
            promiseUpdateList.splice(i, 1);
        }
    }
}

export const makeUpdateablePromise = (updateFn: () => boolean) => {
    let resFn: () => void
    let rejFn: (reason: any) => void
    const promise = new Promise<void>((resolve, reject) => {
        resFn = resolve    
        rejFn = reject
    });
    const update = () => {
        try {
            const res = updateFn()
            if(res) resFn()
            return res
        } catch(e: any){
            traceLog(LOG_INFO, "ERROR!")
            rejFn(e)
            return true
        }
    }
    promiseUpdateList.unshift(update)
    return promise
}

export const entityAdd = (entity: Entity) => {
    entity.behaviours.forEach(b => b.load ? b.load(entity) : undefined)
    entitiyList.push(entity)
    traceLog(LOG_INFO, `GAME: [ID ${entity.id}] loaded entity`)
}

export const entityUnload = (entity: Entity) => {
    forEachReverse(entity.behaviours, (b, i) => b.unload ? b.unload(entity) : undefined);
    traceLog(LOG_INFO, `GAME: [ID ${entity.id}] unloaded entity`)
}

export const entityRemove = (entity: Entity) => {
    // TODO: Do this cached
    const i = entitiyList.findIndex(x => x.id === entity.id)
    if (i !== -1) {
        entityUnload(entity)
        entitiyList.splice(i, 1)
    }
}

export const runGame = (width: number, height: number, title: string, startupCallback: (quit: () => void) => void | Promise<void>) => {
    initWindow(width, height, title)
    setTargetFPS(60)
    let quit = false 
    let exception: any = null
    const p = startupCallback(() => quit = true)
    if(p) p.catch(e => { exception = e })
    while(!windowShouldClose()){
        dispatchPromises()
        if(exception) throw exception
        entitiyList.forEach(e => e.behaviours.forEach(b => b.update ? b.update(e) : undefined))
        beginDrawing()
        clearBackground(BLACK)
        drawText("Active promises: "+ promiseUpdateList.length, 10,10, 8, RAYWHITE)
        entitiyList.forEach(e => e.behaviours.forEach(b => b.draw ? b.draw(e) : undefined))
        endDrawing()
    }
    entitiyList.forEach(x => entityUnload(x))
    entitiyList.splice(0,entitiyList.length)
    resourceUnloadAll()
    closeWindow()
}