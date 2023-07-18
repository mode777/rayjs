interface Vector2 {
    /** Vector x component */
    x: number,
    /** Vector y component */
    y: number,
}
declare var Vector2: {
    prototype: Vector2;
    new(x: number, y: number): Vector2;
}
interface Vector3 {
    /** Vector x component */
    x: number,
    /** Vector y component */
    y: number,
    /** Vector z component */
    z: number,
}
declare var Vector3: {
    prototype: Vector3;
    new(x: number, y: number, z: number): Vector3;
}
interface Vector4 {
    /** Vector x component */
    x: number,
    /** Vector y component */
    y: number,
    /** Vector z component */
    z: number,
    /** Vector w component */
    w: number,
}
declare var Vector4: {
    prototype: Vector4;
    new(x: number, y: number, z: number, w: number): Vector4;
}
interface Matrix {
}
declare var Matrix: {
    prototype: Matrix;
}
interface Color {
    /** Color red value */
    r: number,
    /** Color green value */
    g: number,
    /** Color blue value */
    b: number,
    /** Color alpha value */
    a: number,
}
declare var Color: {
    prototype: Color;
    new(r: number, g: number, b: number, a: number): Color;
}
interface Rectangle {
    /** Rectangle top-left corner position x */
    x: number,
    /** Rectangle top-left corner position y */
    y: number,
    /** Rectangle width */
    width: number,
    /** Rectangle height */
    height: number,
}
declare var Rectangle: {
    prototype: Rectangle;
    new(x: number, y: number, width: number, height: number): Rectangle;
}
interface Image {
    /** Image raw data */
    data: any,
    /** Image base width */
    width: number,
    /** Image base height */
    height: number,
    /** Mipmap levels, 1 by default */
    mipmaps: number,
    /** Data format (PixelFormat type) */
    format: number,
}
declare var Image: {
    prototype: Image;
    new(): Image;
}
interface Texture {
    /** Texture base width */
    width: number,
    /** Texture base height */
    height: number,
    /** Mipmap levels, 1 by default */
    mipmaps: number,
    /** Data format (PixelFormat type) */
    format: number,
}
declare var Texture: {
    prototype: Texture;
}
interface RenderTexture {
    /** OpenGL framebuffer object id */
    id: number,
    /** Color buffer attachment texture */
    texture: Texture,
    /** Depth buffer attachment texture */
    depth: Texture,
}
declare var RenderTexture: {
    prototype: RenderTexture;
}
interface NPatchInfo {
    /** Texture source rectangle */
    source: Rectangle,
    /** Left border offset */
    left: number,
    /** Top border offset */
    top: number,
    /** Right border offset */
    right: number,
    /** Bottom border offset */
    bottom: number,
    /** Layout of the n-patch: 3x3, 1x3 or 3x1 */
    layout: number,
}
declare var NPatchInfo: {
    prototype: NPatchInfo;
    new(source: Rectangle, left: number, top: number, right: number, bottom: number, layout: number): NPatchInfo;
}
interface GlyphInfo {
}
declare var GlyphInfo: {
    prototype: GlyphInfo;
}
interface Font {
    /** Base size (default chars height) */
    baseSize: number,
    /** Number of glyph characters */
    glyphCount: number,
    /** Padding around the glyph characters */
    glyphPadding: number,
}
declare var Font: {
    prototype: Font;
}
interface Camera3D {
    /** Camera position */
    position: Vector3,
    /** Camera target it looks-at */
    target: Vector3,
    /** Camera up vector (rotation over its axis) */
    up: Vector3,
    /** Camera field-of-view aperture in Y (degrees) in perspective, used as near plane width in orthographic */
    fovy: number,
    /** Camera projection: CAMERA_PERSPECTIVE or CAMERA_ORTHOGRAPHIC */
    projection: number,
}
declare var Camera3D: {
    prototype: Camera3D;
    new(position: Vector3, target: Vector3, up: Vector3, fovy: number, projection: number): Camera3D;
}
interface Camera2D {
    /** Camera offset (displacement from target) */
    offset: Vector2,
    /** Camera target (rotation and zoom origin) */
    target: Vector2,
    /** Camera rotation in degrees */
    rotation: number,
    /** Camera zoom (scaling), should be 1.0f by default */
    zoom: number,
}
declare var Camera2D: {
    prototype: Camera2D;
    new(offset: Vector2, target: Vector2, rotation: number, zoom: number): Camera2D;
}
interface Mesh {
    /** Number of vertices stored in arrays */
    vertexCount: number,
    /** Number of triangles stored (indexed or not) */
    triangleCount: number,
    /** Vertex position (XYZ - 3 components per vertex) (shader-location = 0) */
    vertices: ArrayBuffer,
    /** Vertex texture coordinates (UV - 2 components per vertex) (shader-location = 1) */
    texcoords: ArrayBuffer,
    /** Vertex texture second coordinates (UV - 2 components per vertex) (shader-location = 5) */
    texcoords2: ArrayBuffer,
    /** Vertex normals (XYZ - 3 components per vertex) (shader-location = 2) */
    normals: ArrayBuffer,
    /** Vertex tangents (XYZW - 4 components per vertex) (shader-location = 4) */
    tangents: ArrayBuffer,
    /** Vertex colors (RGBA - 4 components per vertex) (shader-location = 3) */
    colors: ArrayBuffer,
    /** Vertex indices (in case vertex data comes indexed) */
    indices: ArrayBuffer,
    /** Animated vertex positions (after bones transformations) */
    animVertices: ArrayBuffer,
    /** Animated normals (after bones transformations) */
    animNormals: ArrayBuffer,
    /** Vertex bone ids, max 255 bone ids, up to 4 bones influence by vertex (skinning) */
    boneIds: ArrayBuffer,
    /** Vertex bone weight, up to 4 bones influence by vertex (skinning) */
    boneWeights: ArrayBuffer,
}
declare var Mesh: {
    prototype: Mesh;
    new(): Mesh;
}
interface Shader {
    /** Shader program id */
    id: number,
}
declare var Shader: {
    prototype: Shader;
}
interface MaterialMap {
    /** Material map texture */
    texture: Texture,
    /** Material map color */
    color: Color,
    /** Material map value */
    value: number,
}
declare var MaterialMap: {
    prototype: MaterialMap;
}
interface Material {
    /** Material shader */
    shader: Shader,
}
declare var Material: {
    prototype: Material;
}
interface Transform {
}
declare var Transform: {
    prototype: Transform;
}
interface BoneInfo {
}
declare var BoneInfo: {
    prototype: BoneInfo;
}
interface Model {
    /** Local transform matrix */
    transform: Matrix,
    /** Number of meshes */
    meshCount: number,
    /** Number of materials */
    materialCount: number,
    /** Number of bones */
    boneCount: number,
}
declare var Model: {
    prototype: Model;
}
interface ModelAnimation {
}
declare var ModelAnimation: {
    prototype: ModelAnimation;
}
interface Ray {
    /** Ray position (origin) */
    position: Vector3,
    /** Ray direction */
    direction: Vector3,
}
declare var Ray: {
    prototype: Ray;
    new(position: Vector3, direction: Vector3): Ray;
}
interface RayCollision {
    /** Did the ray hit something? */
    hit: boolean,
    /** Distance to the nearest hit */
    distance: number,
    /** Point of the nearest hit */
    point: Vector3,
    /** Surface normal of hit */
    normal: Vector3,
}
declare var RayCollision: {
    prototype: RayCollision;
}
interface BoundingBox {
    /** Minimum vertex box-corner */
    min: Vector3,
    /** Maximum vertex box-corner */
    max: Vector3,
}
declare var BoundingBox: {
    prototype: BoundingBox;
    new(min: Vector3, max: Vector3): BoundingBox;
}
interface Wave {
    /** Total number of frames (considering channels) */
    frameCount: number,
    /** Frequency (samples per second) */
    sampleRate: number,
    /** Bit depth (bits per sample): 8, 16, 32 (24 not supported) */
    sampleSize: number,
    /** Number of channels (1-mono, 2-stereo, ...) */
    channels: number,
}
declare var Wave: {
    prototype: Wave;
}
interface AudioStream {
}
declare var AudioStream: {
    prototype: AudioStream;
}
interface Sound {
    /** Total number of frames (considering channels) */
    frameCount: number,
}
declare var Sound: {
    prototype: Sound;
}
interface Music {
    /** Total number of frames (considering channels) */
    frameCount: number,
    /** Music looping enable */
    looping: boolean,
    /** Type of music context (audio filetype) */
    ctxType: number,
}
declare var Music: {
    prototype: Music;
}
interface VrDeviceInfo {
    /** Horizontal resolution in pixels */
    hResolution: number,
    /** Vertical resolution in pixels */
    vResolution: number,
    /** Horizontal size in meters */
    hScreenSize: number,
    /** Vertical size in meters */
    vScreenSize: number,
    /** Screen center in meters */
    vScreenCenter: number,
    /** Distance between eye and display in meters */
    eyeToScreenDistance: number,
    /** Lens separation distance in meters */
    lensSeparationDistance: number,
    /** IPD (distance between pupils) in meters */
    interpupillaryDistance: number,
}
declare var VrDeviceInfo: {
    prototype: VrDeviceInfo;
    new(): VrDeviceInfo;
}
interface VrStereoConfig {
}
declare var VrStereoConfig: {
    prototype: VrStereoConfig;
}
interface FilePathList {
}
declare var FilePathList: {
    prototype: FilePathList;
}
interface Light {
    type: number,
    enabled: boolean,
    position: Vector3,
    target: Vector3,
    color: Color,
    attenuation: number,
}
declare var Light: {
    prototype: Light;
}
interface Lightmapper {
    w: number,
    h: number,
    progress: number,
}
declare var Lightmapper: {
    prototype: Lightmapper;
}
interface LightmapperConfig {
    hemisphereSize: number,
    zNear: number,
    zFar: number,
    backgroundColor: Color,
    interpolationPasses: number,
    interpolationThreshold: number,
    cameraToSurfaceDistanceModifier: number,
}
declare var LightmapperConfig: {
    prototype: LightmapperConfig;
}
/** Initialize window and OpenGL context */
declare function initWindow(width: number, height: number, title: string | undefined | null): void;
/** Check if KEY_ESCAPE pressed or Close icon pressed */
declare function windowShouldClose(): boolean;
/** Close window and unload OpenGL context */
declare function closeWindow(): void;
/** Check if window has been initialized successfully */
declare function isWindowReady(): boolean;
/** Check if window is currently fullscreen */
declare function isWindowFullscreen(): boolean;
/** Check if window is currently hidden (only PLATFORM_DESKTOP) */
declare function isWindowHidden(): boolean;
/** Check if window is currently minimized (only PLATFORM_DESKTOP) */
declare function isWindowMinimized(): boolean;
/** Check if window is currently maximized (only PLATFORM_DESKTOP) */
declare function isWindowMaximized(): boolean;
/** Check if window is currently focused (only PLATFORM_DESKTOP) */
declare function isWindowFocused(): boolean;
/** Check if window has been resized last frame */
declare function isWindowResized(): boolean;
/** Check if one specific window flag is enabled */
declare function isWindowState(flag: number): boolean;
/** Set window configuration state using flags (only PLATFORM_DESKTOP) */
declare function setWindowState(flags: number): void;
/** Clear window configuration state flags */
declare function clearWindowState(flags: number): void;
/** Toggle window state: fullscreen/windowed (only PLATFORM_DESKTOP) */
declare function toggleFullscreen(): void;
/** Set window state: maximized, if resizable (only PLATFORM_DESKTOP) */
declare function maximizeWindow(): void;
/** Set window state: minimized, if resizable (only PLATFORM_DESKTOP) */
declare function minimizeWindow(): void;
/** Set window state: not minimized/maximized (only PLATFORM_DESKTOP) */
declare function restoreWindow(): void;
/** Set icon for window (single image, RGBA 32bit, only PLATFORM_DESKTOP) */
declare function setWindowIcon(image: Image): void;
/** Set title for window (only PLATFORM_DESKTOP) */
declare function setWindowTitle(title: string | undefined | null): void;
/** Set window position on screen (only PLATFORM_DESKTOP) */
declare function setWindowPosition(x: number, y: number): void;
/** Set monitor for the current window (fullscreen mode) */
declare function setWindowMonitor(monitor: number): void;
/** Set window minimum dimensions (for FLAG_WINDOW_RESIZABLE) */
declare function setWindowMinSize(width: number, height: number): void;
/** Set window dimensions */
declare function setWindowSize(width: number, height: number): void;
/** Set window opacity [0.0f..1.0f] (only PLATFORM_DESKTOP) */
declare function setWindowOpacity(opacity: number): void;
/** Get current screen width */
declare function getScreenWidth(): number;
/** Get current screen height */
declare function getScreenHeight(): number;
/** Get current render width (it considers HiDPI) */
declare function getRenderWidth(): number;
/** Get current render height (it considers HiDPI) */
declare function getRenderHeight(): number;
/** Get number of connected monitors */
declare function getMonitorCount(): number;
/** Get current connected monitor */
declare function getCurrentMonitor(): number;
/** Get specified monitor position */
declare function getMonitorPosition(monitor: number): Vector2;
/** Get specified monitor width (current video mode used by monitor) */
declare function getMonitorWidth(monitor: number): number;
/** Get specified monitor height (current video mode used by monitor) */
declare function getMonitorHeight(monitor: number): number;
/** Get specified monitor physical width in millimetres */
declare function getMonitorPhysicalWidth(monitor: number): number;
/** Get specified monitor physical height in millimetres */
declare function getMonitorPhysicalHeight(monitor: number): number;
/** Get specified monitor refresh rate */
declare function getMonitorRefreshRate(monitor: number): number;
/** Get window position XY on monitor */
declare function getWindowPosition(): Vector2;
/** Get window scale DPI factor */
declare function getWindowScaleDPI(): Vector2;
/** Get the human-readable, UTF-8 encoded name of the primary monitor */
declare function getMonitorName(monitor: number): string | undefined | null;
/** Set clipboard text content */
declare function setClipboardText(text: string | undefined | null): void;
/** Get clipboard text content */
declare function getClipboardText(): string | undefined | null;
/** Enable waiting for events on EndDrawing(), no automatic event polling */
declare function enableEventWaiting(): void;
/** Disable waiting for events on EndDrawing(), automatic events polling */
declare function disableEventWaiting(): void;
/** Shows cursor */
declare function showCursor(): void;
/** Hides cursor */
declare function hideCursor(): void;
/** Check if cursor is not visible */
declare function isCursorHidden(): boolean;
/** Enables cursor (unlock cursor) */
declare function enableCursor(): void;
/** Disables cursor (lock cursor) */
declare function disableCursor(): void;
/** Check if cursor is on the screen */
declare function isCursorOnScreen(): boolean;
/** Set background color (framebuffer clear color) */
declare function clearBackground(color: Color): void;
/** Setup canvas (framebuffer) to start drawing */
declare function beginDrawing(): void;
/** End canvas drawing and swap buffers (double buffering) */
declare function endDrawing(): void;
/** Begin 2D mode with custom camera (2D) */
declare function beginMode2D(camera: Camera2D): void;
/** Ends 2D mode with custom camera */
declare function endMode2D(): void;
/** Begin 3D mode with custom camera (3D) */
declare function beginMode3D(camera: Camera3D): void;
/** Ends 3D mode and returns to default 2D orthographic mode */
declare function endMode3D(): void;
/** Begin drawing to render texture */
declare function beginTextureMode(target: RenderTexture): void;
/** Ends drawing to render texture */
declare function endTextureMode(): void;
/** Begin custom shader drawing */
declare function beginShaderMode(shader: Shader): void;
/** End custom shader drawing (use default shader) */
declare function endShaderMode(): void;
/** Begin blending mode (alpha, additive, multiplied, subtract, custom) */
declare function beginBlendMode(mode: number): void;
/** End blending mode (reset to default: alpha blending) */
declare function endBlendMode(): void;
/** Begin scissor mode (define screen area for following drawing) */
declare function beginScissorMode(x: number, y: number, width: number, height: number): void;
/** End scissor mode */
declare function endScissorMode(): void;
/** Begin stereo rendering (requires VR simulator) */
declare function beginVrStereoMode(config: VrStereoConfig): void;
/** End stereo rendering (requires VR simulator) */
declare function endVrStereoMode(): void;
/** Load VR stereo config for VR simulator device parameters */
declare function loadVrStereoConfig(device: VrDeviceInfo): VrStereoConfig;
/** Unload VR stereo config */
declare function unloadVrStereoConfig(config: VrStereoConfig): void;
/** Load shader from files and bind default locations */
declare function loadShader(vsFileName: string | undefined | null, fsFileName: string | undefined | null): Shader;
/** Load shader from code strings and bind default locations */
declare function loadShaderFromMemory(vsCode: string | undefined | null, fsCode: string | undefined | null): Shader;
/** Check if a shader is ready */
declare function isShaderReady(shader: Shader): boolean;
/** Get shader uniform location */
declare function getShaderLocation(shader: Shader, uniformName: string | undefined | null): number;
/** Get shader attribute location */
declare function getShaderLocationAttrib(shader: Shader, attribName: string | undefined | null): number;
/** Set shader uniform value */
declare function setShaderValue(shader: Shader, locIndex: number, value: any, uniformType: number): void;
/** Set shader uniform value (matrix 4x4) */
declare function setShaderValueMatrix(shader: Shader, locIndex: number, mat: Matrix): void;
/** Set shader uniform value for texture (sampler2d) */
declare function setShaderValueTexture(shader: Shader, locIndex: number, texture: Texture): void;
/** Unload shader from GPU memory (VRAM) */
declare function unloadShader(shader: Shader): void;
/** Get a ray trace from mouse position */
declare function getMouseRay(mousePosition: Vector2, camera: Camera3D): Ray;
/** Get camera transform matrix (view matrix) */
declare function getCameraMatrix(camera: Camera3D): Matrix;
/** Get camera 2d transform matrix */
declare function getCameraMatrix2D(camera: Camera2D): Matrix;
/** Get the screen space position for a 3d world space position */
declare function getWorldToScreen(position: Vector3, camera: Camera3D): Vector2;
/** Get the world space position for a 2d camera screen space position */
declare function getScreenToWorld2D(position: Vector2, camera: Camera2D): Vector2;
/** Get size position for a 3d world space position */
declare function getWorldToScreenEx(position: Vector3, camera: Camera3D, width: number, height: number): Vector2;
/** Get the screen space position for a 2d camera world space position */
declare function getWorldToScreen2D(position: Vector2, camera: Camera2D): Vector2;
/** Set target FPS (maximum) */
declare function setTargetFPS(fps: number): void;
/** Get current FPS */
declare function getFPS(): number;
/** Get time in seconds for last frame drawn (delta time) */
declare function getFrameTime(): number;
/** Get elapsed time in seconds since InitWindow() */
declare function getTime(): number;
/** Get a random value between min and max (both included) */
declare function getRandomValue(min: number, max: number): number;
/** Set the seed for the random number generator */
declare function setRandomSeed(seed: number): void;
/** Takes a screenshot of current screen (filename extension defines format) */
declare function takeScreenshot(fileName: string | undefined | null): void;
/** Setup init configuration flags (view FLAGS) */
declare function setConfigFlags(flags: number): void;
/** Show trace log messages (LOG_DEBUG, LOG_INFO, LOG_WARNING, LOG_ERROR...) */
declare function traceLog(logLevel: number, text: string | undefined | null): void;
/** Set the current threshold (minimum) log level */
declare function setTraceLogLevel(logLevel: number): void;
/** Open URL with default system browser (if available) */
declare function openURL(url: string | undefined | null): void;
/** Load file data as byte array (read) */
declare function loadFileData(fileName: string | undefined | null): ArrayBuffer;
/** Save data to file from byte array (write), returns true on success */
declare function saveFileData(fileName: string | undefined | null, data: any, bytesToWrite: number): boolean;
/** Load text data from file (read), returns a '\0' terminated string */
declare function loadFileText(fileName: string | undefined | null): string | undefined | null;
/** Save text data to file (write), string must be '\0' terminated, returns true on success */
declare function saveFileText(fileName: string | undefined | null, text: string | undefined | null): boolean;
/** Check if file exists */
declare function fileExists(fileName: string | undefined | null): boolean;
/** Check if a directory path exists */
declare function directoryExists(dirPath: string | undefined | null): boolean;
/** Check file extension (including point: .png, .wav) */
declare function isFileExtension(fileName: string | undefined | null, ext: string | undefined | null): boolean;
/** Get file length in bytes (NOTE: GetFileSize() conflicts with windows.h) */
declare function getFileLength(fileName: string | undefined | null): number;
/** Get pointer to extension for a filename string (includes dot: '.png') */
declare function getFileExtension(fileName: string | undefined | null): string | undefined | null;
/** Get pointer to filename for a path string */
declare function getFileName(filePath: string | undefined | null): string | undefined | null;
/** Get filename string without extension (uses static string) */
declare function getFileNameWithoutExt(filePath: string | undefined | null): string | undefined | null;
/** Get full path for a given fileName with path (uses static string) */
declare function getDirectoryPath(filePath: string | undefined | null): string | undefined | null;
/** Get previous directory path for a given path (uses static string) */
declare function getPrevDirectoryPath(dirPath: string | undefined | null): string | undefined | null;
/** Get current working directory (uses static string) */
declare function getWorkingDirectory(): string | undefined | null;
/** Get the directory if the running application (uses static string) */
declare function getApplicationDirectory(): string | undefined | null;
/** Change working directory, return true on success */
declare function changeDirectory(dir: string | undefined | null): boolean;
/** Check if a given path is a file or a directory */
declare function isPathFile(path: string | undefined | null): boolean;
/** Load directory filepaths */
declare function loadDirectoryFiles(dirPath: string | undefined | null): string[];
/** Load directory filepaths with extension filtering and recursive directory scan */
declare function loadDirectoryFilesEx(basePath: string | undefined | null, filter: string | undefined | null, scanSubdirs: boolean): string[];
/** Check if a file has been dropped into window */
declare function isFileDropped(): boolean;
/** Load dropped filepaths */
declare function loadDroppedFiles(): string[];
/** Get file modification time (last write time) */
declare function getFileModTime(fileName: string | undefined | null): number;
/** Check if a key has been pressed once */
declare function isKeyPressed(key: number): boolean;
/** Check if a key is being pressed */
declare function isKeyDown(key: number): boolean;
/** Check if a key has been released once */
declare function isKeyReleased(key: number): boolean;
/** Check if a key is NOT being pressed */
declare function isKeyUp(key: number): boolean;
/** Set a custom key to exit program (default is ESC) */
declare function setExitKey(key: number): void;
/** Get key pressed (keycode), call it multiple times for keys queued, returns 0 when the queue is empty */
declare function getKeyPressed(): number;
/** Get char pressed (unicode), call it multiple times for chars queued, returns 0 when the queue is empty */
declare function getCharPressed(): number;
/** Check if a gamepad is available */
declare function isGamepadAvailable(gamepad: number): boolean;
/** Get gamepad internal name id */
declare function getGamepadName(gamepad: number): string | undefined | null;
/** Check if a gamepad button has been pressed once */
declare function isGamepadButtonPressed(gamepad: number, button: number): boolean;
/** Check if a gamepad button is being pressed */
declare function isGamepadButtonDown(gamepad: number, button: number): boolean;
/** Check if a gamepad button has been released once */
declare function isGamepadButtonReleased(gamepad: number, button: number): boolean;
/** Check if a gamepad button is NOT being pressed */
declare function isGamepadButtonUp(gamepad: number, button: number): boolean;
/** Get the last gamepad button pressed */
declare function getGamepadButtonPressed(): number;
/** Get gamepad axis count for a gamepad */
declare function getGamepadAxisCount(gamepad: number): number;
/** Get axis movement value for a gamepad axis */
declare function getGamepadAxisMovement(gamepad: number, axis: number): number;
/** Set internal gamepad mappings (SDL_GameControllerDB) */
declare function setGamepadMappings(mappings: string | undefined | null): number;
/** Check if a mouse button has been pressed once */
declare function isMouseButtonPressed(button: number): boolean;
/** Check if a mouse button is being pressed */
declare function isMouseButtonDown(button: number): boolean;
/** Check if a mouse button has been released once */
declare function isMouseButtonReleased(button: number): boolean;
/** Check if a mouse button is NOT being pressed */
declare function isMouseButtonUp(button: number): boolean;
/** Get mouse position X */
declare function getMouseX(): number;
/** Get mouse position Y */
declare function getMouseY(): number;
/** Get mouse position XY */
declare function getMousePosition(): Vector2;
/** Get mouse delta between frames */
declare function getMouseDelta(): Vector2;
/** Set mouse position XY */
declare function setMousePosition(x: number, y: number): void;
/** Set mouse offset */
declare function setMouseOffset(offsetX: number, offsetY: number): void;
/** Set mouse scaling */
declare function setMouseScale(scaleX: number, scaleY: number): void;
/** Get mouse wheel movement for X or Y, whichever is larger */
declare function getMouseWheelMove(): number;
/** Get mouse wheel movement for both X and Y */
declare function getMouseWheelMoveV(): Vector2;
/** Set mouse cursor */
declare function setMouseCursor(cursor: number): void;
/** Get touch position X for touch point 0 (relative to screen size) */
declare function getTouchX(): number;
/** Get touch position Y for touch point 0 (relative to screen size) */
declare function getTouchY(): number;
/** Get touch position XY for a touch point index (relative to screen size) */
declare function getTouchPosition(index: number): Vector2;
/** Get touch point identifier for given index */
declare function getTouchPointId(index: number): number;
/** Get number of touch points */
declare function getTouchPointCount(): number;
/** Enable a set of gestures using flags */
declare function setGesturesEnabled(flags: number): void;
/** Check if a gesture have been detected */
declare function isGestureDetected(gesture: number): boolean;
/** Get latest detected gesture */
declare function getGestureDetected(): number;
/** Get gesture hold time in milliseconds */
declare function getGestureHoldDuration(): number;
/** Get gesture drag vector */
declare function getGestureDragVector(): Vector2;
/** Get gesture drag angle */
declare function getGestureDragAngle(): number;
/** Get gesture pinch delta */
declare function getGesturePinchVector(): Vector2;
/** Get gesture pinch angle */
declare function getGesturePinchAngle(): number;
/** Update camera position for selected mode */
declare function updateCamera(camera: Camera3D, mode: number): void;
/** Update camera movement/rotation */
declare function updateCameraPro(camera: Camera3D, movement: Vector3, rotation: Vector3, zoom: number): void;
/** Set texture and rectangle to be used on shapes drawing */
declare function setShapesTexture(texture: Texture, source: Rectangle): void;
/** Draw a pixel */
declare function drawPixel(posX: number, posY: number, color: Color): void;
/** Draw a pixel (Vector version) */
declare function drawPixelV(position: Vector2, color: Color): void;
/** Draw a line */
declare function drawLine(startPosX: number, startPosY: number, endPosX: number, endPosY: number, color: Color): void;
/** Draw a line (Vector version) */
declare function drawLineV(startPos: Vector2, endPos: Vector2, color: Color): void;
/** Draw a line defining thickness */
declare function drawLineEx(startPos: Vector2, endPos: Vector2, thick: number, color: Color): void;
/** Draw a line using cubic-bezier curves in-out */
declare function drawLineBezier(startPos: Vector2, endPos: Vector2, thick: number, color: Color): void;
/** Draw line using quadratic bezier curves with a control point */
declare function drawLineBezierQuad(startPos: Vector2, endPos: Vector2, controlPos: Vector2, thick: number, color: Color): void;
/** Draw line using cubic bezier curves with 2 control points */
declare function drawLineBezierCubic(startPos: Vector2, endPos: Vector2, startControlPos: Vector2, endControlPos: Vector2, thick: number, color: Color): void;
/** Draw a color-filled circle */
declare function drawCircle(centerX: number, centerY: number, radius: number, color: Color): void;
/** Draw a piece of a circle */
declare function drawCircleSector(center: Vector2, radius: number, startAngle: number, endAngle: number, segments: number, color: Color): void;
/** Draw circle sector outline */
declare function drawCircleSectorLines(center: Vector2, radius: number, startAngle: number, endAngle: number, segments: number, color: Color): void;
/** Draw a gradient-filled circle */
declare function drawCircleGradient(centerX: number, centerY: number, radius: number, color1: Color, color2: Color): void;
/** Draw a color-filled circle (Vector version) */
declare function drawCircleV(center: Vector2, radius: number, color: Color): void;
/** Draw circle outline */
declare function drawCircleLines(centerX: number, centerY: number, radius: number, color: Color): void;
/** Draw ellipse */
declare function drawEllipse(centerX: number, centerY: number, radiusH: number, radiusV: number, color: Color): void;
/** Draw ellipse outline */
declare function drawEllipseLines(centerX: number, centerY: number, radiusH: number, radiusV: number, color: Color): void;
/** Draw ring */
declare function drawRing(center: Vector2, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number, segments: number, color: Color): void;
/** Draw ring outline */
declare function drawRingLines(center: Vector2, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number, segments: number, color: Color): void;
/** Draw a color-filled rectangle */
declare function drawRectangle(posX: number, posY: number, width: number, height: number, color: Color): void;
/** Draw a color-filled rectangle (Vector version) */
declare function drawRectangleV(position: Vector2, size: Vector2, color: Color): void;
/** Draw a color-filled rectangle */
declare function drawRectangleRec(rec: Rectangle, color: Color): void;
/** Draw a color-filled rectangle with pro parameters */
declare function drawRectanglePro(rec: Rectangle, origin: Vector2, rotation: number, color: Color): void;
/** Draw a vertical-gradient-filled rectangle */
declare function drawRectangleGradientV(posX: number, posY: number, width: number, height: number, color1: Color, color2: Color): void;
/** Draw a horizontal-gradient-filled rectangle */
declare function drawRectangleGradientH(posX: number, posY: number, width: number, height: number, color1: Color, color2: Color): void;
/** Draw a gradient-filled rectangle with custom vertex colors */
declare function drawRectangleGradientEx(rec: Rectangle, col1: Color, col2: Color, col3: Color, col4: Color): void;
/** Draw rectangle outline */
declare function drawRectangleLines(posX: number, posY: number, width: number, height: number, color: Color): void;
/** Draw rectangle outline with extended parameters */
declare function drawRectangleLinesEx(rec: Rectangle, lineThick: number, color: Color): void;
/** Draw rectangle with rounded edges */
declare function drawRectangleRounded(rec: Rectangle, roundness: number, segments: number, color: Color): void;
/** Draw rectangle with rounded edges outline */
declare function drawRectangleRoundedLines(rec: Rectangle, roundness: number, segments: number, lineThick: number, color: Color): void;
/** Draw a color-filled triangle (vertex in counter-clockwise order!) */
declare function drawTriangle(v1: Vector2, v2: Vector2, v3: Vector2, color: Color): void;
/** Draw triangle outline (vertex in counter-clockwise order!) */
declare function drawTriangleLines(v1: Vector2, v2: Vector2, v3: Vector2, color: Color): void;
/** Draw a regular polygon (Vector version) */
declare function drawPoly(center: Vector2, sides: number, radius: number, rotation: number, color: Color): void;
/** Draw a polygon outline of n sides */
declare function drawPolyLines(center: Vector2, sides: number, radius: number, rotation: number, color: Color): void;
/** Draw a polygon outline of n sides with extended parameters */
declare function drawPolyLinesEx(center: Vector2, sides: number, radius: number, rotation: number, lineThick: number, color: Color): void;
/** Check collision between two rectangles */
declare function checkCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean;
/** Check collision between two circles */
declare function checkCollisionCircles(center1: Vector2, radius1: number, center2: Vector2, radius2: number): boolean;
/** Check collision between circle and rectangle */
declare function checkCollisionCircleRec(center: Vector2, radius: number, rec: Rectangle): boolean;
/** Check if point is inside rectangle */
declare function checkCollisionPointRec(point: Vector2, rec: Rectangle): boolean;
/** Check if point is inside circle */
declare function checkCollisionPointCircle(point: Vector2, center: Vector2, radius: number): boolean;
/** Check if point is inside a triangle */
declare function checkCollisionPointTriangle(point: Vector2, p1: Vector2, p2: Vector2, p3: Vector2): boolean;
/** Check if point belongs to line created between two points [p1] and [p2] with defined margin in pixels [threshold] */
declare function checkCollisionPointLine(point: Vector2, p1: Vector2, p2: Vector2, threshold: number): boolean;
/** Get collision rectangle for two rectangles collision */
declare function getCollisionRec(rec1: Rectangle, rec2: Rectangle): Rectangle;
/** Load image from file into CPU memory (RAM) */
declare function loadImage(fileName: string | undefined | null): Image;
/** Load image from RAW file data */
declare function loadImageRaw(fileName: string | undefined | null, width: number, height: number, format: number, headerSize: number): Image;
/** Load image from memory buffer, fileType refers to extension: i.e. '.png' */
declare function loadImageFromMemory(fileType: string | undefined | null, fileData: ArrayBuffer, dataSize: number): Image;
/** Load image from GPU texture data */
declare function loadImageFromTexture(texture: Texture): Image;
/** Load image from screen buffer and (screenshot) */
declare function loadImageFromScreen(): Image;
/** Check if an image is ready */
declare function isImageReady(image: Image): boolean;
/** Unload image from CPU memory (RAM) */
declare function unloadImage(image: Image): void;
/** Export image data to file, returns true on success */
declare function exportImage(image: Image, fileName: string | undefined | null): boolean;
/** Generate image: plain color */
declare function genImageColor(width: number, height: number, color: Color): Image;
/** Generate image: linear gradient, direction in degrees [0..360], 0=Vertical gradient */
declare function genImageGradientLinear(width: number, height: number, direction: number, start: Color, end: Color): Image;
/** Generate image: radial gradient */
declare function genImageGradientRadial(width: number, height: number, density: number, inner: Color, outer: Color): Image;
/** Generate image: square gradient */
declare function genImageGradientSquare(width: number, height: number, density: number, inner: Color, outer: Color): Image;
/** Generate image: checked */
declare function genImageChecked(width: number, height: number, checksX: number, checksY: number, col1: Color, col2: Color): Image;
/** Generate image: white noise */
declare function genImageWhiteNoise(width: number, height: number, factor: number): Image;
/** Generate image: perlin noise */
declare function genImagePerlinNoise(width: number, height: number, offsetX: number, offsetY: number, scale: number): Image;
/** Generate image: cellular algorithm, bigger tileSize means bigger cells */
declare function genImageCellular(width: number, height: number, tileSize: number): Image;
/** Generate image: grayscale image from text data */
declare function genImageText(width: number, height: number, text: string | undefined | null): Image;
/** Create an image duplicate (useful for transformations) */
declare function imageCopy(image: Image): Image;
/** Create an image from another image piece */
declare function imageFromImage(image: Image, rec: Rectangle): Image;
/** Create an image from text (default font) */
declare function imageText(text: string | undefined | null, fontSize: number, color: Color): Image;
/** Create an image from text (custom sprite font) */
declare function imageTextEx(font: Font, text: string | undefined | null, fontSize: number, spacing: number, tint: Color): Image;
/** Convert image data to desired format */
declare function imageFormat(image: Image, newFormat: number): void;
/** Convert image to POT (power-of-two) */
declare function imageToPOT(image: Image, fill: Color): void;
/** Crop an image to a defined rectangle */
declare function imageCrop(image: Image, crop: Rectangle): void;
/** Crop image depending on alpha value */
declare function imageAlphaCrop(image: Image, threshold: number): void;
/** Clear alpha channel to desired color */
declare function imageAlphaClear(image: Image, color: Color, threshold: number): void;
/** Apply alpha mask to image */
declare function imageAlphaMask(image: Image, alphaMask: Image): void;
/** Premultiply alpha channel */
declare function imageAlphaPremultiply(image: Image): void;
/** Apply Gaussian blur using a box blur approximation */
declare function imageBlurGaussian(image: Image, blurSize: number): void;
/** Resize image (Bicubic scaling algorithm) */
declare function imageResize(image: Image, newWidth: number, newHeight: number): void;
/** Resize image (Nearest-Neighbor scaling algorithm) */
declare function imageResizeNN(image: Image, newWidth: number, newHeight: number): void;
/** Resize canvas and fill with color */
declare function imageResizeCanvas(image: Image, newWidth: number, newHeight: number, offsetX: number, offsetY: number, fill: Color): void;
/** Compute all mipmap levels for a provided image */
declare function imageMipmaps(image: Image): void;
/** Dither image data to 16bpp or lower (Floyd-Steinberg dithering) */
declare function imageDither(image: Image, rBpp: number, gBpp: number, bBpp: number, aBpp: number): void;
/** Flip image vertically */
declare function imageFlipVertical(image: Image): void;
/** Flip image horizontally */
declare function imageFlipHorizontal(image: Image): void;
/** Rotate image by input angle in degrees (-359 to 359)  */
declare function imageRotate(image: Image, degrees: number): void;
/** Rotate image clockwise 90deg */
declare function imageRotateCW(image: Image): void;
/** Rotate image counter-clockwise 90deg */
declare function imageRotateCCW(image: Image): void;
/** Modify image color: tint */
declare function imageColorTint(image: Image, color: Color): void;
/** Modify image color: invert */
declare function imageColorInvert(image: Image): void;
/** Modify image color: grayscale */
declare function imageColorGrayscale(image: Image): void;
/** Modify image color: contrast (-100 to 100) */
declare function imageColorContrast(image: Image, contrast: number): void;
/** Modify image color: brightness (-255 to 255) */
declare function imageColorBrightness(image: Image, brightness: number): void;
/** Modify image color: replace color */
declare function imageColorReplace(image: Image, color: Color, replace: Color): void;
/** Load color data from image as a Color array (RGBA - 32bit) */
declare function loadImageColors(image: Image): ArrayBuffer;
/** Get image alpha border rectangle */
declare function getImageAlphaBorder(image: Image, threshold: number): Rectangle;
/** Get image pixel color at (x, y) position */
declare function getImageColor(image: Image, x: number, y: number): Color;
/** Clear image background with given color */
declare function imageClearBackground(dst: Image, color: Color): void;
/** Draw pixel within an image */
declare function imageDrawPixel(dst: Image, posX: number, posY: number, color: Color): void;
/** Draw pixel within an image (Vector version) */
declare function imageDrawPixelV(dst: Image, position: Vector2, color: Color): void;
/** Draw line within an image */
declare function imageDrawLine(dst: Image, startPosX: number, startPosY: number, endPosX: number, endPosY: number, color: Color): void;
/** Draw line within an image (Vector version) */
declare function imageDrawLineV(dst: Image, start: Vector2, end: Vector2, color: Color): void;
/** Draw a filled circle within an image */
declare function imageDrawCircle(dst: Image, centerX: number, centerY: number, radius: number, color: Color): void;
/** Draw a filled circle within an image (Vector version) */
declare function imageDrawCircleV(dst: Image, center: Vector2, radius: number, color: Color): void;
/** Draw circle outline within an image */
declare function imageDrawCircleLines(dst: Image, centerX: number, centerY: number, radius: number, color: Color): void;
/** Draw circle outline within an image (Vector version) */
declare function imageDrawCircleLinesV(dst: Image, center: Vector2, radius: number, color: Color): void;
/** Draw rectangle within an image */
declare function imageDrawRectangle(dst: Image, posX: number, posY: number, width: number, height: number, color: Color): void;
/** Draw rectangle within an image (Vector version) */
declare function imageDrawRectangleV(dst: Image, position: Vector2, size: Vector2, color: Color): void;
/** Draw rectangle within an image */
declare function imageDrawRectangleRec(dst: Image, rec: Rectangle, color: Color): void;
/** Draw rectangle lines within an image */
declare function imageDrawRectangleLines(dst: Image, rec: Rectangle, thick: number, color: Color): void;
/** Draw a source image within a destination image (tint applied to source) */
declare function imageDraw(dst: Image, src: Image, srcRec: Rectangle, dstRec: Rectangle, tint: Color): void;
/** Draw text (using default font) within an image (destination) */
declare function imageDrawText(dst: Image, text: string | undefined | null, posX: number, posY: number, fontSize: number, color: Color): void;
/** Draw text (custom sprite font) within an image (destination) */
declare function imageDrawTextEx(dst: Image, font: Font, text: string | undefined | null, position: Vector2, fontSize: number, spacing: number, tint: Color): void;
/** Load texture from file into GPU memory (VRAM) */
declare function loadTexture(fileName: string | undefined | null): Texture;
/** Load texture from image data */
declare function loadTextureFromImage(image: Image): Texture;
/** Load cubemap from image, multiple image cubemap layouts supported */
declare function loadTextureCubemap(image: Image, layout: number): Texture;
/** Load texture for rendering (framebuffer) */
declare function loadRenderTexture(width: number, height: number): RenderTexture;
/** Check if a texture is ready */
declare function isTextureReady(texture: Texture): boolean;
/** Unload texture from GPU memory (VRAM) */
declare function unloadTexture(texture: Texture): void;
/** Check if a render texture is ready */
declare function isRenderTextureReady(target: RenderTexture): boolean;
/** Unload render texture from GPU memory (VRAM) */
declare function unloadRenderTexture(target: RenderTexture): void;
/** Update GPU texture with new data */
declare function updateTexture(texture: Texture, pixels: any): void;
/** Update GPU texture rectangle with new data */
declare function updateTextureRec(texture: Texture, rec: Rectangle, pixels: any): void;
/** Generate GPU mipmaps for a texture */
declare function genTextureMipmaps(texture: Texture): void;
/** Set texture scaling filter mode */
declare function setTextureFilter(texture: Texture, filter: number): void;
/** Set texture wrapping mode */
declare function setTextureWrap(texture: Texture, wrap: number): void;
/** Draw a Texture2D */
declare function drawTexture(texture: Texture, posX: number, posY: number, tint: Color): void;
/** Draw a Texture2D with position defined as Vector2 */
declare function drawTextureV(texture: Texture, position: Vector2, tint: Color): void;
/** Draw a Texture2D with extended parameters */
declare function drawTextureEx(texture: Texture, position: Vector2, rotation: number, scale: number, tint: Color): void;
/** Draw a part of a texture defined by a rectangle */
declare function drawTextureRec(texture: Texture, source: Rectangle, position: Vector2, tint: Color): void;
/** Draw a part of a texture defined by a rectangle with 'pro' parameters */
declare function drawTexturePro(texture: Texture, source: Rectangle, dest: Rectangle, origin: Vector2, rotation: number, tint: Color): void;
/** Draws a texture (or part of it) that stretches or shrinks nicely */
declare function drawTextureNPatch(texture: Texture, nPatchInfo: NPatchInfo, dest: Rectangle, origin: Vector2, rotation: number, tint: Color): void;
/** Get color with alpha applied, alpha goes from 0.0f to 1.0f */
declare function fade(color: Color, alpha: number): Color;
/** Get hexadecimal value for a Color */
declare function colorToInt(color: Color): number;
/** Get Color normalized as float [0..1] */
declare function colorNormalize(color: Color): Vector4;
/** Get Color from normalized values [0..1] */
declare function colorFromNormalized(normalized: Vector4): Color;
/** Get HSV values for a Color, hue [0..360], saturation/value [0..1] */
declare function colorToHSV(color: Color): Vector3;
/** Get a Color from HSV values, hue [0..360], saturation/value [0..1] */
declare function colorFromHSV(hue: number, saturation: number, value: number): Color;
/** Get color multiplied with another color */
declare function colorTint(color: Color, tint: Color): Color;
/** Get color with brightness correction, brightness factor goes from -1.0f to 1.0f */
declare function colorBrightness(color: Color, factor: number): Color;
/** Get color with contrast correction, contrast values between -1.0f and 1.0f */
declare function colorContrast(color: Color, contrast: number): Color;
/** Get color with alpha applied, alpha goes from 0.0f to 1.0f */
declare function colorAlpha(color: Color, alpha: number): Color;
/** Get src alpha-blended into dst color with tint */
declare function colorAlphaBlend(dst: Color, src: Color, tint: Color): Color;
/** Get Color structure from hexadecimal value */
declare function getColor(hexValue: number): Color;
/** Get pixel data size in bytes for certain format */
declare function getPixelDataSize(width: number, height: number, format: number): number;
/** Get the default Font */
declare function getFontDefault(): Font;
/** Load font from file into GPU memory (VRAM) */
declare function loadFont(fileName: string | undefined | null): Font;
/** Load font from file with extended parameters, use NULL for fontChars and 0 for glyphCount to load the default character set */
declare function loadFontEx(fileName: string | undefined | null, fontSize: number): Font;
/** Load font from Image (XNA style) */
declare function loadFontFromImage(image: Image, key: Color, firstChar: number): Font;
/** Check if a font is ready */
declare function isFontReady(font: Font): boolean;
/** Unload font from GPU memory (VRAM) */
declare function unloadFont(font: Font): void;
/** Draw current FPS */
declare function drawFPS(posX: number, posY: number): void;
/** Draw text (using default font) */
declare function drawText(text: string | undefined | null, posX: number, posY: number, fontSize: number, color: Color): void;
/** Draw text using font and additional parameters */
declare function drawTextEx(font: Font, text: string | undefined | null, position: Vector2, fontSize: number, spacing: number, tint: Color): void;
/** Draw text using Font and pro parameters (rotation) */
declare function drawTextPro(font: Font, text: string | undefined | null, position: Vector2, origin: Vector2, rotation: number, fontSize: number, spacing: number, tint: Color): void;
/** Draw one character (codepoint) */
declare function drawTextCodepoint(font: Font, codepoint: number, position: Vector2, fontSize: number, tint: Color): void;
/** Measure string width for default font */
declare function measureText(text: string | undefined | null, fontSize: number): number;
/** Measure string size for Font */
declare function measureTextEx(font: Font, text: string | undefined | null, fontSize: number, spacing: number): Vector2;
/** Get glyph index position in font for a codepoint (unicode character), fallback to '?' if not found */
declare function getGlyphIndex(font: Font, codepoint: number): number;
/** Get glyph rectangle in font atlas for a codepoint (unicode character), fallback to '?' if not found */
declare function getGlyphAtlasRec(font: Font, codepoint: number): Rectangle;
/** Draw a line in 3D world space */
declare function drawLine3D(startPos: Vector3, endPos: Vector3, color: Color): void;
/** Draw a point in 3D space, actually a small line */
declare function drawPoint3D(position: Vector3, color: Color): void;
/** Draw a circle in 3D world space */
declare function drawCircle3D(center: Vector3, radius: number, rotationAxis: Vector3, rotationAngle: number, color: Color): void;
/** Draw a color-filled triangle (vertex in counter-clockwise order!) */
declare function drawTriangle3D(v1: Vector3, v2: Vector3, v3: Vector3, color: Color): void;
/** Draw cube */
declare function drawCube(position: Vector3, width: number, height: number, length: number, color: Color): void;
/** Draw cube (Vector version) */
declare function drawCubeV(position: Vector3, size: Vector3, color: Color): void;
/** Draw cube wires */
declare function drawCubeWires(position: Vector3, width: number, height: number, length: number, color: Color): void;
/** Draw cube wires (Vector version) */
declare function drawCubeWiresV(position: Vector3, size: Vector3, color: Color): void;
/** Draw sphere */
declare function drawSphere(centerPos: Vector3, radius: number, color: Color): void;
/** Draw sphere with extended parameters */
declare function drawSphereEx(centerPos: Vector3, radius: number, rings: number, slices: number, color: Color): void;
/** Draw sphere wires */
declare function drawSphereWires(centerPos: Vector3, radius: number, rings: number, slices: number, color: Color): void;
/** Draw a cylinder/cone */
declare function drawCylinder(position: Vector3, radiusTop: number, radiusBottom: number, height: number, slices: number, color: Color): void;
/** Draw a cylinder with base at startPos and top at endPos */
declare function drawCylinderEx(startPos: Vector3, endPos: Vector3, startRadius: number, endRadius: number, sides: number, color: Color): void;
/** Draw a cylinder/cone wires */
declare function drawCylinderWires(position: Vector3, radiusTop: number, radiusBottom: number, height: number, slices: number, color: Color): void;
/** Draw a cylinder wires with base at startPos and top at endPos */
declare function drawCylinderWiresEx(startPos: Vector3, endPos: Vector3, startRadius: number, endRadius: number, sides: number, color: Color): void;
/** Draw a capsule with the center of its sphere caps at startPos and endPos */
declare function drawCapsule(startPos: Vector3, endPos: Vector3, radius: number, slices: number, rings: number, color: Color): void;
/** Draw capsule wireframe with the center of its sphere caps at startPos and endPos */
declare function drawCapsuleWires(startPos: Vector3, endPos: Vector3, radius: number, slices: number, rings: number, color: Color): void;
/** Draw a plane XZ */
declare function drawPlane(centerPos: Vector3, size: Vector2, color: Color): void;
/** Draw a ray line */
declare function drawRay(ray: Ray, color: Color): void;
/** Draw a grid (centered at (0, 0, 0)) */
declare function drawGrid(slices: number, spacing: number): void;
/** Load model from files (meshes and materials) */
declare function loadModel(fileName: string | undefined | null): Model;
/** Load model from generated mesh (default material) */
declare function loadModelFromMesh(mesh: Mesh): Model;
/** Check if a model is ready */
declare function isModelReady(model: Model): boolean;
/** Unload model (including meshes) from memory (RAM and/or VRAM) */
declare function unloadModel(model: Model): void;
/** Compute model bounding box limits (considers all meshes) */
declare function getModelBoundingBox(model: Model): BoundingBox;
/** Draw a model (with texture if set) */
declare function drawModel(model: Model, position: Vector3, scale: number, tint: Color): void;
/** Draw a model with extended parameters */
declare function drawModelEx(model: Model, position: Vector3, rotationAxis: Vector3, rotationAngle: number, scale: Vector3, tint: Color): void;
/** Draw a model wires (with texture if set) */
declare function drawModelWires(model: Model, position: Vector3, scale: number, tint: Color): void;
/** Draw a model wires (with texture if set) with extended parameters */
declare function drawModelWiresEx(model: Model, position: Vector3, rotationAxis: Vector3, rotationAngle: number, scale: Vector3, tint: Color): void;
/** Draw bounding box (wires) */
declare function drawBoundingBox(box: BoundingBox, color: Color): void;
/** Draw a billboard texture */
declare function drawBillboard(camera: Camera3D, texture: Texture, position: Vector3, size: number, tint: Color): void;
/** Draw a billboard texture defined by source */
declare function drawBillboardRec(camera: Camera3D, texture: Texture, source: Rectangle, position: Vector3, size: Vector2, tint: Color): void;
/** Draw a billboard texture defined by source and rotation */
declare function drawBillboardPro(camera: Camera3D, texture: Texture, source: Rectangle, position: Vector3, up: Vector3, size: Vector2, origin: Vector2, rotation: number, tint: Color): void;
/** Upload mesh vertex data in GPU and provide VAO/VBO ids */
declare function uploadMesh(mesh: Mesh, dynamic: boolean): void;
/** Update mesh vertex data in GPU for a specific buffer index */
declare function updateMeshBuffer(mesh: Mesh, index: number, data: any, dataSize: number, offset: number): void;
/** Unload mesh data from CPU and GPU */
declare function unloadMesh(mesh: Mesh): void;
/** Draw a 3d mesh with material and transform */
declare function drawMesh(mesh: Mesh, material: Material, transform: Matrix): void;
/** Draw multiple mesh instances with material and different transforms */
declare function drawMeshInstanced(mesh: Mesh, material: Material, transforms: Matrix, instances: number): void;
/** Export mesh data to file, returns true on success */
declare function exportMesh(mesh: Mesh, fileName: string | undefined | null): boolean;
/** Compute mesh bounding box limits */
declare function getMeshBoundingBox(mesh: Mesh): BoundingBox;
/** Compute mesh tangents */
declare function genMeshTangents(mesh: Mesh): void;
/** Generate polygonal mesh */
declare function genMeshPoly(sides: number, radius: number): Mesh;
/** Generate plane mesh (with subdivisions) */
declare function genMeshPlane(width: number, length: number, resX: number, resZ: number): Mesh;
/** Generate cuboid mesh */
declare function genMeshCube(width: number, height: number, length: number): Mesh;
/** Generate sphere mesh (standard sphere) */
declare function genMeshSphere(radius: number, rings: number, slices: number): Mesh;
/** Generate half-sphere mesh (no bottom cap) */
declare function genMeshHemiSphere(radius: number, rings: number, slices: number): Mesh;
/** Generate cylinder mesh */
declare function genMeshCylinder(radius: number, height: number, slices: number): Mesh;
/** Generate cone/pyramid mesh */
declare function genMeshCone(radius: number, height: number, slices: number): Mesh;
/** Generate torus mesh */
declare function genMeshTorus(radius: number, size: number, radSeg: number, sides: number): Mesh;
/** Generate trefoil knot mesh */
declare function genMeshKnot(radius: number, size: number, radSeg: number, sides: number): Mesh;
/** Generate heightmap mesh from image data */
declare function genMeshHeightmap(heightmap: Image, size: Vector3): Mesh;
/** Generate cubes-based map mesh from image data */
declare function genMeshCubicmap(cubicmap: Image, cubeSize: Vector3): Mesh;
/** Load default material (Supports: DIFFUSE, SPECULAR, NORMAL maps) */
declare function loadMaterialDefault(): Material;
/** Check if a material is ready */
declare function isMaterialReady(material: Material): boolean;
/** Unload material from GPU memory (VRAM) */
declare function unloadMaterial(material: Material): void;
/** Set texture for a material map type (MATERIAL_MAP_DIFFUSE, MATERIAL_MAP_SPECULAR...) */
declare function setMaterialTexture(material: Material, mapType: number, texture: Texture): void;
/** Set material for a mesh */
declare function setModelMeshMaterial(model: Model, meshId: number, materialId: number): void;
/** Check collision between two spheres */
declare function checkCollisionSpheres(center1: Vector3, radius1: number, center2: Vector3, radius2: number): boolean;
/** Check collision between two bounding boxes */
declare function checkCollisionBoxes(box1: BoundingBox, box2: BoundingBox): boolean;
/** Check collision between box and sphere */
declare function checkCollisionBoxSphere(box: BoundingBox, center: Vector3, radius: number): boolean;
/** Get collision info between ray and sphere */
declare function getRayCollisionSphere(ray: Ray, center: Vector3, radius: number): RayCollision;
/** Get collision info between ray and box */
declare function getRayCollisionBox(ray: Ray, box: BoundingBox): RayCollision;
/** Get collision info between ray and mesh */
declare function getRayCollisionMesh(ray: Ray, mesh: Mesh, transform: Matrix): RayCollision;
/** Get collision info between ray and triangle */
declare function getRayCollisionTriangle(ray: Ray, p1: Vector3, p2: Vector3, p3: Vector3): RayCollision;
/** Get collision info between ray and quad */
declare function getRayCollisionQuad(ray: Ray, p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): RayCollision;
/** Initialize audio device and context */
declare function initAudioDevice(): void;
/** Close the audio device and context */
declare function closeAudioDevice(): void;
/** Check if audio device has been initialized successfully */
declare function isAudioDeviceReady(): boolean;
/** Set master volume (listener) */
declare function setMasterVolume(volume: number): void;
/** Load wave data from file */
declare function loadWave(fileName: string | undefined | null): Wave;
/** Load wave from memory buffer, fileType refers to extension: i.e. '.wav' */
declare function loadWaveFromMemory(fileType: string | undefined | null, fileData: ArrayBuffer, dataSize: number): Wave;
/** Checks if wave data is ready */
declare function isWaveReady(wave: Wave): boolean;
/** Load sound from file */
declare function loadSound(fileName: string | undefined | null): Sound;
/** Load sound from wave data */
declare function loadSoundFromWave(wave: Wave): Sound;
/** Checks if a sound is ready */
declare function isSoundReady(sound: Sound): boolean;
/** Update sound buffer with new data */
declare function updateSound(sound: Sound, data: any, sampleCount: number): void;
/** Unload wave data */
declare function unloadWave(wave: Wave): void;
/** Unload sound */
declare function unloadSound(sound: Sound): void;
/** Export wave data to file, returns true on success */
declare function exportWave(wave: Wave, fileName: string | undefined | null): boolean;
/** Play a sound */
declare function playSound(sound: Sound): void;
/** Stop playing a sound */
declare function stopSound(sound: Sound): void;
/** Pause a sound */
declare function pauseSound(sound: Sound): void;
/** Resume a paused sound */
declare function resumeSound(sound: Sound): void;
/** Check if a sound is currently playing */
declare function isSoundPlaying(sound: Sound): boolean;
/** Set volume for a sound (1.0 is max level) */
declare function setSoundVolume(sound: Sound, volume: number): void;
/** Set pitch for a sound (1.0 is base level) */
declare function setSoundPitch(sound: Sound, pitch: number): void;
/** Set pan for a sound (0.5 is center) */
declare function setSoundPan(sound: Sound, pan: number): void;
/** Copy a wave to a new wave */
declare function waveCopy(wave: Wave): Wave;
/** Crop a wave to defined samples range */
declare function waveCrop(wave: Wave, initSample: number, finalSample: number): void;
/** Convert wave data to desired format */
declare function waveFormat(wave: Wave, sampleRate: number, sampleSize: number, channels: number): void;
/** Load music stream from file */
declare function loadMusicStream(fileName: string | undefined | null): Music;
/** Checks if a music stream is ready */
declare function isMusicReady(music: Music): boolean;
/** Unload music stream */
declare function unloadMusicStream(music: Music): void;
/** Start music playing */
declare function playMusicStream(music: Music): void;
/** Check if music is playing */
declare function isMusicStreamPlaying(music: Music): boolean;
/** Updates buffers for music streaming */
declare function updateMusicStream(music: Music): void;
/** Stop music playing */
declare function stopMusicStream(music: Music): void;
/** Pause music playing */
declare function pauseMusicStream(music: Music): void;
/** Resume playing paused music */
declare function resumeMusicStream(music: Music): void;
/** Seek music to a position (in seconds) */
declare function seekMusicStream(music: Music, position: number): void;
/** Set volume for music (1.0 is max level) */
declare function setMusicVolume(music: Music, volume: number): void;
/** Set pitch for a music (1.0 is base level) */
declare function setMusicPitch(music: Music, pitch: number): void;
/** Set pan for a music (0.5 is center) */
declare function setMusicPan(music: Music, pan: number): void;
/** Get music time length (in seconds) */
declare function getMusicTimeLength(music: Music): number;
/** Get current music time played (in seconds) */
declare function getMusicTimePlayed(music: Music): number;
/** Clamp float value */
declare function clamp(value: number, min: number, max: number): number;
/** Calculate linear interpolation between two floats */
declare function lerp(start: number, end: number, amount: number): number;
/** Normalize input value within input range */
declare function normalize(value: number, start: number, end: number): number;
/** Remap input value within input range to output range */
declare function remap(value: number, inputStart: number, inputEnd: number, outputStart: number, outputEnd: number): number;
/** Wrap input value from min to max */
declare function wrap(value: number, min: number, max: number): number;
/** Check whether two given floats are almost equal */
declare function floatEquals(x: number, y: number): number;
/** Vector with components value 0.0f */
declare function vector2Zero(): Vector2;
/** Vector with components value 1.0f */
declare function vector2One(): Vector2;
/** Add two vectors (v1 + v2) */
declare function vector2Add(v1: Vector2, v2: Vector2): Vector2;
/** Add vector and float value */
declare function vector2AddValue(v: Vector2, add: number): Vector2;
/** Subtract two vectors (v1 - v2) */
declare function vector2Subtract(v1: Vector2, v2: Vector2): Vector2;
/** Subtract vector by float value */
declare function vector2SubtractValue(v: Vector2, sub: number): Vector2;
/** Calculate vector length */
declare function vector2Length(v: Vector2): number;
/** Calculate vector square length */
declare function vector2LengthSqr(v: Vector2): number;
/** Calculate two vectors dot product */
declare function vector2DotProduct(v1: Vector2, v2: Vector2): number;
/** Calculate distance between two vectors */
declare function vector2Distance(v1: Vector2, v2: Vector2): number;
/** Calculate square distance between two vectors */
declare function vector2DistanceSqr(v1: Vector2, v2: Vector2): number;
/** Calculate angle between two vectors
NOTE: Angle is calculated from origin point (0, 0) */
declare function vector2Angle(v1: Vector2, v2: Vector2): number;
/** Calculate angle defined by a two vectors line
NOTE: Parameters need to be normalized
Current implementation should be aligned with glm::angle */
declare function vector2LineAngle(start: Vector2, end: Vector2): number;
/** Scale vector (multiply by value) */
declare function vector2Scale(v: Vector2, scale: number): Vector2;
/** Multiply vector by vector */
declare function vector2Multiply(v1: Vector2, v2: Vector2): Vector2;
/** Negate vector */
declare function vector2Negate(v: Vector2): Vector2;
/** Divide vector by vector */
declare function vector2Divide(v1: Vector2, v2: Vector2): Vector2;
/** Normalize provided vector */
declare function vector2Normalize(v: Vector2): Vector2;
/** Transforms a Vector2 by a given Matrix */
declare function vector2Transform(v: Vector2, mat: Matrix): Vector2;
/** Calculate linear interpolation between two vectors */
declare function vector2Lerp(v1: Vector2, v2: Vector2, amount: number): Vector2;
/** Calculate reflected vector to normal */
declare function vector2Reflect(v: Vector2, normal: Vector2): Vector2;
/** Rotate vector by angle */
declare function vector2Rotate(v: Vector2, angle: number): Vector2;
/** Move Vector towards target */
declare function vector2MoveTowards(v: Vector2, target: Vector2, maxDistance: number): Vector2;
/** Invert the given vector */
declare function vector2Invert(v: Vector2): Vector2;
/** Clamp the components of the vector between
min and max values specified by the given vectors */
declare function vector2Clamp(v: Vector2, min: Vector2, max: Vector2): Vector2;
/** Clamp the magnitude of the vector between two min and max values */
declare function vector2ClampValue(v: Vector2, min: number, max: number): Vector2;
/** Check whether two given vectors are almost equal */
declare function vector2Equals(p: Vector2, q: Vector2): number;
/** Vector with components value 0.0f */
declare function vector3Zero(): Vector3;
/** Vector with components value 1.0f */
declare function vector3One(): Vector3;
/** Add two vectors */
declare function vector3Add(v1: Vector3, v2: Vector3): Vector3;
/** Add vector and float value */
declare function vector3AddValue(v: Vector3, add: number): Vector3;
/** Subtract two vectors */
declare function vector3Subtract(v1: Vector3, v2: Vector3): Vector3;
/** Subtract vector by float value */
declare function vector3SubtractValue(v: Vector3, sub: number): Vector3;
/** Multiply vector by scalar */
declare function vector3Scale(v: Vector3, scalar: number): Vector3;
/** Multiply vector by vector */
declare function vector3Multiply(v1: Vector3, v2: Vector3): Vector3;
/** Calculate two vectors cross product */
declare function vector3CrossProduct(v1: Vector3, v2: Vector3): Vector3;
/** Calculate one vector perpendicular vector */
declare function vector3Perpendicular(v: Vector3): Vector3;
/** Calculate vector length */
declare function vector3Length(v: Vector3): number;
/** Calculate vector square length */
declare function vector3LengthSqr(v: Vector3): number;
/** Calculate two vectors dot product */
declare function vector3DotProduct(v1: Vector3, v2: Vector3): number;
/** Calculate distance between two vectors */
declare function vector3Distance(v1: Vector3, v2: Vector3): number;
/** Calculate square distance between two vectors */
declare function vector3DistanceSqr(v1: Vector3, v2: Vector3): number;
/** Calculate angle between two vectors */
declare function vector3Angle(v1: Vector3, v2: Vector3): number;
/** Negate provided vector (invert direction) */
declare function vector3Negate(v: Vector3): Vector3;
/** Divide vector by vector */
declare function vector3Divide(v1: Vector3, v2: Vector3): Vector3;
/** Normalize provided vector */
declare function vector3Normalize(v: Vector3): Vector3;
/** Transforms a Vector3 by a given Matrix */
declare function vector3Transform(v: Vector3, mat: Matrix): Vector3;
/** Transform a vector by quaternion rotation */
declare function vector3RotateByQuaternion(v: Vector3, q: Vector4): Vector3;
/** Rotates a vector around an axis */
declare function vector3RotateByAxisAngle(v: Vector3, axis: Vector3, angle: number): Vector3;
/** Calculate linear interpolation between two vectors */
declare function vector3Lerp(v1: Vector3, v2: Vector3, amount: number): Vector3;
/** Calculate reflected vector to normal */
declare function vector3Reflect(v: Vector3, normal: Vector3): Vector3;
/** Get min value for each pair of components */
declare function vector3Min(v1: Vector3, v2: Vector3): Vector3;
/** Get max value for each pair of components */
declare function vector3Max(v1: Vector3, v2: Vector3): Vector3;
/** Compute barycenter coordinates (u, v, w) for point p with respect to triangle (a, b, c)
NOTE: Assumes P is on the plane of the triangle */
declare function vector3Barycenter(p: Vector3, a: Vector3, b: Vector3, c: Vector3): Vector3;
/** Projects a Vector3 from screen space into object space
NOTE: We are avoiding calling other raymath functions despite available */
declare function vector3Unproject(source: Vector3, projection: Matrix, view: Matrix): Vector3;
/** Invert the given vector */
declare function vector3Invert(v: Vector3): Vector3;
/** Clamp the components of the vector between
min and max values specified by the given vectors */
declare function vector3Clamp(v: Vector3, min: Vector3, max: Vector3): Vector3;
/** Clamp the magnitude of the vector between two values */
declare function vector3ClampValue(v: Vector3, min: number, max: number): Vector3;
/** Check whether two given vectors are almost equal */
declare function vector3Equals(p: Vector3, q: Vector3): number;
/** Compute the direction of a refracted ray where v specifies the
normalized direction of the incoming ray, n specifies the
normalized normal vector of the interface of two optical media,
and r specifies the ratio of the refractive index of the medium
from where the ray comes to the refractive index of the medium
on the other side of the surface */
declare function vector3Refract(v: Vector3, n: Vector3, r: number): Vector3;
/** Compute matrix determinant */
declare function matrixDeterminant(mat: Matrix): number;
/** Get the trace of the matrix (sum of the values along the diagonal) */
declare function matrixTrace(mat: Matrix): number;
/** Transposes provided matrix */
declare function matrixTranspose(mat: Matrix): Matrix;
/** Invert provided matrix */
declare function matrixInvert(mat: Matrix): Matrix;
/** Get identity matrix */
declare function matrixIdentity(): Matrix;
/** Add two matrices */
declare function matrixAdd(left: Matrix, right: Matrix): Matrix;
/** Subtract two matrices (left - right) */
declare function matrixSubtract(left: Matrix, right: Matrix): Matrix;
/** Get two matrix multiplication
NOTE: When multiplying matrices... the order matters! */
declare function matrixMultiply(left: Matrix, right: Matrix): Matrix;
/** Get translation matrix */
declare function matrixTranslate(x: number, y: number, z: number): Matrix;
/** Create rotation matrix from axis and angle
NOTE: Angle should be provided in radians */
declare function matrixRotate(axis: Vector3, angle: number): Matrix;
/** Get x-rotation matrix
NOTE: Angle must be provided in radians */
declare function matrixRotateX(angle: number): Matrix;
/** Get y-rotation matrix
NOTE: Angle must be provided in radians */
declare function matrixRotateY(angle: number): Matrix;
/** Get z-rotation matrix
NOTE: Angle must be provided in radians */
declare function matrixRotateZ(angle: number): Matrix;
/** Get xyz-rotation matrix
NOTE: Angle must be provided in radians */
declare function matrixRotateXYZ(angle: Vector3): Matrix;
/** Get zyx-rotation matrix
NOTE: Angle must be provided in radians */
declare function matrixRotateZYX(angle: Vector3): Matrix;
/** Get scaling matrix */
declare function matrixScale(x: number, y: number, z: number): Matrix;
/** Get perspective projection matrix */
declare function matrixFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix;
/** Get perspective projection matrix
NOTE: Fovy angle must be provided in radians */
declare function matrixPerspective(fovY: number, aspect: number, nearPlane: number, farPlane: number): Matrix;
/** Get orthographic projection matrix */
declare function matrixOrtho(left: number, right: number, bottom: number, top: number, nearPlane: number, farPlane: number): Matrix;
/** Get camera look-at matrix (view matrix) */
declare function matrixLookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix;
/** Add two quaternions */
declare function quaternionAdd(q1: Vector4, q2: Vector4): Vector4;
/** Add quaternion and float value */
declare function quaternionAddValue(q: Vector4, add: number): Vector4;
/** Subtract two quaternions */
declare function quaternionSubtract(q1: Vector4, q2: Vector4): Vector4;
/** Subtract quaternion and float value */
declare function quaternionSubtractValue(q: Vector4, sub: number): Vector4;
/** Get identity quaternion */
declare function quaternionIdentity(): Vector4;
/** Computes the length of a quaternion */
declare function quaternionLength(q: Vector4): number;
/** Normalize provided quaternion */
declare function quaternionNormalize(q: Vector4): Vector4;
/** Invert provided quaternion */
declare function quaternionInvert(q: Vector4): Vector4;
/** Calculate two quaternion multiplication */
declare function quaternionMultiply(q1: Vector4, q2: Vector4): Vector4;
/** Scale quaternion by float value */
declare function quaternionScale(q: Vector4, mul: number): Vector4;
/** Divide two quaternions */
declare function quaternionDivide(q1: Vector4, q2: Vector4): Vector4;
/** Calculate linear interpolation between two quaternions */
declare function quaternionLerp(q1: Vector4, q2: Vector4, amount: number): Vector4;
/** Calculate slerp-optimized interpolation between two quaternions */
declare function quaternionNlerp(q1: Vector4, q2: Vector4, amount: number): Vector4;
/** Calculates spherical linear interpolation between two quaternions */
declare function quaternionSlerp(q1: Vector4, q2: Vector4, amount: number): Vector4;
/** Calculate quaternion based on the rotation from one vector to another */
declare function quaternionFromVector3ToVector3(from: Vector3, to: Vector3): Vector4;
/** Get a quaternion for a given rotation matrix */
declare function quaternionFromMatrix(mat: Matrix): Vector4;
/** Get a matrix for a given quaternion */
declare function quaternionToMatrix(q: Vector4): Matrix;
/** Get rotation quaternion for an angle and axis
NOTE: Angle must be provided in radians */
declare function quaternionFromAxisAngle(axis: Vector3, angle: number): Vector4;
/** Get the quaternion equivalent to Euler angles
NOTE: Rotation order is ZYX */
declare function quaternionFromEuler(pitch: number, yaw: number, roll: number): Vector4;
/** Get the Euler angles equivalent to quaternion (roll, pitch, yaw)
NOTE: Angles are returned in a Vector3 struct in radians */
declare function quaternionToEuler(q: Vector4): Vector3;
/** Transform a quaternion given a transformation matrix */
declare function quaternionTransform(q: Vector4, mat: Matrix): Vector4;
/** Check whether two given quaternions are almost equal */
declare function quaternionEquals(p: Vector4, q: Vector4): number;
/**  */
declare function getCameraForward(camera: Camera3D): Vector3;
/**  */
declare function getCameraUp(camera: Camera3D): Vector3;
/**  */
declare function getCameraRight(camera: Camera3D): Vector3;
/**  */
declare function cameraMoveForward(camera: Camera3D, distance: number, moveInWorldPlane: boolean): void;
/**  */
declare function cameraMoveUp(camera: Camera3D, distance: number): void;
/**  */
declare function cameraMoveRight(camera: Camera3D, distance: number, moveInWorldPlane: boolean): void;
/**  */
declare function cameraMoveToTarget(camera: Camera3D, delta: number): void;
/**  */
declare function cameraYaw(camera: Camera3D, angle: number, rotateAroundTarget: boolean): void;
/**  */
declare function cameraPitch(camera: Camera3D, angle: number, lockView: boolean, rotateAroundTarget: boolean, rotateUp: boolean): void;
/**  */
declare function cameraRoll(camera: Camera3D, angle: number): void;
/**  */
declare function getCameraViewMatrix(camera: Camera3D): Matrix;
/**  */
declare function getCameraProjectionMatrix(camera: Camera3D, aspect: number): Matrix;
/** Enable gui controls (global state) */
declare function guiEnable(): void;
/** Disable gui controls (global state) */
declare function guiDisable(): void;
/** Lock gui controls (global state) */
declare function guiLock(): void;
/** Unlock gui controls (global state) */
declare function guiUnlock(): void;
/** Check if gui is locked (global state) */
declare function guiIsLocked(): boolean;
/** Set gui controls alpha (global state), alpha goes from 0.0f to 1.0f */
declare function guiFade(alpha: number): void;
/** Set gui state (global state) */
declare function guiSetState(state: number): void;
/** Get gui state (global state) */
declare function guiGetState(): number;
/** Set gui custom font (global state) */
declare function guiSetFont(font: Font): void;
/** Get gui custom font (global state) */
declare function guiGetFont(): Font;
/** Set one style property */
declare function guiSetStyle(control: number, property: number, value: number): void;
/** Get one style property */
declare function guiGetStyle(control: number, property: number): number;
/** Window Box control, shows a window that can be closed */
declare function guiWindowBox(bounds: Rectangle, title: string | undefined | null): boolean;
/** Group Box control with text name */
declare function guiGroupBox(bounds: Rectangle, text: string | undefined | null): void;
/** Line separator control, could contain text */
declare function guiLine(bounds: Rectangle, text: string | undefined | null): void;
/** Panel control, useful to group controls */
declare function guiPanel(bounds: Rectangle, text: string | undefined | null): void;
/** Scroll Panel control */
declare function guiScrollPanel(bounds: Rectangle, text: string | undefined | null, content: Rectangle, scroll: Vector2): Rectangle;
/** Label control, shows text */
declare function guiLabel(bounds: Rectangle, text: string | undefined | null): void;
/** Button control, returns true when clicked */
declare function guiButton(bounds: Rectangle, text: string | undefined | null): boolean;
/** Label button control, show true when clicked */
declare function guiLabelButton(bounds: Rectangle, text: string | undefined | null): boolean;
/** Toggle Button control, returns true when active */
declare function guiToggle(bounds: Rectangle, text: string | undefined | null, active: boolean): boolean;
/** Toggle Group control, returns active toggle index */
declare function guiToggleGroup(bounds: Rectangle, text: string | undefined | null, active: number): number;
/** Check Box control, returns true when active */
declare function guiCheckBox(bounds: Rectangle, text: string | undefined | null, checked: boolean): boolean;
/** Combo Box control, returns selected item index */
declare function guiComboBox(bounds: Rectangle, text: string | undefined | null, active: number): number;
/** Dropdown Box control, returns selected item */
declare function guiDropdownBox(bounds: Rectangle, text: string | undefined | null, active: { active: number }, editMode: boolean): boolean;
/** Spinner control, returns selected value */
declare function guiSpinner(bounds: Rectangle, text: string | undefined | null, value: { value: number }, minValue: number, maxValue: number, editMode: boolean): boolean;
/** Value Box control, updates input text with numbers */
declare function guiValueBox(bounds: Rectangle, text: string | undefined | null, value: { value: number }, minValue: number, maxValue: number, editMode: boolean): boolean;
/** Text Box control, updates input text */
declare function guiTextBox(bounds: Rectangle, text: { text: string }, editMode: boolean): boolean;
/** Slider control, returns selected value */
declare function guiSlider(bounds: Rectangle, textLeft: string | undefined | null, textRight: string | undefined | null, value: number, minValue: number, maxValue: number): number;
/** Slider Bar control, returns selected value */
declare function guiSliderBar(bounds: Rectangle, textLeft: string | undefined | null, textRight: string | undefined | null, value: number, minValue: number, maxValue: number): number;
/** Progress Bar control, shows current progress value */
declare function guiProgressBar(bounds: Rectangle, textLeft: string | undefined | null, textRight: string | undefined | null, value: number, minValue: number, maxValue: number): number;
/** Status Bar control, shows info text */
declare function guiStatusBar(bounds: Rectangle, text: string | undefined | null): void;
/** Dummy control for placeholders */
declare function guiDummyRec(bounds: Rectangle, text: string | undefined | null): void;
/** Grid control, returns mouse cell position */
declare function guiGrid(bounds: Rectangle, text: string | undefined | null, spacing: number, subdivs: number): Vector2;
/** List View control, returns selected list item index */
declare function guiListView(bounds: Rectangle, text: string | undefined | null, scrollIndex: { scrollIndex: number }, active: number): number;
/** Message Box control, displays a message */
declare function guiMessageBox(bounds: Rectangle, title: string | undefined | null, message: string | undefined | null, buttons: string | undefined | null): number;
/** Text Input Box control, ask for text, supports secret */
declare function guiTextInputBox(bounds: Rectangle, title: string | undefined | null, message: string | undefined | null, buttons: string | undefined | null, text: { text: string }, secretViewActive: { secretViewActive: number }): number;
/** Color Picker control (multiple color controls) */
declare function guiColorPicker(bounds: Rectangle, text: string | undefined | null, color: Color): Color;
/** Color Panel control */
declare function guiColorPanel(bounds: Rectangle, text: string | undefined | null, color: Color): Color;
/** Color Bar Alpha control */
declare function guiColorBarAlpha(bounds: Rectangle, text: string | undefined | null, alpha: number): number;
/** Color Bar Hue control */
declare function guiColorBarHue(bounds: Rectangle, text: string | undefined | null, value: number): number;
/** Load style file over global style variable (.rgs) */
declare function guiLoadStyle(fileName: string | undefined | null): void;
/** Load style default over global style */
declare function guiLoadStyleDefault(): void;
/** Enable gui tooltips (global state) */
declare function guiEnableTooltip(): void;
/** Disable gui tooltips (global state) */
declare function guiDisableTooltip(): void;
/** Set tooltip string */
declare function guiSetTooltip(tooltip: string | undefined | null): void;
/** Get text with icon id prepended (if supported) */
declare function guiIconText(iconId: number, text: string | undefined | null): string | undefined | null;
/** Set default icon drawing size */
declare function guiSetIconScale(scale: number): void;
/** Draw icon using pixel size at specified position */
declare function guiDrawIcon(iconId: number, posX: number, posY: number, pixelSize: number, color: Color): void;
/** //----------------------------------------------------------------------------------
Module Functions Declaration
//---------------------------------------------------------------------------------- */
declare function createLight(type: number, position: Vector3, target: Vector3, color: Color, shader: Shader): Light;
/** Create a light and get shader locations */
declare function updateLightValues(shader: Shader, light: Light): void;
/** Linear Easing functions */
declare function easeLinearNone(t: number, b: number, c: number, d: number): number;
/** Ease: Linear */
declare function easeLinearIn(t: number, b: number, c: number, d: number): number;
/** Ease: Linear In */
declare function easeLinearOut(t: number, b: number, c: number, d: number): number;
/** Ease: Linear Out */
declare function easeLinearInOut(t: number, b: number, c: number, d: number): number;
/** Sine Easing functions */
declare function easeSineIn(t: number, b: number, c: number, d: number): number;
/** Ease: Sine In */
declare function easeSineOut(t: number, b: number, c: number, d: number): number;
/** Ease: Sine Out */
declare function easeSineInOut(t: number, b: number, c: number, d: number): number;
/** Circular Easing functions */
declare function easeCircIn(t: number, b: number, c: number, d: number): number;
/** Ease: Circular In */
declare function easeCircOut(t: number, b: number, c: number, d: number): number;
/** Ease: Circular Out */
declare function easeCircInOut(t: number, b: number, c: number, d: number): number;
/** Cubic Easing functions */
declare function easeCubicIn(t: number, b: number, c: number, d: number): number;
/** Ease: Cubic In */
declare function easeCubicOut(t: number, b: number, c: number, d: number): number;
/** Ease: Cubic Out */
declare function easeCubicInOut(t: number, b: number, c: number, d: number): number;
/** Quadratic Easing functions */
declare function easeQuadIn(t: number, b: number, c: number, d: number): number;
/** Ease: Quadratic In */
declare function easeQuadOut(t: number, b: number, c: number, d: number): number;
/** Ease: Quadratic Out */
declare function easeQuadInOut(t: number, b: number, c: number, d: number): number;
/** Exponential Easing functions */
declare function easeExpoIn(t: number, b: number, c: number, d: number): number;
/** Ease: Exponential In */
declare function easeExpoOut(t: number, b: number, c: number, d: number): number;
/** Ease: Exponential Out */
declare function easeExpoInOut(t: number, b: number, c: number, d: number): number;
/** Back Easing functions */
declare function easeBackIn(t: number, b: number, c: number, d: number): number;
/** Bounce Easing functions */
declare function easeBounceOut(t: number, b: number, c: number, d: number): number;
/** Ease: Bounce In */
declare function easeBounceInOut(t: number, b: number, c: number, d: number): number;
/** Elastic Easing functions */
declare function easeElasticIn(t: number, b: number, c: number, d: number): number;
/**  */
declare function getDefaultLightmapperConfig(): LightmapperConfig;
/**  */
declare function loadLightmapper(w: number, h: number, mesh: Mesh, cfg: LightmapperConfig): Lightmapper;
/**  */
declare function loadMaterialLightmapper(emissiveColor: Color, intensity: number): Material;
/**  */
declare function unloadLightmapper(lm: Lightmapper): void;
/**  */
declare function beginLightmap(): void;
/**  */
declare function endLightmap(): void;
/**  */
declare function beginLightmapFragment(lm: Lightmapper): boolean;
/**  */
declare function endLightmapFragment(lm: Lightmapper): void;
/**  */
declare function loadImageFromLightmapper(lm: Lightmapper): Image;
/** Replace material in slot materialIndex (Material is NOT unloaded) */
declare function setModelMaterial(model: Model, materialIndex: number, material: Material): void;
/** Get material in slot materialIndex */
declare function getModelMaterial(model: Model, materialIndex: number): Material;
/** Get a single mesh from a model */
declare function getModelMesh(model: Model, meshIndex: number): Mesh;
/** Set shader constant in shader locations array */
declare function setShaderLocation(shader: Shader, constant: number, location: number): void;
/** Read a single pixel from an image */
declare function imageReadPixel(image: Image, x: number, y: number): Color;
/** Make a deep-copy of an existing mesh */
declare function meshCopy(mesh: Mesh): Mesh;
/** Create a new mesh that contains combined attributes of two meshes */
declare function meshMerge(a: Mesh, b: Mesh): Mesh;
/** (PI/180.0) */
declare var DEG2RAD: number;
/** (180.0/PI) */
declare var RAD2DEG: number;
/** Light Gray */
declare var LIGHTGRAY: Color;
/** Gray */
declare var GRAY: Color;
/** Dark Gray */
declare var DARKGRAY: Color;
/** Yellow */
declare var YELLOW: Color;
/** Gold */
declare var GOLD: Color;
/** Orange */
declare var ORANGE: Color;
/** Pink */
declare var PINK: Color;
/** Red */
declare var RED: Color;
/** Maroon */
declare var MAROON: Color;
/** Green */
declare var GREEN: Color;
/** Lime */
declare var LIME: Color;
/** Dark Green */
declare var DARKGREEN: Color;
/** Sky Blue */
declare var SKYBLUE: Color;
/** Blue */
declare var BLUE: Color;
/** Dark Blue */
declare var DARKBLUE: Color;
/** Purple */
declare var PURPLE: Color;
/** Violet */
declare var VIOLET: Color;
/** Dark Purple */
declare var DARKPURPLE: Color;
/** Beige */
declare var BEIGE: Color;
/** Brown */
declare var BROWN: Color;
/** Dark Brown */
declare var DARKBROWN: Color;
/** White */
declare var WHITE: Color;
/** Black */
declare var BLACK: Color;
/** Blank (Transparent) */
declare var BLANK: Color;
/** Magenta */
declare var MAGENTA: Color;
/** My own White (raylib logo) */
declare var RAYWHITE: Color;
/** Set to try enabling V-Sync on GPU */
declare var FLAG_VSYNC_HINT: number;
/** Set to run program in fullscreen */
declare var FLAG_FULLSCREEN_MODE: number;
/** Set to allow resizable window */
declare var FLAG_WINDOW_RESIZABLE: number;
/** Set to disable window decoration (frame and buttons) */
declare var FLAG_WINDOW_UNDECORATED: number;
/** Set to hide window */
declare var FLAG_WINDOW_HIDDEN: number;
/** Set to minimize window (iconify) */
declare var FLAG_WINDOW_MINIMIZED: number;
/** Set to maximize window (expanded to monitor) */
declare var FLAG_WINDOW_MAXIMIZED: number;
/** Set to window non focused */
declare var FLAG_WINDOW_UNFOCUSED: number;
/** Set to window always on top */
declare var FLAG_WINDOW_TOPMOST: number;
/** Set to allow windows running while minimized */
declare var FLAG_WINDOW_ALWAYS_RUN: number;
/** Set to allow transparent framebuffer */
declare var FLAG_WINDOW_TRANSPARENT: number;
/** Set to support HighDPI */
declare var FLAG_WINDOW_HIGHDPI: number;
/** Set to support mouse passthrough, only supported when FLAG_WINDOW_UNDECORATED */
declare var FLAG_WINDOW_MOUSE_PASSTHROUGH: number;
/** Set to try enabling MSAA 4X */
declare var FLAG_MSAA_4X_HINT: number;
/** Set to try enabling interlaced video format (for V3D) */
declare var FLAG_INTERLACED_HINT: number;
/** Display all logs */
declare var LOG_ALL: number;
/** Trace logging, intended for internal use only */
declare var LOG_TRACE: number;
/** Debug logging, used for internal debugging, it should be disabled on release builds */
declare var LOG_DEBUG: number;
/** Info logging, used for program execution info */
declare var LOG_INFO: number;
/** Warning logging, used on recoverable failures */
declare var LOG_WARNING: number;
/** Error logging, used on unrecoverable failures */
declare var LOG_ERROR: number;
/** Fatal logging, used to abort program: exit(EXIT_FAILURE) */
declare var LOG_FATAL: number;
/** Disable logging */
declare var LOG_NONE: number;
/** Key: NULL, used for no key pressed */
declare var KEY_NULL: number;
/** Key: ' */
declare var KEY_APOSTROPHE: number;
/** Key: , */
declare var KEY_COMMA: number;
/** Key: - */
declare var KEY_MINUS: number;
/** Key: . */
declare var KEY_PERIOD: number;
/** Key: / */
declare var KEY_SLASH: number;
/** Key: 0 */
declare var KEY_ZERO: number;
/** Key: 1 */
declare var KEY_ONE: number;
/** Key: 2 */
declare var KEY_TWO: number;
/** Key: 3 */
declare var KEY_THREE: number;
/** Key: 4 */
declare var KEY_FOUR: number;
/** Key: 5 */
declare var KEY_FIVE: number;
/** Key: 6 */
declare var KEY_SIX: number;
/** Key: 7 */
declare var KEY_SEVEN: number;
/** Key: 8 */
declare var KEY_EIGHT: number;
/** Key: 9 */
declare var KEY_NINE: number;
/** Key: ; */
declare var KEY_SEMICOLON: number;
/** Key: = */
declare var KEY_EQUAL: number;
/** Key: A | a */
declare var KEY_A: number;
/** Key: B | b */
declare var KEY_B: number;
/** Key: C | c */
declare var KEY_C: number;
/** Key: D | d */
declare var KEY_D: number;
/** Key: E | e */
declare var KEY_E: number;
/** Key: F | f */
declare var KEY_F: number;
/** Key: G | g */
declare var KEY_G: number;
/** Key: H | h */
declare var KEY_H: number;
/** Key: I | i */
declare var KEY_I: number;
/** Key: J | j */
declare var KEY_J: number;
/** Key: K | k */
declare var KEY_K: number;
/** Key: L | l */
declare var KEY_L: number;
/** Key: M | m */
declare var KEY_M: number;
/** Key: N | n */
declare var KEY_N: number;
/** Key: O | o */
declare var KEY_O: number;
/** Key: P | p */
declare var KEY_P: number;
/** Key: Q | q */
declare var KEY_Q: number;
/** Key: R | r */
declare var KEY_R: number;
/** Key: S | s */
declare var KEY_S: number;
/** Key: T | t */
declare var KEY_T: number;
/** Key: U | u */
declare var KEY_U: number;
/** Key: V | v */
declare var KEY_V: number;
/** Key: W | w */
declare var KEY_W: number;
/** Key: X | x */
declare var KEY_X: number;
/** Key: Y | y */
declare var KEY_Y: number;
/** Key: Z | z */
declare var KEY_Z: number;
/** Key: [ */
declare var KEY_LEFT_BRACKET: number;
/** Key: '\' */
declare var KEY_BACKSLASH: number;
/** Key: ] */
declare var KEY_RIGHT_BRACKET: number;
/** Key: ` */
declare var KEY_GRAVE: number;
/** Key: Space */
declare var KEY_SPACE: number;
/** Key: Esc */
declare var KEY_ESCAPE: number;
/** Key: Enter */
declare var KEY_ENTER: number;
/** Key: Tab */
declare var KEY_TAB: number;
/** Key: Backspace */
declare var KEY_BACKSPACE: number;
/** Key: Ins */
declare var KEY_INSERT: number;
/** Key: Del */
declare var KEY_DELETE: number;
/** Key: Cursor right */
declare var KEY_RIGHT: number;
/** Key: Cursor left */
declare var KEY_LEFT: number;
/** Key: Cursor down */
declare var KEY_DOWN: number;
/** Key: Cursor up */
declare var KEY_UP: number;
/** Key: Page up */
declare var KEY_PAGE_UP: number;
/** Key: Page down */
declare var KEY_PAGE_DOWN: number;
/** Key: Home */
declare var KEY_HOME: number;
/** Key: End */
declare var KEY_END: number;
/** Key: Caps lock */
declare var KEY_CAPS_LOCK: number;
/** Key: Scroll down */
declare var KEY_SCROLL_LOCK: number;
/** Key: Num lock */
declare var KEY_NUM_LOCK: number;
/** Key: Print screen */
declare var KEY_PRINT_SCREEN: number;
/** Key: Pause */
declare var KEY_PAUSE: number;
/** Key: F1 */
declare var KEY_F1: number;
/** Key: F2 */
declare var KEY_F2: number;
/** Key: F3 */
declare var KEY_F3: number;
/** Key: F4 */
declare var KEY_F4: number;
/** Key: F5 */
declare var KEY_F5: number;
/** Key: F6 */
declare var KEY_F6: number;
/** Key: F7 */
declare var KEY_F7: number;
/** Key: F8 */
declare var KEY_F8: number;
/** Key: F9 */
declare var KEY_F9: number;
/** Key: F10 */
declare var KEY_F10: number;
/** Key: F11 */
declare var KEY_F11: number;
/** Key: F12 */
declare var KEY_F12: number;
/** Key: Shift left */
declare var KEY_LEFT_SHIFT: number;
/** Key: Control left */
declare var KEY_LEFT_CONTROL: number;
/** Key: Alt left */
declare var KEY_LEFT_ALT: number;
/** Key: Super left */
declare var KEY_LEFT_SUPER: number;
/** Key: Shift right */
declare var KEY_RIGHT_SHIFT: number;
/** Key: Control right */
declare var KEY_RIGHT_CONTROL: number;
/** Key: Alt right */
declare var KEY_RIGHT_ALT: number;
/** Key: Super right */
declare var KEY_RIGHT_SUPER: number;
/** Key: KB menu */
declare var KEY_KB_MENU: number;
/** Key: Keypad 0 */
declare var KEY_KP_0: number;
/** Key: Keypad 1 */
declare var KEY_KP_1: number;
/** Key: Keypad 2 */
declare var KEY_KP_2: number;
/** Key: Keypad 3 */
declare var KEY_KP_3: number;
/** Key: Keypad 4 */
declare var KEY_KP_4: number;
/** Key: Keypad 5 */
declare var KEY_KP_5: number;
/** Key: Keypad 6 */
declare var KEY_KP_6: number;
/** Key: Keypad 7 */
declare var KEY_KP_7: number;
/** Key: Keypad 8 */
declare var KEY_KP_8: number;
/** Key: Keypad 9 */
declare var KEY_KP_9: number;
/** Key: Keypad . */
declare var KEY_KP_DECIMAL: number;
/** Key: Keypad / */
declare var KEY_KP_DIVIDE: number;
/** Key: Keypad * */
declare var KEY_KP_MULTIPLY: number;
/** Key: Keypad - */
declare var KEY_KP_SUBTRACT: number;
/** Key: Keypad + */
declare var KEY_KP_ADD: number;
/** Key: Keypad Enter */
declare var KEY_KP_ENTER: number;
/** Key: Keypad = */
declare var KEY_KP_EQUAL: number;
/** Key: Android back button */
declare var KEY_BACK: number;
/** Key: Android menu button */
declare var KEY_MENU: number;
/** Key: Android volume up button */
declare var KEY_VOLUME_UP: number;
/** Key: Android volume down button */
declare var KEY_VOLUME_DOWN: number;
/** Mouse button left */
declare var MOUSE_BUTTON_LEFT: number;
/** Mouse button right */
declare var MOUSE_BUTTON_RIGHT: number;
/** Mouse button middle (pressed wheel) */
declare var MOUSE_BUTTON_MIDDLE: number;
/** Mouse button side (advanced mouse device) */
declare var MOUSE_BUTTON_SIDE: number;
/** Mouse button extra (advanced mouse device) */
declare var MOUSE_BUTTON_EXTRA: number;
/** Mouse button forward (advanced mouse device) */
declare var MOUSE_BUTTON_FORWARD: number;
/** Mouse button back (advanced mouse device) */
declare var MOUSE_BUTTON_BACK: number;
/** Default pointer shape */
declare var MOUSE_CURSOR_DEFAULT: number;
/** Arrow shape */
declare var MOUSE_CURSOR_ARROW: number;
/** Text writing cursor shape */
declare var MOUSE_CURSOR_IBEAM: number;
/** Cross shape */
declare var MOUSE_CURSOR_CROSSHAIR: number;
/** Pointing hand cursor */
declare var MOUSE_CURSOR_POINTING_HAND: number;
/** Horizontal resize/move arrow shape */
declare var MOUSE_CURSOR_RESIZE_EW: number;
/** Vertical resize/move arrow shape */
declare var MOUSE_CURSOR_RESIZE_NS: number;
/** Top-left to bottom-right diagonal resize/move arrow shape */
declare var MOUSE_CURSOR_RESIZE_NWSE: number;
/** The top-right to bottom-left diagonal resize/move arrow shape */
declare var MOUSE_CURSOR_RESIZE_NESW: number;
/** The omnidirectional resize/move cursor shape */
declare var MOUSE_CURSOR_RESIZE_ALL: number;
/** The operation-not-allowed shape */
declare var MOUSE_CURSOR_NOT_ALLOWED: number;
/** Unknown button, just for error checking */
declare var GAMEPAD_BUTTON_UNKNOWN: number;
/** Gamepad left DPAD up button */
declare var GAMEPAD_BUTTON_LEFT_FACE_UP: number;
/** Gamepad left DPAD right button */
declare var GAMEPAD_BUTTON_LEFT_FACE_RIGHT: number;
/** Gamepad left DPAD down button */
declare var GAMEPAD_BUTTON_LEFT_FACE_DOWN: number;
/** Gamepad left DPAD left button */
declare var GAMEPAD_BUTTON_LEFT_FACE_LEFT: number;
/** Gamepad right button up (i.e. PS3: Triangle, Xbox: Y) */
declare var GAMEPAD_BUTTON_RIGHT_FACE_UP: number;
/** Gamepad right button right (i.e. PS3: Square, Xbox: X) */
declare var GAMEPAD_BUTTON_RIGHT_FACE_RIGHT: number;
/** Gamepad right button down (i.e. PS3: Cross, Xbox: A) */
declare var GAMEPAD_BUTTON_RIGHT_FACE_DOWN: number;
/** Gamepad right button left (i.e. PS3: Circle, Xbox: B) */
declare var GAMEPAD_BUTTON_RIGHT_FACE_LEFT: number;
/** Gamepad top/back trigger left (first), it could be a trailing button */
declare var GAMEPAD_BUTTON_LEFT_TRIGGER_1: number;
/** Gamepad top/back trigger left (second), it could be a trailing button */
declare var GAMEPAD_BUTTON_LEFT_TRIGGER_2: number;
/** Gamepad top/back trigger right (one), it could be a trailing button */
declare var GAMEPAD_BUTTON_RIGHT_TRIGGER_1: number;
/** Gamepad top/back trigger right (second), it could be a trailing button */
declare var GAMEPAD_BUTTON_RIGHT_TRIGGER_2: number;
/** Gamepad center buttons, left one (i.e. PS3: Select) */
declare var GAMEPAD_BUTTON_MIDDLE_LEFT: number;
/** Gamepad center buttons, middle one (i.e. PS3: PS, Xbox: XBOX) */
declare var GAMEPAD_BUTTON_MIDDLE: number;
/** Gamepad center buttons, right one (i.e. PS3: Start) */
declare var GAMEPAD_BUTTON_MIDDLE_RIGHT: number;
/** Gamepad joystick pressed button left */
declare var GAMEPAD_BUTTON_LEFT_THUMB: number;
/** Gamepad joystick pressed button right */
declare var GAMEPAD_BUTTON_RIGHT_THUMB: number;
/** Gamepad left stick X axis */
declare var GAMEPAD_AXIS_LEFT_X: number;
/** Gamepad left stick Y axis */
declare var GAMEPAD_AXIS_LEFT_Y: number;
/** Gamepad right stick X axis */
declare var GAMEPAD_AXIS_RIGHT_X: number;
/** Gamepad right stick Y axis */
declare var GAMEPAD_AXIS_RIGHT_Y: number;
/** Gamepad back trigger left, pressure level: [1..-1] */
declare var GAMEPAD_AXIS_LEFT_TRIGGER: number;
/** Gamepad back trigger right, pressure level: [1..-1] */
declare var GAMEPAD_AXIS_RIGHT_TRIGGER: number;
/** Albedo material (same as: MATERIAL_MAP_DIFFUSE) */
declare var MATERIAL_MAP_ALBEDO: number;
/** Metalness material (same as: MATERIAL_MAP_SPECULAR) */
declare var MATERIAL_MAP_METALNESS: number;
/** Normal material */
declare var MATERIAL_MAP_NORMAL: number;
/** Roughness material */
declare var MATERIAL_MAP_ROUGHNESS: number;
/** Ambient occlusion material */
declare var MATERIAL_MAP_OCCLUSION: number;
/** Emission material */
declare var MATERIAL_MAP_EMISSION: number;
/** Heightmap material */
declare var MATERIAL_MAP_HEIGHT: number;
/** Cubemap material (NOTE: Uses GL_TEXTURE_CUBE_MAP) */
declare var MATERIAL_MAP_CUBEMAP: number;
/** Irradiance material (NOTE: Uses GL_TEXTURE_CUBE_MAP) */
declare var MATERIAL_MAP_IRRADIANCE: number;
/** Prefilter material (NOTE: Uses GL_TEXTURE_CUBE_MAP) */
declare var MATERIAL_MAP_PREFILTER: number;
/** Brdf material */
declare var MATERIAL_MAP_BRDF: number;
/** Shader location: vertex attribute: position */
declare var SHADER_LOC_VERTEX_POSITION: number;
/** Shader location: vertex attribute: texcoord01 */
declare var SHADER_LOC_VERTEX_TEXCOORD01: number;
/** Shader location: vertex attribute: texcoord02 */
declare var SHADER_LOC_VERTEX_TEXCOORD02: number;
/** Shader location: vertex attribute: normal */
declare var SHADER_LOC_VERTEX_NORMAL: number;
/** Shader location: vertex attribute: tangent */
declare var SHADER_LOC_VERTEX_TANGENT: number;
/** Shader location: vertex attribute: color */
declare var SHADER_LOC_VERTEX_COLOR: number;
/** Shader location: matrix uniform: model-view-projection */
declare var SHADER_LOC_MATRIX_MVP: number;
/** Shader location: matrix uniform: view (camera transform) */
declare var SHADER_LOC_MATRIX_VIEW: number;
/** Shader location: matrix uniform: projection */
declare var SHADER_LOC_MATRIX_PROJECTION: number;
/** Shader location: matrix uniform: model (transform) */
declare var SHADER_LOC_MATRIX_MODEL: number;
/** Shader location: matrix uniform: normal */
declare var SHADER_LOC_MATRIX_NORMAL: number;
/** Shader location: vector uniform: view */
declare var SHADER_LOC_VECTOR_VIEW: number;
/** Shader location: vector uniform: diffuse color */
declare var SHADER_LOC_COLOR_DIFFUSE: number;
/** Shader location: vector uniform: specular color */
declare var SHADER_LOC_COLOR_SPECULAR: number;
/** Shader location: vector uniform: ambient color */
declare var SHADER_LOC_COLOR_AMBIENT: number;
/** Shader location: sampler2d texture: albedo (same as: SHADER_LOC_MAP_DIFFUSE) */
declare var SHADER_LOC_MAP_ALBEDO: number;
/** Shader location: sampler2d texture: metalness (same as: SHADER_LOC_MAP_SPECULAR) */
declare var SHADER_LOC_MAP_METALNESS: number;
/** Shader location: sampler2d texture: normal */
declare var SHADER_LOC_MAP_NORMAL: number;
/** Shader location: sampler2d texture: roughness */
declare var SHADER_LOC_MAP_ROUGHNESS: number;
/** Shader location: sampler2d texture: occlusion */
declare var SHADER_LOC_MAP_OCCLUSION: number;
/** Shader location: sampler2d texture: emission */
declare var SHADER_LOC_MAP_EMISSION: number;
/** Shader location: sampler2d texture: height */
declare var SHADER_LOC_MAP_HEIGHT: number;
/** Shader location: samplerCube texture: cubemap */
declare var SHADER_LOC_MAP_CUBEMAP: number;
/** Shader location: samplerCube texture: irradiance */
declare var SHADER_LOC_MAP_IRRADIANCE: number;
/** Shader location: samplerCube texture: prefilter */
declare var SHADER_LOC_MAP_PREFILTER: number;
/** Shader location: sampler2d texture: brdf */
declare var SHADER_LOC_MAP_BRDF: number;
/** Shader uniform type: float */
declare var SHADER_UNIFORM_FLOAT: number;
/** Shader uniform type: vec2 (2 float) */
declare var SHADER_UNIFORM_VEC2: number;
/** Shader uniform type: vec3 (3 float) */
declare var SHADER_UNIFORM_VEC3: number;
/** Shader uniform type: vec4 (4 float) */
declare var SHADER_UNIFORM_VEC4: number;
/** Shader uniform type: int */
declare var SHADER_UNIFORM_INT: number;
/** Shader uniform type: ivec2 (2 int) */
declare var SHADER_UNIFORM_IVEC2: number;
/** Shader uniform type: ivec3 (3 int) */
declare var SHADER_UNIFORM_IVEC3: number;
/** Shader uniform type: ivec4 (4 int) */
declare var SHADER_UNIFORM_IVEC4: number;
/** Shader uniform type: sampler2d */
declare var SHADER_UNIFORM_SAMPLER2D: number;
/** Shader attribute type: float */
declare var SHADER_ATTRIB_FLOAT: number;
/** Shader attribute type: vec2 (2 float) */
declare var SHADER_ATTRIB_VEC2: number;
/** Shader attribute type: vec3 (3 float) */
declare var SHADER_ATTRIB_VEC3: number;
/** Shader attribute type: vec4 (4 float) */
declare var SHADER_ATTRIB_VEC4: number;
/** 8 bit per pixel (no alpha) */
declare var PIXELFORMAT_UNCOMPRESSED_GRAYSCALE: number;
/** 8*2 bpp (2 channels) */
declare var PIXELFORMAT_UNCOMPRESSED_GRAY_ALPHA: number;
/** 16 bpp */
declare var PIXELFORMAT_UNCOMPRESSED_R5G6B5: number;
/** 24 bpp */
declare var PIXELFORMAT_UNCOMPRESSED_R8G8B8: number;
/** 16 bpp (1 bit alpha) */
declare var PIXELFORMAT_UNCOMPRESSED_R5G5B5A1: number;
/** 16 bpp (4 bit alpha) */
declare var PIXELFORMAT_UNCOMPRESSED_R4G4B4A4: number;
/** 32 bpp */
declare var PIXELFORMAT_UNCOMPRESSED_R8G8B8A8: number;
/** 32 bpp (1 channel - float) */
declare var PIXELFORMAT_UNCOMPRESSED_R32: number;
/** 32*3 bpp (3 channels - float) */
declare var PIXELFORMAT_UNCOMPRESSED_R32G32B32: number;
/** 32*4 bpp (4 channels - float) */
declare var PIXELFORMAT_UNCOMPRESSED_R32G32B32A32: number;
/** 4 bpp (no alpha) */
declare var PIXELFORMAT_COMPRESSED_DXT1_RGB: number;
/** 4 bpp (1 bit alpha) */
declare var PIXELFORMAT_COMPRESSED_DXT1_RGBA: number;
/** 8 bpp */
declare var PIXELFORMAT_COMPRESSED_DXT3_RGBA: number;
/** 8 bpp */
declare var PIXELFORMAT_COMPRESSED_DXT5_RGBA: number;
/** 4 bpp */
declare var PIXELFORMAT_COMPRESSED_ETC1_RGB: number;
/** 4 bpp */
declare var PIXELFORMAT_COMPRESSED_ETC2_RGB: number;
/** 8 bpp */
declare var PIXELFORMAT_COMPRESSED_ETC2_EAC_RGBA: number;
/** 4 bpp */
declare var PIXELFORMAT_COMPRESSED_PVRT_RGB: number;
/** 4 bpp */
declare var PIXELFORMAT_COMPRESSED_PVRT_RGBA: number;
/** 8 bpp */
declare var PIXELFORMAT_COMPRESSED_ASTC_4x4_RGBA: number;
/** 2 bpp */
declare var PIXELFORMAT_COMPRESSED_ASTC_8x8_RGBA: number;
/** No filter, just pixel approximation */
declare var TEXTURE_FILTER_POINT: number;
/** Linear filtering */
declare var TEXTURE_FILTER_BILINEAR: number;
/** Trilinear filtering (linear with mipmaps) */
declare var TEXTURE_FILTER_TRILINEAR: number;
/** Anisotropic filtering 4x */
declare var TEXTURE_FILTER_ANISOTROPIC_4X: number;
/** Anisotropic filtering 8x */
declare var TEXTURE_FILTER_ANISOTROPIC_8X: number;
/** Anisotropic filtering 16x */
declare var TEXTURE_FILTER_ANISOTROPIC_16X: number;
/** Repeats texture in tiled mode */
declare var TEXTURE_WRAP_REPEAT: number;
/** Clamps texture to edge pixel in tiled mode */
declare var TEXTURE_WRAP_CLAMP: number;
/** Mirrors and repeats the texture in tiled mode */
declare var TEXTURE_WRAP_MIRROR_REPEAT: number;
/** Mirrors and clamps to border the texture in tiled mode */
declare var TEXTURE_WRAP_MIRROR_CLAMP: number;
/** Automatically detect layout type */
declare var CUBEMAP_LAYOUT_AUTO_DETECT: number;
/** Layout is defined by a vertical line with faces */
declare var CUBEMAP_LAYOUT_LINE_VERTICAL: number;
/** Layout is defined by a horizontal line with faces */
declare var CUBEMAP_LAYOUT_LINE_HORIZONTAL: number;
/** Layout is defined by a 3x4 cross with cubemap faces */
declare var CUBEMAP_LAYOUT_CROSS_THREE_BY_FOUR: number;
/** Layout is defined by a 4x3 cross with cubemap faces */
declare var CUBEMAP_LAYOUT_CROSS_FOUR_BY_THREE: number;
/** Layout is defined by a panorama image (equirrectangular map) */
declare var CUBEMAP_LAYOUT_PANORAMA: number;
/** Default font generation, anti-aliased */
declare var FONT_DEFAULT: number;
/** Bitmap font generation, no anti-aliasing */
declare var FONT_BITMAP: number;
/** SDF font generation, requires external shader */
declare var FONT_SDF: number;
/** Blend textures considering alpha (default) */
declare var BLEND_ALPHA: number;
/** Blend textures adding colors */
declare var BLEND_ADDITIVE: number;
/** Blend textures multiplying colors */
declare var BLEND_MULTIPLIED: number;
/** Blend textures adding colors (alternative) */
declare var BLEND_ADD_COLORS: number;
/** Blend textures subtracting colors (alternative) */
declare var BLEND_SUBTRACT_COLORS: number;
/** Blend premultiplied textures considering alpha */
declare var BLEND_ALPHA_PREMULTIPLY: number;
/** Blend textures using custom src/dst factors (use rlSetBlendFactors()) */
declare var BLEND_CUSTOM: number;
/** Blend textures using custom rgb/alpha separate src/dst factors (use rlSetBlendFactorsSeparate()) */
declare var BLEND_CUSTOM_SEPARATE: number;
/** No gesture */
declare var GESTURE_NONE: number;
/** Tap gesture */
declare var GESTURE_TAP: number;
/** Double tap gesture */
declare var GESTURE_DOUBLETAP: number;
/** Hold gesture */
declare var GESTURE_HOLD: number;
/** Drag gesture */
declare var GESTURE_DRAG: number;
/** Swipe right gesture */
declare var GESTURE_SWIPE_RIGHT: number;
/** Swipe left gesture */
declare var GESTURE_SWIPE_LEFT: number;
/** Swipe up gesture */
declare var GESTURE_SWIPE_UP: number;
/** Swipe down gesture */
declare var GESTURE_SWIPE_DOWN: number;
/** Pinch in gesture */
declare var GESTURE_PINCH_IN: number;
/** Pinch out gesture */
declare var GESTURE_PINCH_OUT: number;
/** Custom camera */
declare var CAMERA_CUSTOM: number;
/** Free camera */
declare var CAMERA_FREE: number;
/** Orbital camera */
declare var CAMERA_ORBITAL: number;
/** First person camera */
declare var CAMERA_FIRST_PERSON: number;
/** Third person camera */
declare var CAMERA_THIRD_PERSON: number;
/** Perspective projection */
declare var CAMERA_PERSPECTIVE: number;
/** Orthographic projection */
declare var CAMERA_ORTHOGRAPHIC: number;
/** Npatch layout: 3x3 tiles */
declare var NPATCH_NINE_PATCH: number;
/** Npatch layout: 1x3 tiles */
declare var NPATCH_THREE_PATCH_VERTICAL: number;
/** Npatch layout: 3x1 tiles */
declare var NPATCH_THREE_PATCH_HORIZONTAL: number;
/**  */
declare var STATE_NORMAL: number;
/**  */
declare var STATE_FOCUSED: number;
/**  */
declare var STATE_PRESSED: number;
/**  */
declare var STATE_DISABLED: number;
/**  */
declare var TEXT_ALIGN_LEFT: number;
/**  */
declare var TEXT_ALIGN_CENTER: number;
/**  */
declare var TEXT_ALIGN_RIGHT: number;
/**  */
declare var DEFAULT: number;
/** Used also for: LABELBUTTON */
declare var LABEL: number;
/**  */
declare var BUTTON: number;
/** Used also for: TOGGLEGROUP */
declare var TOGGLE: number;
/** Used also for: SLIDERBAR */
declare var SLIDER: number;
/**  */
declare var PROGRESSBAR: number;
/**  */
declare var CHECKBOX: number;
/**  */
declare var COMBOBOX: number;
/**  */
declare var DROPDOWNBOX: number;
/** Used also for: TEXTBOXMULTI */
declare var TEXTBOX: number;
/**  */
declare var VALUEBOX: number;
/** Uses: BUTTON, VALUEBOX */
declare var SPINNER: number;
/**  */
declare var LISTVIEW: number;
/**  */
declare var COLORPICKER: number;
/**  */
declare var SCROLLBAR: number;
/**  */
declare var STATUSBAR: number;
/**  */
declare var BORDER_COLOR_NORMAL: number;
/**  */
declare var BASE_COLOR_NORMAL: number;
/**  */
declare var TEXT_COLOR_NORMAL: number;
/**  */
declare var BORDER_COLOR_FOCUSED: number;
/**  */
declare var BASE_COLOR_FOCUSED: number;
/**  */
declare var TEXT_COLOR_FOCUSED: number;
/**  */
declare var BORDER_COLOR_PRESSED: number;
/**  */
declare var BASE_COLOR_PRESSED: number;
/**  */
declare var TEXT_COLOR_PRESSED: number;
/**  */
declare var BORDER_COLOR_DISABLED: number;
/**  */
declare var BASE_COLOR_DISABLED: number;
/**  */
declare var TEXT_COLOR_DISABLED: number;
/**  */
declare var BORDER_WIDTH: number;
/**  */
declare var TEXT_PADDING: number;
/**  */
declare var TEXT_ALIGNMENT: number;
/**  */
declare var RESERVED: number;
/** Text size (glyphs max height) */
declare var TEXT_SIZE: number;
/** Text spacing between glyphs */
declare var TEXT_SPACING: number;
/** Line control color */
declare var LINE_COLOR: number;
/** Background color */
declare var BACKGROUND_COLOR: number;
/** ToggleGroup separation between toggles */
declare var GROUP_PADDING: number;
/** Slider size of internal bar */
declare var SLIDER_WIDTH: number;
/** Slider/SliderBar internal bar padding */
declare var SLIDER_PADDING: number;
/** ProgressBar internal padding */
declare var PROGRESS_PADDING: number;
/**  */
declare var ARROWS_SIZE: number;
/**  */
declare var ARROWS_VISIBLE: number;
/** (SLIDERBAR, SLIDER_PADDING) */
declare var SCROLL_SLIDER_PADDING: number;
/**  */
declare var SCROLL_SLIDER_SIZE: number;
/**  */
declare var SCROLL_PADDING: number;
/**  */
declare var SCROLL_SPEED: number;
/** CheckBox internal check padding */
declare var CHECK_PADDING: number;
/** ComboBox right button width */
declare var COMBO_BUTTON_WIDTH: number;
/** ComboBox button separation */
declare var COMBO_BUTTON_SPACING: number;
/** DropdownBox arrow separation from border and items */
declare var ARROW_PADDING: number;
/** DropdownBox items separation */
declare var DROPDOWN_ITEMS_SPACING: number;
/** TextBox/TextBoxMulti/ValueBox/Spinner inner text padding */
declare var TEXT_INNER_PADDING: number;
/** TextBoxMulti lines separation */
declare var TEXT_LINES_SPACING: number;
/** TextBoxMulti vertical alignment: 0-CENTERED, 1-UP, 2-DOWN */
declare var TEXT_ALIGNMENT_VERTICAL: number;
/** TextBox supports multiple lines */
declare var TEXT_MULTILINE: number;
/** TextBox wrap mode for multiline: 0-NO_WRAP, 1-CHAR_WRAP, 2-WORD_WRAP */
declare var TEXT_WRAP_MODE: number;
/** Spinner left/right buttons width */
declare var SPIN_BUTTON_WIDTH: number;
/** Spinner buttons separation */
declare var SPIN_BUTTON_SPACING: number;
/** ListView items height */
declare var LIST_ITEMS_HEIGHT: number;
/** ListView items separation */
declare var LIST_ITEMS_SPACING: number;
/** ListView scrollbar size (usually width) */
declare var SCROLLBAR_WIDTH: number;
/** ListView scrollbar side (0-left, 1-right) */
declare var SCROLLBAR_SIDE: number;
/**  */
declare var COLOR_SELECTOR_SIZE: number;
/** ColorPicker right hue bar width */
declare var HUEBAR_WIDTH: number;
/** ColorPicker right hue bar separation from panel */
declare var HUEBAR_PADDING: number;
/** ColorPicker right hue bar selector height */
declare var HUEBAR_SELECTOR_HEIGHT: number;
/** ColorPicker right hue bar selector overflow */
declare var HUEBAR_SELECTOR_OVERFLOW: number;
/**  */
declare var ICON_NONE: number;
/**  */
declare var ICON_FOLDER_FILE_OPEN: number;
/**  */
declare var ICON_FILE_SAVE_CLASSIC: number;
/**  */
declare var ICON_FOLDER_OPEN: number;
/**  */
declare var ICON_FOLDER_SAVE: number;
/**  */
declare var ICON_FILE_OPEN: number;
/**  */
declare var ICON_FILE_SAVE: number;
/**  */
declare var ICON_FILE_EXPORT: number;
/**  */
declare var ICON_FILE_ADD: number;
/**  */
declare var ICON_FILE_DELETE: number;
/**  */
declare var ICON_FILETYPE_TEXT: number;
/**  */
declare var ICON_FILETYPE_AUDIO: number;
/**  */
declare var ICON_FILETYPE_IMAGE: number;
/**  */
declare var ICON_FILETYPE_PLAY: number;
/**  */
declare var ICON_FILETYPE_VIDEO: number;
/**  */
declare var ICON_FILETYPE_INFO: number;
/**  */
declare var ICON_FILE_COPY: number;
/**  */
declare var ICON_FILE_CUT: number;
/**  */
declare var ICON_FILE_PASTE: number;
/**  */
declare var ICON_CURSOR_HAND: number;
/**  */
declare var ICON_CURSOR_POINTER: number;
/**  */
declare var ICON_CURSOR_CLASSIC: number;
/**  */
declare var ICON_PENCIL: number;
/**  */
declare var ICON_PENCIL_BIG: number;
/**  */
declare var ICON_BRUSH_CLASSIC: number;
/**  */
declare var ICON_BRUSH_PAINTER: number;
/**  */
declare var ICON_WATER_DROP: number;
/**  */
declare var ICON_COLOR_PICKER: number;
/**  */
declare var ICON_RUBBER: number;
/**  */
declare var ICON_COLOR_BUCKET: number;
/**  */
declare var ICON_TEXT_T: number;
/**  */
declare var ICON_TEXT_A: number;
/**  */
declare var ICON_SCALE: number;
/**  */
declare var ICON_RESIZE: number;
/**  */
declare var ICON_FILTER_POINT: number;
/**  */
declare var ICON_FILTER_BILINEAR: number;
/**  */
declare var ICON_CROP: number;
/**  */
declare var ICON_CROP_ALPHA: number;
/**  */
declare var ICON_SQUARE_TOGGLE: number;
/**  */
declare var ICON_SYMMETRY: number;
/**  */
declare var ICON_SYMMETRY_HORIZONTAL: number;
/**  */
declare var ICON_SYMMETRY_VERTICAL: number;
/**  */
declare var ICON_LENS: number;
/**  */
declare var ICON_LENS_BIG: number;
/**  */
declare var ICON_EYE_ON: number;
/**  */
declare var ICON_EYE_OFF: number;
/**  */
declare var ICON_FILTER_TOP: number;
/**  */
declare var ICON_FILTER: number;
/**  */
declare var ICON_TARGET_POINT: number;
/**  */
declare var ICON_TARGET_SMALL: number;
/**  */
declare var ICON_TARGET_BIG: number;
/**  */
declare var ICON_TARGET_MOVE: number;
/**  */
declare var ICON_CURSOR_MOVE: number;
/**  */
declare var ICON_CURSOR_SCALE: number;
/**  */
declare var ICON_CURSOR_SCALE_RIGHT: number;
/**  */
declare var ICON_CURSOR_SCALE_LEFT: number;
/**  */
declare var ICON_UNDO: number;
/**  */
declare var ICON_REDO: number;
/**  */
declare var ICON_REREDO: number;
/**  */
declare var ICON_MUTATE: number;
/**  */
declare var ICON_ROTATE: number;
/**  */
declare var ICON_REPEAT: number;
/**  */
declare var ICON_SHUFFLE: number;
/**  */
declare var ICON_EMPTYBOX: number;
/**  */
declare var ICON_TARGET: number;
/**  */
declare var ICON_TARGET_SMALL_FILL: number;
/**  */
declare var ICON_TARGET_BIG_FILL: number;
/**  */
declare var ICON_TARGET_MOVE_FILL: number;
/**  */
declare var ICON_CURSOR_MOVE_FILL: number;
/**  */
declare var ICON_CURSOR_SCALE_FILL: number;
/**  */
declare var ICON_CURSOR_SCALE_RIGHT_FILL: number;
/**  */
declare var ICON_CURSOR_SCALE_LEFT_FILL: number;
/**  */
declare var ICON_UNDO_FILL: number;
/**  */
declare var ICON_REDO_FILL: number;
/**  */
declare var ICON_REREDO_FILL: number;
/**  */
declare var ICON_MUTATE_FILL: number;
/**  */
declare var ICON_ROTATE_FILL: number;
/**  */
declare var ICON_REPEAT_FILL: number;
/**  */
declare var ICON_SHUFFLE_FILL: number;
/**  */
declare var ICON_EMPTYBOX_SMALL: number;
/**  */
declare var ICON_BOX: number;
/**  */
declare var ICON_BOX_TOP: number;
/**  */
declare var ICON_BOX_TOP_RIGHT: number;
/**  */
declare var ICON_BOX_RIGHT: number;
/**  */
declare var ICON_BOX_BOTTOM_RIGHT: number;
/**  */
declare var ICON_BOX_BOTTOM: number;
/**  */
declare var ICON_BOX_BOTTOM_LEFT: number;
/**  */
declare var ICON_BOX_LEFT: number;
/**  */
declare var ICON_BOX_TOP_LEFT: number;
/**  */
declare var ICON_BOX_CENTER: number;
/**  */
declare var ICON_BOX_CIRCLE_MASK: number;
/**  */
declare var ICON_POT: number;
/**  */
declare var ICON_ALPHA_MULTIPLY: number;
/**  */
declare var ICON_ALPHA_CLEAR: number;
/**  */
declare var ICON_DITHERING: number;
/**  */
declare var ICON_MIPMAPS: number;
/**  */
declare var ICON_BOX_GRID: number;
/**  */
declare var ICON_GRID: number;
/**  */
declare var ICON_BOX_CORNERS_SMALL: number;
/**  */
declare var ICON_BOX_CORNERS_BIG: number;
/**  */
declare var ICON_FOUR_BOXES: number;
/**  */
declare var ICON_GRID_FILL: number;
/**  */
declare var ICON_BOX_MULTISIZE: number;
/**  */
declare var ICON_ZOOM_SMALL: number;
/**  */
declare var ICON_ZOOM_MEDIUM: number;
/**  */
declare var ICON_ZOOM_BIG: number;
/**  */
declare var ICON_ZOOM_ALL: number;
/**  */
declare var ICON_ZOOM_CENTER: number;
/**  */
declare var ICON_BOX_DOTS_SMALL: number;
/**  */
declare var ICON_BOX_DOTS_BIG: number;
/**  */
declare var ICON_BOX_CONCENTRIC: number;
/**  */
declare var ICON_BOX_GRID_BIG: number;
/**  */
declare var ICON_OK_TICK: number;
/**  */
declare var ICON_CROSS: number;
/**  */
declare var ICON_ARROW_LEFT: number;
/**  */
declare var ICON_ARROW_RIGHT: number;
/**  */
declare var ICON_ARROW_DOWN: number;
/**  */
declare var ICON_ARROW_UP: number;
/**  */
declare var ICON_ARROW_LEFT_FILL: number;
/**  */
declare var ICON_ARROW_RIGHT_FILL: number;
/**  */
declare var ICON_ARROW_DOWN_FILL: number;
/**  */
declare var ICON_ARROW_UP_FILL: number;
/**  */
declare var ICON_AUDIO: number;
/**  */
declare var ICON_FX: number;
/**  */
declare var ICON_WAVE: number;
/**  */
declare var ICON_WAVE_SINUS: number;
/**  */
declare var ICON_WAVE_SQUARE: number;
/**  */
declare var ICON_WAVE_TRIANGULAR: number;
/**  */
declare var ICON_CROSS_SMALL: number;
/**  */
declare var ICON_PLAYER_PREVIOUS: number;
/**  */
declare var ICON_PLAYER_PLAY_BACK: number;
/**  */
declare var ICON_PLAYER_PLAY: number;
/**  */
declare var ICON_PLAYER_PAUSE: number;
/**  */
declare var ICON_PLAYER_STOP: number;
/**  */
declare var ICON_PLAYER_NEXT: number;
/**  */
declare var ICON_PLAYER_RECORD: number;
/**  */
declare var ICON_MAGNET: number;
/**  */
declare var ICON_LOCK_CLOSE: number;
/**  */
declare var ICON_LOCK_OPEN: number;
/**  */
declare var ICON_CLOCK: number;
/**  */
declare var ICON_TOOLS: number;
/**  */
declare var ICON_GEAR: number;
/**  */
declare var ICON_GEAR_BIG: number;
/**  */
declare var ICON_BIN: number;
/**  */
declare var ICON_HAND_POINTER: number;
/**  */
declare var ICON_LASER: number;
/**  */
declare var ICON_COIN: number;
/**  */
declare var ICON_EXPLOSION: number;
/**  */
declare var ICON_1UP: number;
/**  */
declare var ICON_PLAYER: number;
/**  */
declare var ICON_PLAYER_JUMP: number;
/**  */
declare var ICON_KEY: number;
/**  */
declare var ICON_DEMON: number;
/**  */
declare var ICON_TEXT_POPUP: number;
/**  */
declare var ICON_GEAR_EX: number;
/**  */
declare var ICON_CRACK: number;
/**  */
declare var ICON_CRACK_POINTS: number;
/**  */
declare var ICON_STAR: number;
/**  */
declare var ICON_DOOR: number;
/**  */
declare var ICON_EXIT: number;
/**  */
declare var ICON_MODE_2D: number;
/**  */
declare var ICON_MODE_3D: number;
/**  */
declare var ICON_CUBE: number;
/**  */
declare var ICON_CUBE_FACE_TOP: number;
/**  */
declare var ICON_CUBE_FACE_LEFT: number;
/**  */
declare var ICON_CUBE_FACE_FRONT: number;
/**  */
declare var ICON_CUBE_FACE_BOTTOM: number;
/**  */
declare var ICON_CUBE_FACE_RIGHT: number;
/**  */
declare var ICON_CUBE_FACE_BACK: number;
/**  */
declare var ICON_CAMERA: number;
/**  */
declare var ICON_SPECIAL: number;
/**  */
declare var ICON_LINK_NET: number;
/**  */
declare var ICON_LINK_BOXES: number;
/**  */
declare var ICON_LINK_MULTI: number;
/**  */
declare var ICON_LINK: number;
/**  */
declare var ICON_LINK_BROKE: number;
/**  */
declare var ICON_TEXT_NOTES: number;
/**  */
declare var ICON_NOTEBOOK: number;
/**  */
declare var ICON_SUITCASE: number;
/**  */
declare var ICON_SUITCASE_ZIP: number;
/**  */
declare var ICON_MAILBOX: number;
/**  */
declare var ICON_MONITOR: number;
/**  */
declare var ICON_PRINTER: number;
/**  */
declare var ICON_PHOTO_CAMERA: number;
/**  */
declare var ICON_PHOTO_CAMERA_FLASH: number;
/**  */
declare var ICON_HOUSE: number;
/**  */
declare var ICON_HEART: number;
/**  */
declare var ICON_CORNER: number;
/**  */
declare var ICON_VERTICAL_BARS: number;
/**  */
declare var ICON_VERTICAL_BARS_FILL: number;
/**  */
declare var ICON_LIFE_BARS: number;
/**  */
declare var ICON_INFO: number;
/**  */
declare var ICON_CROSSLINE: number;
/**  */
declare var ICON_HELP: number;
/**  */
declare var ICON_FILETYPE_ALPHA: number;
/**  */
declare var ICON_FILETYPE_HOME: number;
/**  */
declare var ICON_LAYERS_VISIBLE: number;
/**  */
declare var ICON_LAYERS: number;
/**  */
declare var ICON_WINDOW: number;
/**  */
declare var ICON_HIDPI: number;
/**  */
declare var ICON_FILETYPE_BINARY: number;
/**  */
declare var ICON_HEX: number;
/**  */
declare var ICON_SHIELD: number;
/**  */
declare var ICON_FILE_NEW: number;
/**  */
declare var ICON_FOLDER_ADD: number;
/**  */
declare var ICON_ALARM: number;
/**  */
declare var ICON_CPU: number;
/**  */
declare var ICON_ROM: number;
/**  */
declare var ICON_STEP_OVER: number;
/**  */
declare var ICON_STEP_INTO: number;
/**  */
declare var ICON_STEP_OUT: number;
/**  */
declare var ICON_RESTART: number;
/**  */
declare var ICON_BREAKPOINT_ON: number;
/**  */
declare var ICON_BREAKPOINT_OFF: number;
/**  */
declare var ICON_BURGER_MENU: number;
/**  */
declare var ICON_CASE_SENSITIVE: number;
/**  */
declare var ICON_REG_EXP: number;
/**  */
declare var ICON_FOLDER: number;
/**  */
declare var ICON_FILE: number;
/**  */
declare var ICON_SAND_TIMER: number;
/**  */
declare var ICON_220: number;
/**  */
declare var ICON_221: number;
/**  */
declare var ICON_222: number;
/**  */
declare var ICON_223: number;
/**  */
declare var ICON_224: number;
/**  */
declare var ICON_225: number;
/**  */
declare var ICON_226: number;
/**  */
declare var ICON_227: number;
/**  */
declare var ICON_228: number;
/**  */
declare var ICON_229: number;
/**  */
declare var ICON_230: number;
/**  */
declare var ICON_231: number;
/**  */
declare var ICON_232: number;
/**  */
declare var ICON_233: number;
/**  */
declare var ICON_234: number;
/**  */
declare var ICON_235: number;
/**  */
declare var ICON_236: number;
/**  */
declare var ICON_237: number;
/**  */
declare var ICON_238: number;
/**  */
declare var ICON_239: number;
/**  */
declare var ICON_240: number;
/**  */
declare var ICON_241: number;
/**  */
declare var ICON_242: number;
/**  */
declare var ICON_243: number;
/**  */
declare var ICON_244: number;
/**  */
declare var ICON_245: number;
/**  */
declare var ICON_246: number;
/**  */
declare var ICON_247: number;
/**  */
declare var ICON_248: number;
/**  */
declare var ICON_249: number;
/**  */
declare var ICON_250: number;
/**  */
declare var ICON_251: number;
/**  */
declare var ICON_252: number;
/**  */
declare var ICON_253: number;
/**  */
declare var ICON_254: number;
/**  */
declare var ICON_255: number;
/**  */
declare var LIGHT_DIRECTIONAL: number;
/**  */
declare var LIGHT_POINT: number;
/** Albedo material (same as: MATERIAL_MAP_DIFFUSE */
declare var MATERIAL_MAP_DIFFUSE: number;
/** Metalness material (same as: MATERIAL_MAP_SPECULAR) */
declare var MATERIAL_MAP_SPECULAR: number;
