#!/bin/bash
set -o errexit -o nounset -o pipefail

SCRIPTPATH=$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )
PROJECT_HOME=$( realpath "$SCRIPTPATH" )

echo "Generating bindings"

cd "$PROJECT_HOME/bindings" && \
    npm run bindings:generate
