# Release Governance

Orbit releases must be reproducible, reviewable, and protected from accidental or unverified publishing.

## Protected main branch

The `main` branch is protected. Required checks are:

- `Node 22 / VS Code 1.100.0`
- `Node 24 / VS Code stable`
- `dependency-review`
- `analyze (javascript-typescript)`

Branch deletion and force-push are disabled. Conversation resolution is required before merging.

## Release flow

1. Merge only verified PRs into `main`.
2. Create a version PR that updates `package.json`, `CHANGELOG.md`, and release notes.
3. Tag from `main` only.
4. Let the release workflow build the VSIX, generate checksums/SBOM, publish to registries, and create the GitHub Release.
5. If Marketplace or Open VSX publishing fails after artifact generation, rerun the workflow from the verified tag instead of rebuilding locally.

## Protected tags

Release tags should use `v*` and be created only from `main`. If GitHub rulesets are available for the repository plan, protect `v*` tags with the same required checks as `main`.

## Merge policy

- Security and release-blocker fixes can be merged as soon as required checks pass.
- Feature PRs should include docs or tests for new user-visible behavior.
- Dependency PRs follow `docs/DEPENDENCY_POLICY.md`.
