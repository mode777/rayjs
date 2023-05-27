const promiseUpdateList: (()=>boolean)[] = []

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


export abstract class Game {
    public clearColor = BLACK
    private quit = false

    constructor(public readonly width: number, 
        public readonly height: number, 
        public readonly title: string){
    }

    public run(){
        initWindow(this.width,this.height,this.title)
        setTargetFPS(60)
        this.load()
        while(!(this.quit = windowShouldClose())){
            dispatchPromises()
            this.update()
            beginDrawing()
            clearBackground(this.clearColor)
            this.draw()
            endDrawing()
        }
        this.unload()
        closeWindow()
    }

    abstract draw(): void;
    abstract update(): void;
    abstract load(): void;
    abstract unload(): void;
}