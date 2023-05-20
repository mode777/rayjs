export interface System {
    isFinished: boolean;
    load(): void;
    unload(): void;
    draw(): void;
    update(dt: number): void;
}

export abstract class SystemBase implements System {

    public promise!: Promise<void>
    private complete!: () => void
    public isFinished = false
    
    load(): void {
        this.promise = new Promise((res,rej) => this.complete = res)
    }

    unload(): void {
        this.complete()
    }
    draw(): void {}
    update(dt: number): void {}
    stop(){
        this.isFinished = true
    }
}

export class SystemContainer extends SystemBase {
    private systemHost = new SystemHost()

    update(dt: number): void {
        this.systemHost.loadSystems()
        this.systemHost.updateSystems()
    }

    draw(): void {
        this.systemHost.drawSystems()
        this.systemHost.unloadSystems()
    }

    unload(): void {
        this.systemHost.requestShutdown()
        super.unload()
    }

    addSystem(system: System){
        return this.systemHost.addSystem(system)
    }

    removeSystem(id: number){
        return this.systemHost.removeSystem(id)
    }
}

export class SystemHost {
    private systems = new Map<number,System>()
    private unloadQueue = new Set<number>()
    private loadQueue = new Set<number>()
    private updateOrder: number[] = []
    private updateOrderRev: number[] = []
    private systemPrio = 0

    public addSystem(system: System){
        const id = this.systemPrio++
        this.systems.set(id, system)
        this.loadQueue.add(id)
        return id
    }

    public removeSystem(id: number){
        if(this.systems.has(id)) {
            this.unloadQueue.add(id)
        } 
    }

    private refreshUpdateOrder(){
        this.updateOrder = Array.from(this.systems.keys()).sort((a, b) => a - b);
        this.updateOrderRev = this.updateOrder.reverse()
    }

    public loadSystems(){
        if(this.loadQueue.size === 0) return 
        this.refreshUpdateOrder()
        for (const id of this.updateOrder) {
            if(this.loadQueue.has(id)) this.systems.get(id)?.load()
        }
        this.loadQueue.clear()
    }

    public unloadSystems(){
        if(this.unloadQueue.size === 0) return 
        for (const id of this.updateOrderRev) {
            if(this.unloadQueue.has(id)) {
                this.systems.get(id)?.unload()
                this.systems.delete(id)
            }
        }
        this.refreshUpdateOrder()
        this.unloadQueue.clear()
    }

    public updateSystems(){
        for (const id of this.updateOrder) {
            this.systems.get(id)?.update(getFrameTime())
        }
    }

    public drawSystems(){
        for (const id of this.updateOrder) {
            const sys = this.systems.get(id)
            sys?.draw()
            if(sys?.isFinished) this.unloadQueue.add(id)
        }
    }

    public requestShutdown(){
        for (const id of this.updateOrderRev) {
            this.systems.get(id)?.unload()
        }
    }
}