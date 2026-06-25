# Dependency and Automation Policy

Orbit uses Renovate and GitHub security checks to keep the extension current without silently raising the supported VS Code or Node floor.

## Update lanes

- **Runtime and extension API floor**: never auto-raise `engines.vscode`, `@types/vscode`, or `engines.node`. These changes require a maintainer decision and release note.
- **Patch dependency updates**: may be automerged only when CI, Dependency Review, CodeQL, Socket, and package smoke checks pass.
- **Minor devDependency updates**: may be automerged when they do not alter the VS Code API floor or test host baseline.
- **Major updates**: always manual review.
- **GitHub Actions**: pin and review major updates manually; action upgrades must pass the full matrix before merge.

## Transitive overrides

Use `pnpm-workspace.yaml` overrides only for security or compatibility reasons. Each override must include a follow-up issue or Renovate dashboard note so it can be removed after upstream packages catch up.

## Dependency Dashboard

The Renovate Dependency Dashboard remains open as the single tracking issue for dependency decisions that should not be handled automatically.

## Required checks before dependency merge

- Node 22 / VS Code 1.100.0
- Node 24 / VS Code stable
- Dependency Review
- CodeQL analyze
- Socket security checks
- Package smoke tests through the CI verify chain
