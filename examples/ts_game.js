/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
class Game {
    constructor(width, height, title) {
        this.width = width;
        this.height = height;
        this.title = title;
        this.clearColor = RAYWHITE;
        this.quit = false;
    }
    run() {
        initWindow(this.width, this.height, this.title);
        setTargetFPS(60);
        this.load();
        while (!(this.quit = windowShouldClose())) {
            this.update();
            beginDrawing();
            clearBackground(this.clearColor);
            this.draw();
            endDrawing();
        }
        this.unload();
        closeWindow();
    }
}
exports.Game = Game;


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
const game_1 = __webpack_require__(/*! ./game */ "./src/game.ts");
class MyGame extends game_1.Game {
    draw() {
        throw new Error("Method not implemented.");
    }
    update() {
        throw new Error("Method not implemented.");
    }
    load() {
        throw new Error("Method not implemented.");
    }
    unload() {
        throw new Error("Method not implemented.");
    }
}
const game = new MyGame(800, 450, "Typescript Game");
game.run();

})();

/******/ })()
;