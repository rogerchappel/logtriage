import { readFileSync } from 'node:fs';

function fail(message) {
  console.error(`release tag check failed: ${message}`);
  process.exit(1);
}

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

if (!tag) fail('provide a tag argument or set GITHUB_REF_NAME');

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expectedTag = `v${packageJson.version}`;

if (tag !== expectedTag) fail(`expected ${expectedTag}, received ${tag}`);

console.log(`release tag check passed: ${tag}`);
