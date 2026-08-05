#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { formatSummary, triageLog } from './index.js';

function usage(): string {
  return 'Usage: logtriage <log-file>\n       logtriage --help | -h\n';
}

function fail(message: string): never {
  process.stderr.write(`error: ${message}\n${usage()}`);
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 1 && (args[0] === '--help' || args[0] === '-h')) {
  process.stdout.write(usage());
  process.exit(0);
}

if (args.length === 0) {
  fail('missing log-file operand');
}

if (args.length !== 1) {
  fail(`expected exactly one log-file operand; received ${args.length}`);
}

const [logFile] = args;
if (logFile.startsWith('-')) {
  fail(`unknown option "${logFile}"`);
}

let input: string;
try {
  input = readFileSync(logFile, 'utf8');
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  process.stderr.write(`error: cannot read "${logFile}": ${detail}\n`);
  process.exit(1);
}

process.stdout.write(formatSummary(triageLog(input)));
