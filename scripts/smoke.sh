#!/usr/bin/env bash
set -euo pipefail
npm run build
node dist/src/cli.js fixtures/failing.log | grep 'errors: 1'
node dist/src/cli.js fixtures/failing.log | grep 'warnings: 1'
node dist/src/cli.js fixtures/ci-failure.log | grep 'exit hints: exited with 1'
