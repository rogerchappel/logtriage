#!/usr/bin/env bash
set -euo pipefail
npm run build
node dist/cli.js fixtures/failing.log | grep 'errors: 1'
node dist/cli.js fixtures/failing.log | grep 'warnings: 1'
