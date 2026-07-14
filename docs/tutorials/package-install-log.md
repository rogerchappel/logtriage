# Package Install Log Demo

This short recipe shows `logtriage` on a scrubbed dependency-resolution failure.
It is useful for demos where the audience recognizes `npm ERR!` output but does
not need to read an entire install log.

## Run it

```sh
npm run build
node dist/src/cli.js fixtures/package-install-failure.log
```

Expected summary shape:

```text
lines: 10
errors: 8
warnings: 1
exit hints: exited with 1
first error: npm ERR! code ERESOLVE
```

## What to point out

- The fixture stays local and scrubbed.
- Warning and error counts are separated.
- The exit hint keeps the non-zero command status visible.
- The first likely failure line gives a maintainer a starting point without
  claiming root cause.
