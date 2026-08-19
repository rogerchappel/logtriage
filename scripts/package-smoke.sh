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

package_files=$(tar -tzf "$tarball")

if grep -q '^package/dist/test/' <<<"$package_files"; then
  echo 'package contains compiled test artifacts under dist/test' >&2
  exit 1
fi

grep -q '^package/dist/src/cli.js$' <<<"$package_files"
grep -q '^package/dist/src/index.js$' <<<"$package_files"
grep -q '^package/fixtures/failing.log$' <<<"$package_files"

cd "$project_dir"
npm init --yes >/dev/null
npm install --ignore-scripts --no-audit --no-fund "$tarball"

./node_modules/.bin/logtriage --help | grep 'Usage: logtriage'
./node_modules/.bin/logtriage node_modules/logtriage/fixtures/failing.log | grep 'errors: 1'
./node_modules/.bin/logtriage node_modules/logtriage/fixtures/failing.log | grep 'warnings: 1'
