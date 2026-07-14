#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$repo_root"

npm run build

echo "Basic failing command log:"
node dist/src/cli.js fixtures/failing.log

echo
echo "CI-style fixture:"
node dist/src/cli.js fixtures/ci-failure.log

echo
echo "Package install fixture:"
node dist/src/cli.js fixtures/package-install-failure.log
