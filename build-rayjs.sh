#!/bin/bash
set -o errexit -o nounset -o pipefail

SCRIPTPATH=$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )
PROJECT_HOME=$( realpath "$SCRIPTPATH" )
BUILD_TYPE=Debug
BUILD_DIR=build

cd "$PROJECT_HOME" && \
echo "Cleaning up build directory" && \
rm -fr build && \
./generate-bindings.sh && \
echo "Generating build files" && \
cmake -B "$BUILD_DIR" -DCMAKE_BUILD_TYPE=$BUILD_TYPE && \
echo "Building" && \
cmake --build "$BUILD_DIR" --config $BUILD_TYPE
