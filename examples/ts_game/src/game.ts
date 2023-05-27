import { EntityOf } from "./entity";
import { resourceUnloadAll } from "./resource";

const promiseUpdateList: (()=>boolean)[] = []
const entitiyList: EntityOf<any>[] = []


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
    const promise = new Promise<void>((resolve, reject) => {
        resFn = resolve    
    });
    const update = () => {
        const res = updateFn()
        if(res) resFn()
        return res
    }
    promiseUpdateList.unshift(update)
    return promise
}

export const entityAdd = (entity: EntityOf<any>) => {
    if (entity.load) entity.load(entity)
    entitiyList.push(entity)
}

export const entityRemove = (entity: EntityOf<any>) => {
    // TODO: Do this cached
    const i = entitiyList.findIndex(x => x.id === entity.id)
    if (i !== -1) {
        const e = entitiyList[i]
        if (e.unload) e.unload(entity)
        entitiyList.splice(i, 1)
    }
}

export const runGame = (width: number, height: number, title: string, startupCallback: () => void) => {
    initWindow(width, height, title)
    setTargetFPS(60)
    startupCallback()
    while(!windowShouldClose()){
        dispatchPromises()
        for (const entity of entitiyList) {
            if (entity.update) entity.update(entity)
        }
        beginDrawing()
        clearBackground(BLACK)
        for (const entity of entitiyList) {
            if (entity.draw) entity.draw(entity)
        }
        endDrawing()
    }
    resourceUnloadAll()
    closeWindow()
}