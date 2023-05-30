import { Behaviour, Entity, EntityOf } from "./entity";
import { forEachReverse } from "./helpers";
import { resourceUnloadAll } from "./resource";

const promiseUpdateList: PromiseContext<any>[] = []
const entitiyList: Entity[] = []


const dispatchPromises = () => {
    for (var i = promiseUpdateList.length - 1; i >= 0; i--) {
        const p = promiseUpdateList[i]
        p.update()
        if (p.isFinished) { 
            promiseUpdateList.splice(i, 1);
        }
    }
}

class PromiseContext<T> {

    private _result: T | null = null;
    public get result(): T | null {
        return this._result;
    }
    private _error: any | null = null;
    public get error(): any | null {
        return this._error;
    }
    private _isFinished = false;
    public get isFinished() {
        return this._isFinished;
    }
    private _isCancellationRequested = false;
    public get isCancellationRequested() {
        return this._isCancellationRequested;
    }

    constructor(private readonly resolveFn: (val: T | PromiseLike<T>) => void,
        private readonly rejectFn: (err: any) => void,
        private readonly updateFn: (p: PromiseContext<T>) => void){}

    update(){
        if(!this.isFinished){
            this.updateFn(this)
        }
    }

    resolve(val: T){
        this._result = val
        this._isFinished = true
        this.resolveFn(val)
    }

    reject(reason: any){
        this._error = reason
        this._isFinished = true
        this.rejectFn(reason)
    }

    cancel(){
        this._isCancellationRequested = true
    }
}
export interface ExtendedPromise<T> extends Promise<T> {
    context: PromiseContext<T>
}
export const makeUpdateablePromise = <T>(update: (ctx: PromiseContext<T>) => void) => {
    let context: PromiseContext<T>
    const promise = <ExtendedPromise<T>>new Promise<T>((resolve, reject) => {
        context = new PromiseContext<T>(resolve,reject,update)
    });
    promise.context = context!
    promiseUpdateList.unshift(context!)
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