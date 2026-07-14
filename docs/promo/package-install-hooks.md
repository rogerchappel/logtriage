# Package Install Demo Hooks

## Short posts

- A dependency install log can be 200 lines long; the first review question is
  often just "how bad is it and where do I start?"
- `logtriage` turns a scrubbed install failure into counts, an exit hint, and a
  first likely error line without sending the log anywhere.
- The demo fixture uses an `ERESOLVE` peer dependency conflict so the output is
  recognizable without depending on a real private build log.

## Clip outline

1. Show `fixtures/package-install-failure.log`.
2. Run `node dist/src/cli.js fixtures/package-install-failure.log`.
3. Highlight the warning count, error count, `exited with 1`, and first error.
4. Close on the limitation: it is a conservative triage summary, not a root
   cause engine.
