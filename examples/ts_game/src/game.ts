import { System, SystemHost } from "./systems"

export class Game {
    public clearColor = RAYWHITE
    private systemHost = new SystemHost()
    private quit = false

    constructor(public readonly width: number, 
        public readonly height: number, 
        public readonly title: string){
    }

    public run(){
        initWindow(this.width,this.height,this.title)
        setTargetFPS(60)
        while(!(this.quit = windowShouldClose())){
            this.systemHost.loadSystems()
            this.systemHost.updateSystems()
            beginDrawing()
            clearBackground(this.clearColor)
            this.systemHost.drawSystems()
            this.systemHost.unloadSystems()
            endDrawing()
        }
        this.systemHost.requestShutdown()
        closeWindow()
    }

    addSystem(system: System){
        return this.systemHost.addSystem(system)
    }

    removeSystem(id: number){
        return this.systemHost.removeSystem(id)
    }

    
}