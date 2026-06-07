import test from 'node:test';
import assert from 'node:assert/strict';
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
