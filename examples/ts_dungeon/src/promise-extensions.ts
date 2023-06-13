const promiseUpdateList: PromiseContext<any>[] = []

export const dispatchPromises = () => {
    for (var i = promiseUpdateList.length - 1; i >= 0; i--) {
        const p = promiseUpdateList[i]
        p.update()
        if (p.isFinished) { 
            promiseUpdateList.splice(i, 1);
        }
    }
    return promiseUpdateList.length
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