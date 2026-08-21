# logtriage

Turn noisy command logs into a small local triage summary. `logtriage` counts
error and warning lines, surfaces exit-code hints, and prints the first likely
failure line so a reviewer can decide where to look next.

ANSI-colored terminal logs are supported. Matching ignores terminal control
sequences, while reported error and warning lines retain their original color
codes for display in a compatible terminal.

Common zero-count summaries such as `0 failed`, `Failures 0`, `Errors: (0)`,
and `Warning count: 0` are treated as clean results. Count labels, optional
colons or equals signs, and parenthesized counts are supported; positive forms
such as `Failures: 2`, `Error count = (3)`, and `Warning count: 1` are surfaced.
Explicitly negated summaries such as `No warnings` and `completed without
errors` are also ignored. A zero count does not hide another positive
diagnostic later on the same line.

Exit hints are failure-oriented: explicit `exit code`, `exited with`, and
`process status` messages retain nonzero codes and omit zero. Generic status
messages, including HTTP and API response statuses, are not treated as process
exit hints.

## Status

Early MVP. The CLI is usable for plain-text command logs, but parsing is
heuristic and intentionally conservative.

Log records may be separated by LF, CRLF, or CR. Supporting CR-only records
keeps terminal captures that use carriage returns from collapsing into one
summary line.

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
CI-style `fixtures/ci-failure.log`, the package-install fixture
`fixtures/package-install-failure.log`, and the mixed colored/plain terminal
fixture `fixtures/colored-diagnostics.log`. A short video or social brief lives in
[docs/promo/demo-brief.md](docs/promo/demo-brief.md).

After a release has been published, install and run the global command with:

```sh
npm install --global logtriage
logtriage path/to/command.log
```

The command accepts exactly one log-file path. `--help` and `-h` print usage
and exit successfully. Missing or extra operands, unknown options, and files
that cannot be read exit nonzero with a concise error on standard error; they
do not emit a Node.js stack trace.

## Verify

Run the local validation script before opening a pull request:

```sh
bash scripts/validate.sh
```

`scripts/validate.sh` runs the repository's standard local checks when they are defined and will also run `agent-qc ready` when `agent-qc` is installed. Missing `agent-qc` is treated as a skip, not a failure.

## Package contents

The npm package allowlist includes the runtime files and public support
documents needed for release review, but not compiled tests: `README.md`,
`LICENSE`, `SECURITY.md`,
`CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and the sample
fixtures under `fixtures/`. Run `npm run package:smoke` before publishing to
build the tarball, install it into a disposable project, and exercise the
installed command against both `--help` and a packaged fixture.

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

Pushing a `v*.*.*` tag runs the release workflow. It verifies the package,
builds one tarball, publishes that exact tarball to npm with provenance, and
only then creates the GitHub release with the tarball attached. The repository
must be configured as a trusted publisher for the `logtriage` package on npm;
the workflow uses GitHub's OIDC identity and does not require an npm token.
