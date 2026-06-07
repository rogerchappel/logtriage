#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { formatSummary, triageLog } from './index.js';

function usage(): string {
  return 'Usage: logtriage <log-file>\n       logtriage --help\n';
}

const arg = process.argv[2];
if (!arg || arg === '--help' || arg === '-h') {
  process.stdout.write(usage());
  process.exit(arg ? 0 : 1);
}

const input = readFileSync(arg, 'utf8');
process.stdout.write(formatSummary(triageLog(input)));
