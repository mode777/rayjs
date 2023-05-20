/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/examples.ts":
/*!*************************!*\
  !*** ./src/examples.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirstPersonMaze = exports.GameController = void 0;
const systems_1 = __webpack_require__(/*! ./systems */ "./src/systems.ts");
class GameController extends systems_1.SystemContainer {
    constructor() {
        super(...arguments);
        this.systems = [
            new BasicWindow(),
            new FirstPersonMaze()
        ];
    }
    load() {
        super.load();
        this.currentIndex = 0;
        this.currentId = this.addSystem(this.systems[this.currentIndex]);
    }
    update(dt) {
        if (isKeyPressed(KEY_RIGHT)) {
            this.removeSystem(this.currentId);
            this.currentIndex = (this.currentIndex + 1) % this.systems.length;
            this.currentId = this.addSystem(this.systems[this.currentIndex]);
        }
        super.update(dt);
    }
}
exports.GameController = GameController;
class BasicWindow extends systems_1.SystemBase {
    draw() {
        super.draw();
        drawText("Congrats! You created your first window!", 190, 200, 20, LIGHTGRAY);
    }
}
class FirstPersonMaze extends systems_1.SystemBase {
    load() {
        super.load();
        // Define the camera to look into our 3d world
        this.camera = new Camera3D(new Vector3(0.2, 0.4, 0.2), new Vector3(0.185, 0.4, 0.0), new Vector3(0, 1, 0), 45, CAMERA_PERSPECTIVE);
        const position = new Vector3(0, 0, 0); // Set model position
        const imMap = loadImage("assets/cubicmap.png"); // Load cubicmap image (RAM)
        this.cubicmap = loadTextureFromImage(imMap); // Convert image to texture to display (VRAM)
        const mesh = genMeshCubicmap(imMap, new Vector3(1.0, 1.0, 1.0));
        this.model = loadModelFromMesh(mesh);
        // NOTE: By default each cube is mapped to one part of texture atlas
        this.texture = loadTexture("assets/cubicmap_atlas.png"); // Load map texture
        //model.materials[0].maps[MATERIAL_MAP_DIFFUSE].texture = texture;    // Set map diffuse texture
        const mat = loadMaterialDefault();
        setMaterialTexture(mat, MATERIAL_MAP_DIFFUSE, this.texture);
        setModelMaterial(this.model, 0, mat);
        // Get map image data to be used for collision detection
        this.mapPixels = new Uint8Array(loadImageColors(imMap));
        unloadImage(imMap); // Unload image from RAM
        this.mapPosition = new Vector3(-16.0, 0.0, -8.0); // Set model position
        disableCursor();
    }
    update(dt) {
        super.update(dt);
        let oldCamPos = this.camera.position; // Store old camera position
        updateCamera(this.camera, CAMERA_FIRST_PERSON);
        // Check player collision (we simplify to 2D collision detection)
        const playerPos = new Vector2(this.camera.position.x, this.camera.position.z);
        const playerRadius = 0.1; // Collision radius (player is modelled as a cilinder for collision)
        this.playerCellX = Math.floor(playerPos.x - this.mapPosition.x + 0.5);
        this.playerCellY = Math.floor(playerPos.y - this.mapPosition.z + 0.5);
        // Out-of-limits security check
        if (this.playerCellX < 0)
            this.playerCellX = 0;
        else if (this.playerCellX >= this.cubicmap.width)
            this.playerCellX = this.cubicmap.width - 1;
        if (this.playerCellY < 0)
            this.playerCellY = 0;
        else if (this.playerCellY >= this.cubicmap.height)
            this.playerCellY = this.cubicmap.height - 1;
        // Check map collisions using image data and player position
        // TODO: Improvement: Just check player surrounding cells for collision
        for (let y = 0; y < this.cubicmap.height; y++) {
            for (let x = 0; x < this.cubicmap.width; x++) {
                const pixelValR = this.mapPixels[((y * this.cubicmap.width + x) * 4)];
                if ((pixelValR == 255) && // Collision: white pixel, only check R channel
                    (checkCollisionCircleRec(playerPos, playerRadius, new Rectangle(this.mapPosition.x - 0.5 + x * 1.0, this.mapPosition.z - 0.5 + y * 1.0, 1.0, 1.0)))) {
                    // Collision detected, reset camera position
                    this.camera.position = oldCamPos;
                }
            }
        }
    }
    draw() {
        super.draw();
        beginMode3D(this.camera);
        drawModel(this.model, this.mapPosition, 1.0, WHITE); // Draw maze map
        endMode3D();
        drawTextureEx(this.cubicmap, new Vector2(getScreenWidth() - this.cubicmap.width * 4.0 - 20, 20.0), 0.0, 4.0, WHITE);
        drawRectangleLines(getScreenWidth() - this.cubicmap.width * 4 - 20, 20, this.cubicmap.width * 4, this.cubicmap.height * 4, GREEN);
        // Draw player position radar
        drawRectangle(getScreenWidth() - this.cubicmap.width * 4 - 20 + this.playerCellX * 4, 20 + this.playerCellY * 4, 4, 4, RED);
        drawFPS(10, 10);
    }
    unload() {
        enableCursor();
        unloadTexture(this.cubicmap); // Unload cubicmap texture
        unloadTexture(this.texture); // Unload map texture
        unloadModel(this.model); // Unload map model
        super.unload();
    }
}
exports.FirstPersonMaze = FirstPersonMaze;


