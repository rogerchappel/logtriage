import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { formatSummary, triageLog } from '../src/index.js';

test('triages errors, warnings, and exit hints', () => {
  const summary = triageLog('boot\nWarning: deprecated flag\nError: build failed\nprocess exited with 2\n');

  assert.equal(summary.totalLines, 4);
  assert.deepEqual(summary.warningLines, ['Warning: deprecated flag']);
  assert.deepEqual(summary.errorLines, ['Error: build failed']);
  assert.deepEqual(summary.exitCodeHints, ['exited with 2']);
});

test('formats a compact summary', () => {
  assert.match(formatSummary(triageLog('ok\nfatal: no config\n')), /first error: fatal: no config/);
});

test('ignores zero-count diagnostic summaries without hiding positive counts', () => {
  const clean = triageLog('Tests: 12 passed, 0 failed\nWarnings: 0\nFailures: 0\n0 errors\n');

  assert.deepEqual(clean.errorLines, []);
  assert.deepEqual(clean.warningLines, []);

  const failing = triageLog('Tests: 11 passed, 1 failed\nWarnings: 2\n0 failed, Error: teardown failed\n');
  assert.deepEqual(failing.errorLines, [
    'Tests: 11 passed, 1 failed',
    '0 failed, Error: teardown failed',
  ]);
  assert.deepEqual(failing.warningLines, ['Warnings: 2']);
});

test('CLI reports a clean fixture without a first error', () => {
  const fixture = new URL('../../fixtures/clean-summary.log', import.meta.url);
  const cli = new URL('../src/cli.js', import.meta.url);
  const result = spawnSync(process.execPath, [cli.pathname, fixture.pathname], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^errors: 0$/m);
  assert.match(result.stdout, /^warnings: 0$/m);
  assert.doesNotMatch(result.stdout, /^first error:/m);
  assert.equal(readFileSync(fixture, 'utf8').includes('0 failed'), true);
});
