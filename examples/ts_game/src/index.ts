import { GameController } from "./examples";
import { Game } from "./game";
import { SystemBase, SystemContainer } from "./systems";

class MySys extends SystemBase {
    mesh!: Mesh;
    material!: Material
    matrix!: Matrix

    load(): void {
        super.load()
        this.mesh = new Mesh()
        this.mesh.vertexCount = 3
        this.mesh.triangleCount = 1
        const v1 = new Vector3(400, 0, 0)
        const v2 = new Vector3(0, 450, 0 )
        const v3 = new Vector3(800, 450, 0)
        this.mesh.indices = new Uint16Array([0,1,2]).buffer
        this.mesh.vertices = new Float32Array([
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z
        ]).buffer
        // If your forget to upload to GPU draw will segfault
        uploadMesh(this.mesh, false)
        this.material = loadMaterialDefault()
        this.matrix = matrixIdentity()
    }
    update(dt: number): void {
        this.matrix = matrixRotateZ(getTime())
    }
    draw(): void {
        drawMesh(this.mesh, this.material, this.matrix)
    }
    unload(): void {
        super.unload()
        unloadMaterial(this.material)
        unloadMesh(this.mesh)
    }
}


const game = new Game(800,450,"Typescript Game")
game.addSystem(new GameController())
game.addSystem(new MySys())
game.run()