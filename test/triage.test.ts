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

test('ignores negated diagnostics without hiding positive diagnostics on the same line', () => {
  const clean = triageLog('Everything completed without errors\nNo warnings were emitted\n');

  assert.deepEqual(clean.errorLines, []);
  assert.deepEqual(clean.warningLines, []);

  const mixed = triageLog(
    'No warnings during compilation; Warning: deprecated option used\n' +
      'Completed without errors, but Error: upload failed\n',
  );
  assert.deepEqual(mixed.errorLines, ['Completed without errors, but Error: upload failed']);
  assert.deepEqual(mixed.warningLines, [
    'No warnings during compilation; Warning: deprecated option used',
  ]);
});

test('omits successful exit hints and retains nonzero exits', () => {
  const summary = triageLog('Process exited with 0\nstatus: 0\nProcess exited with 2\nexit code 17\n');

  assert.deepEqual(summary.exitCodeHints, ['exited with 2', 'exit code 17']);
});

test('CLI reports a clean fixture without a first error', () => {
  const fixture = new URL('../../fixtures/clean-summary.log', import.meta.url);
  const cli = new URL('../src/cli.js', import.meta.url);
  const result = spawnSync(process.execPath, [cli.pathname, fixture.pathname], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^errors: 0$/m);
  assert.match(result.stdout, /^warnings: 0$/m);
  assert.doesNotMatch(result.stdout, /^exit hints:/m);
  assert.doesNotMatch(result.stdout, /^first error:/m);
  assert.equal(readFileSync(fixture, 'utf8').includes('without errors'), true);
});

test('CLI retains mixed positive diagnostics and a nonzero exit fixture', () => {
  const fixture = new URL('../../fixtures/negated-mixed.log', import.meta.url);
  const cli = new URL('../src/cli.js', import.meta.url);
  const result = spawnSync(process.execPath, [cli.pathname, fixture.pathname], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^errors: 1$/m);
  assert.match(result.stdout, /^warnings: 1$/m);
  assert.match(result.stdout, /^exit hints: exited with 3$/m);
  assert.match(result.stdout, /^first error: Completed without errors, but Error: upload failed$/m);
});
