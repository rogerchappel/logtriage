# logtriage Demo Brief

## Promise

Show how a maintainer can turn a noisy command log into a short local summary
that highlights warning count, error count, exit hints, and the first likely
failure line.

## Demo flow

```sh
npm ci
bash demo/run-fixture-triage.sh
```

The demo runs against two public fixtures: a compact failing log and a CI-style
failure log.

## Grounded talking points

- `logtriage` is deterministic and local-first; it reads a text file and prints a
  concise summary.
- The parser is intentionally heuristic and conservative.
- Logs can contain secrets or customer data, so shared demos should use scrubbed
  fixtures like the files in `fixtures/`.