/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const systems_1 = __webpack_require__(/*! ./systems */ "./src/systems.ts");
class Game {
    constructor(width, height, title) {
        this.width = width;
        this.height = height;
        this.title = title;
        this.clearColor = RAYWHITE;
        this.systemHost = new systems_1.SystemHost();
        this.quit = false;
    }
    run() {
        initWindow(this.width, this.height, this.title);
        setTargetFPS(60);
        while (!(this.quit = windowShouldClose())) {
            this.systemHost.loadSystems();
            this.systemHost.updateSystems();
            beginDrawing();
            clearBackground(this.clearColor);
            this.systemHost.drawSystems();
            this.systemHost.unloadSystems();
            endDrawing();
        }
        this.systemHost.requestShutdown();
        closeWindow();
    }
    addSystem(system) {
        return this.systemHost.addSystem(system);
    }
    removeSystem(id) {
        return this.systemHost.removeSystem(id);
    }
}
exports.Game = Game;


/***/ }),

/***/ "./src/systems.ts":
/*!************************!*\
  !*** ./src/systems.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemHost = exports.SystemContainer = exports.SystemBase = void 0;
class SystemBase {
    constructor() {
        this.isFinished = false;
    }
    load() {
        this.promise = new Promise((res, rej) => this.complete = res);
    }
    unload() {
        this.complete();
    }
    draw() { }
    update(dt) { }
    stop() {
        this.isFinished = true;
    }
}
exports.SystemBase = SystemBase;
class SystemContainer extends SystemBase {
    constructor() {
        super(...arguments);
        this.systemHost = new SystemHost();
    }
    update(dt) {
        this.systemHost.loadSystems();
        this.systemHost.updateSystems();
    }
    draw() {
        this.systemHost.drawSystems();
        this.systemHost.unloadSystems();
    }
    unload() {
        this.systemHost.requestShutdown();
        super.unload();
    }
    addSystem(system) {
        return this.systemHost.addSystem(system);
    }
    removeSystem(id) {
        return this.systemHost.removeSystem(id);
    }
}
exports.SystemContainer = SystemContainer;
class SystemHost {
    constructor() {
        this.systems = new Map();
        this.unloadQueue = new Set();
        this.loadQueue = new Set();
        this.updateOrder = [];
        this.updateOrderRev = [];
        this.systemPrio = 0;
    }
    addSystem(system) {
        const id = this.systemPrio++;
        this.systems.set(id, system);
        this.loadQueue.add(id);
        return id;
    }
    removeSystem(id) {
        if (this.systems.has(id)) {
            this.unloadQueue.add(id);
        }
    }
    refreshUpdateOrder() {
        this.updateOrder = Array.from(this.systems.keys()).sort((a, b) => a - b);
        this.updateOrderRev = this.updateOrder.reverse();
    }
    loadSystems() {
        if (this.loadQueue.size === 0)
            return;
        this.refreshUpdateOrder();
        for (const id of this.updateOrder) {
            if (this.loadQueue.has(id))
                this.systems.get(id)?.load();
        }
        this.loadQueue.clear();
    }
    unloadSystems() {
        if (this.unloadQueue.size === 0)
            return;
        for (const id of this.updateOrderRev) {
            if (this.unloadQueue.has(id)) {
                this.systems.get(id)?.unload();
                this.systems.delete(id);
            }
        }
        this.refreshUpdateOrder();
        this.unloadQueue.clear();
    }
    updateSystems() {
        for (const id of this.updateOrder) {
            this.systems.get(id)?.update(getFrameTime());
        }
    }
    drawSystems() {
        for (const id of this.updateOrder) {
            const sys = this.systems.get(id);
            sys?.draw();
            if (sys?.isFinished)
                this.unloadQueue.add(id);
        }
    }
    requestShutdown() {
        for (const id of this.updateOrderRev) {
            this.systems.get(id)?.unload();
        }
    }
}
exports.SystemHost = SystemHost;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const examples_1 = __webpack_require__(/*! ./examples */ "./src/examples.ts");
const game_1 = __webpack_require__(/*! ./game */ "./src/game.ts");
const systems_1 = __webpack_require__(/*! ./systems */ "./src/systems.ts");
class MySys extends systems_1.SystemBase {
    load() {
        super.load();
        this.mesh = new Mesh();
        this.mesh.vertexCount = 3;
        this.mesh.triangleCount = 1;
        const v1 = new Vector3(400, 0, 0);
        const v2 = new Vector3(0, 450, 0);
        const v3 = new Vector3(800, 450, 0);
        this.mesh.indices = new Uint16Array([0, 1, 2]).buffer;
        this.mesh.vertices = new Float32Array([
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z
        ]).buffer;
        // If your forget to upload to GPU draw will segfault
        uploadMesh(this.mesh, false);
        this.material = loadMaterialDefault();
        this.matrix = matrixIdentity();
    }
    update(dt) {
        this.matrix = matrixRotateZ(getTime());
    }
    draw() {
        drawMesh(this.mesh, this.material, this.matrix);
    }
    unload() {
        super.unload();
        unloadMaterial(this.material);
        unloadMesh(this.mesh);
    }
}
const game = new game_1.Game(800, 450, "Typescript Game");
game.addSystem(new examples_1.GameController());
game.addSystem(new MySys());
game.run();

})();

/******/ })()
;