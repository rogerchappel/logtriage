# logtriage PRD

Status: in-progress

## Summary

logtriage is a local CLI that reads command logs, groups failures into useful buckets, and emits a short triage report with evidence snippets. It helps developers and agents turn noisy logs into next actions without sending logs to a service.

## Problem

Test, build, and CI logs are long. Agents often over-summarize them or miss the first meaningful failure. Developers need a deterministic parser that identifies repeated errors, exit markers, file references, and likely failure classes.

## Users

- Developers inspecting local build/test logs.
- Agents producing concise failure reports.
- Maintainers collecting issue reproduction evidence.

## V1 Scope

- Read files, stdin, or directories of logs.
- Detect common failure classes: assertion, typecheck, lint, missing file, port conflict, timeout, network, permission, and unknown.
- Group repeated stack traces and command sections.
- Emit Markdown and JSON reports.
- Provide `scan`, `explain`, and `rules` commands.
- Include fixture logs and smoke tests.

## Non-Goals

- LLM summarization.
- Hosted ingestion.
- Full observability pipeline features.

## Safety

- Local-only and read-only.
- Redact common token patterns and home directory paths in output.
- Cap evidence snippets to avoid accidental giant dumps.

## Inspiration

Inspired by CI log analyzers and compiler diagnostics, reframed as a small local triage assistant for agentic development loops.
