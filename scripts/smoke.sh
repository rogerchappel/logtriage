#!/usr/bin/env bash
set -euo pipefail
npm run build
node dist/src/cli.js fixtures/failing.log | grep 'errors: 1'
node dist/src/cli.js fixtures/failing.log | grep 'warnings: 1'
node dist/src/cli.js fixtures/ci-failure.log | grep 'exit hints: exited with 1'
clean_summary=$(node dist/src/cli.js fixtures/clean-summary.log)
grep 'errors: 0' <<<"$clean_summary"
grep 'warnings: 0' <<<"$clean_summary"
if grep -q 'first error:' <<<"$clean_summary"; then
  echo 'clean summary unexpectedly reported a first error' >&2
  exit 1
fi
