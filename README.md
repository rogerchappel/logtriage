# logtriage

Turn noisy command logs into a small local triage summary. `logtriage` counts
error and warning lines, surfaces exit-code hints, and prints the first likely
failure line so a reviewer can decide where to look next.

## Status

Early MVP. The CLI is usable for plain-text command logs, but parsing is
heuristic and intentionally conservative.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/logtriage.git
cd logtriage
npm install
npm run build
```

## Use

Summarize a log file:

```sh
node dist/src/cli.js fixtures/failing.log
```

Expected output shape:

```text
lines: 4
errors: 1
warnings: 1
exit hints: exited with 2
first error: Error: command failed
```

Run the fixture-backed demo:

```sh
bash demo/run-fixture-triage.sh
```

The demo builds the local CLI and summarizes `fixtures/failing.log`, the
CI-style `fixtures/ci-failure.log`, and the package-install fixture
`fixtures/package-install-failure.log`. A short video or social brief lives in
[docs/promo/demo-brief.md](docs/promo/demo-brief.md).

After publishing, the global command is:

```sh
logtriage path/to/command.log
```

## Verify

Run the local validation script before opening a pull request:

```sh
bash scripts/validate.sh
```

`scripts/validate.sh` runs the repository's standard local checks when they are defined and will also run `agent-qc ready` when `agent-qc` is installed. Missing `agent-qc` is treated as a skip, not a failure.

## Package contents

The npm package allowlist includes the runtime files plus the public support
documents needed for release review: `README.md`, `LICENSE`, `SECURITY.md`,
`CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and the sample
fixtures under `fixtures/`. Run `npm run package:smoke` or
`npm pack --dry-run` before publishing to confirm those files are still present
in the tarball.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance. Logs can
contain secrets, tokens, hostnames, and customer data; scrub sensitive input
before sharing logs or triage output.
## CLI Help Smoke

Confirm the packaged command starts and prints its help text before relying on a release tarball or downstream automation:

```bash
npm run build
node ./dist/src/cli.js --help
```

The command should exit successfully, print the available options, and avoid reading project files or contacting external services.

## Verification

Use the package scripts as the public smoke gates before publishing or changing CLI behavior.

- `npm run check`
- `npm test`
- `npm run build`
- `npm run smoke`
- `npm run package:smoke`
- `npm run release:check`

## Safety Notes

This package is intended for local, reviewable developer and agent workflows. Review generated reports, plans, or artifacts before sharing them publicly or using them to drive external actions. Do not place secrets, private logs, customer data, or credentials in fixtures, issues, or examples.

## License

MIT

## Verification

Run the release-readiness checks before publishing or cutting a PR:

```bash
npm run check
npm run build
npm run test
npm run smoke
npm run package:smoke
npm run release:check
```

Use `npm run package:smoke` or `npm pack --dry-run` to confirm the published tarball includes the support docs and runnable package contents.
