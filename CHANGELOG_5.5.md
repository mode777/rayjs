# Changelog: raylib 4.5 → 5.5 Migration

## Overview

This changelog documents all changes made during the migration of rayjs from raylib **4.5** to **5.5** (stable), including raygui **3.6** → **4.0**.

## Git

- Branch: `update-raylib`
- Commit: `52be0e6` — "switch raylib to v5.5 and raygui to v4.0 stable releases"

---

## Submodules Updated

| Submodule | From | To |
|-----------|------|-----|
| `thirdparty/raylib` | `dbc56a8` (6.0-dev) | `c1ab645` (tag **5.5**) |
| `thirdparty/raygui` | `aa81c16` (tag **3.6**) | `25c8c65` (tag **4.0**) |

---

## Files Modified

### `src/quickjs.c`
- Removed `#include <GLFW/glfw3.h>` and `GLFWwindow`-specific F5 reload code (now uses `IsKeyPressed(KEY_F5)` only, platform-agnostic)

### `bindings/src/quickjs.ts`
- **`jsToC()`** — Added type conversions:
  - `char` → first char of JS string
  - `short`, `int *`, `long`
  - `unsigned short`, `unsigned long`
  - `const float *`
  - `bool *` → local `bool` variable
  - `char *` (both `const char *` and non-const)
- **`jsToJs()`** — Fixed pointer return types:
  - `unsigned int *`, `unsigned char *` → `*ptr ? JS_NewUint32(ctx, *ptr) : JS_NULL`
  - `int *` → `JS_NewInt32`
  - Separated non-pointer unsigned types from pointer versions

### `bindings/src/index.ts`
- **Removed** `ignore()` calls for functions that no longer exist in 5.5:
  - `IsAudioStreamReady`, `Vector3OrthoNormalize`, `Vector3ToFloatV`, `MatrixToFloatV`, `QuaternionToAxisAngle`
- **Fixed `VrDeviceInfo`** struct — removed non-existent field `vScreenCenter` (not present in 5.5)
- **Fixed `GuiListView`** — added second out-parameter `active` at index 3 (raygui 4.0 has `scrollIndex` at 2 + `active` at 3)
- **Fixed `GuiTextInputBox`** — ignored `secretViewActive` (bool*) parameter, wrote custom body without `setOutParamString` conflict
- **Added `LoadRandomSequence`** to `ignore()` (returns `int*`)
- **Added auto-ignore filter** — automatically ignores functions with unsupported parameter/return types (`supportedTypes` set with all raylib types + aliases like `Texture2D`, `Camera`, `Quaternion`, `ModelSkeleton`, `GestureEvent`)
- **Added `needsBufferReturn()` handler** — special codegen for 5 functions that return `unsigned char *` + `int *` size param (produces `JS_NewArrayBufferCopy` instead of `JS_NewUint32`):
  - `LoadFileData`, `CompressData`, `DecompressData`, `DecodeDataBase64`, `ExportImageToMemory`

### `src/bindings/js_raylib_core.h`
- **Fully regenerated** (718 functions bound, 105 ignored)
- 0 JavaScript errors

### `examples/lib.raylib.d.ts`
- **Fully regenerated** TypeScript declarations

### `thirdparty/raylib/parser/output/raylib_api.json`
- **Regenerated** from raylib 5.5 (12,137 lines)

### `generate-bindings.js`
- **Rebuilt** via webpack from updated sources

---

## New Files

| File | Description |
|------|-------------|
| `examples/textures/bunnymark_opt.js` | Optimized bunnymark benchmark (Float32Array, no GC pressure) |
| `MIGRATION_TABLE.md` | Full function-by-function migration table (581 functions) |
| `CHANGELOG_5.5.md` | This file |

---

## Deleted/Failed Build Directories

| Path | Reason |
|------|--------|
| `build-sdl/` | Unsuccessful SDL backend build (GLFW symbols not available) |

---

## Build & Runtime Status

- **Build**: `[100%] Built target rayjs` — 0 errors, 1 warning (LoadFileData `unsigned int *` → `int *` sign mismatch — safe)
- **Runtime**: raylib 5.5 initializes successfully, OpenGL 4.1 on Apple M2
- **Examples tested**: `main.js`, `bunnymark.js`, `bunnymark_opt.js` — all run without errors

---

## Known Issues / Future Work

1. **LoadFileData warning** — `unsigned int*` passed where `int*` expected (cosmetic, runtime-safe)
2. **SDL backend** — needs `#ifdef`-separated GLFW/SDL code in `quickjs.c`
3. **GPU Skinning** — `Mesh` struct missing `boneMatrices` and `boneCount` fields in binding (P1 — silent runtime misalignment)
4. **Model animations** — still `ignore()`'d as in 4.5 (can be un-ignored if needed)
5. **GetScreenToWorldRay** — available but no JS-side alias for old `GetMouseRay`
6. **Auto-ignore audit** — 105 ignored functions, some may be bindable