# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Add your changes after this line, example:

`## [MAJOR.MINOR.REVISION-STABILITY] - DD.MM.YYYY`

## [1.0.1-dev] - 17.03.2024

### Added

- Changes specifier in [CHANGELOG.md](./CHANGELOG.md)
- Version specifier in [VERSION](./VERSION)
- Node version specifier in [.nvmrc](./bindings/.nvmrc) to allow compatibility
- Simple shell script to invoke the bindings generator in [`generate-bindings.sh`](./generate-bindings.sh)
- Simple shell script to invoke the build process in one step in [`build-rayjs.sh`](./build-rayjs.sh)

### Changed

- Upgraded raylib to [9a8d73e](https://github.com/raysan5/raylib/commit/9a8d73e6c32514275a0ba53fe528bcb7c2693e27)
- Upgraded raygui to [82ba2b1](https://github.com/raysan5/raygui/commit/82ba2b1a783208d6a1f80d8977d796635260c161)
- Upgraded quickjs to [6a89d7c](https://github.com/bellard/quickjs/commit/6a89d7c27099be84e5312a7ec73205d6a7abe1b4)
- Generated new bindings
- Upgraded all packages of the bindings generator

### Removed

- Removed the need of transpilation when using the bindings generator (this is useful to debug generator issues as ts-node can represent errors as they are, without the need of source maps)
- Removed webpack requirement

### Fixed

- Markdown linting errors
