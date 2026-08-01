#!/usr/bin/env bash
set -euo pipefail

package_dir=$(mktemp -d)
project_dir=$(mktemp -d)
trap 'rm -rf "$package_dir" "$project_dir"' EXIT

npm pack --pack-destination "$package_dir"
tarball=$(find "$package_dir" -maxdepth 1 -name '*.tgz' -print -quit)

if [[ -z "$tarball" ]]; then
  echo 'npm pack did not produce a tarball' >&2
  exit 1
fi

cd "$project_dir"
npm init --yes >/dev/null
npm install --ignore-scripts --no-audit --no-fund "$tarball"

./node_modules/.bin/logtriage --help | grep 'Usage: logtriage'
./node_modules/.bin/logtriage node_modules/logtriage/fixtures/failing.log | grep 'errors: 1'
./node_modules/.bin/logtriage node_modules/logtriage/fixtures/failing.log | grep 'warnings: 1'
