# Orchestration Plan

## Stewardship flow
1. Start each change from the latest origin/main in an isolated worktree.
2. Keep package trust, README verification, and release-readiness changes in focused commits.
3. Run package parsing and pack dry-run checks locally before opening a pull request.
4. After pushing, use GitHub checks to confirm the release dry-run and repository hygiene workflows pass.

## Release handoff
- Treat tagging as a manual maintainer action. A matching release tag runs the
  verified npm publication and GitHub release workflow automatically.
- Include verification evidence in pull requests so release reviewers can reproduce the checks.
- Prefer follow-up PRs for runtime or fixture changes that are not directly tied to release readiness.
