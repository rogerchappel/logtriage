import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const checker = new URL('../scripts/check-release-tag.mjs', import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expectedTag = `v${packageJson.version}`;
const escapedExpectedTag = expectedTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function run(tag, env = {}) {
  const args = [checker.pathname];
  if (tag !== undefined) args.push(tag);

  return spawnSync(process.execPath, args, {
    encoding: 'utf8',
    env: { ...process.env, GITHUB_REF_NAME: '', ...env },
  });
}

test('accepts the package version tag as an explicit input', () => {
  const result = run(expectedTag);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `release tag check passed: ${expectedTag}\n`);
});

test('accepts the package version tag from GITHUB_REF_NAME', () => {
  const result = run(undefined, { GITHUB_REF_NAME: expectedTag });
  assert.equal(result.status, 0, result.stderr);
});

test('rejects a tag that does not match the package version', () => {
  const result = run('v999.0.0');
  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`expected ${escapedExpectedTag}, received v999\\.0\\.0`));
});

test('rejects a missing tag', () => {
  const result = run(undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /provide a tag argument or set GITHUB_REF_NAME/);
});
