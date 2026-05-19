# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /Users/sofianavamuelespejo/.config/opencode/skills/branch-pr/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /Users/sofianavamuelespejo/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /Users/sofianavamuelespejo/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /Users/sofianavamuelespejo/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /Users/sofianavamuelespejo/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (must have `status:approved` label)
- Every PR MUST have exactly one `type:*` label
- Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Conventional commits: `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+`
- PR body must include: linked issue, PR type, summary, changes table, test plan, contributor checklist
- Run `shellcheck` on modified scripts before pushing
- Automated checks: issue reference + `status:approved` label + `type:*` label + shellcheck must all pass
- No `Co-Authored-By` trailers in commits

### go-testing
- Pure function → table-driven test. Has side effects → mock dependencies
- Bubbletea TUI: test `Model.Update()` directly for state transitions; use `teatest.NewTestModel()` for full flows; golden file testing for visual output
- Errors: always test both success and error cases
- System/exec mocking: use interface + mock pattern, never mock what you don't own
- File operations: use `t.TempDir()` for temp dirs
- Golden files: store in `testdata/`, support `-update` flag to regenerate
- Commands: `go test ./...`, `go test -v`, `go test -cover`, `go test -short` (skip integration), `go test -update`
- Organize: `model_test.go`, `update_test.go`, `view_test.go` per package

### issue-creation
- MUST use a template (bug_report.yml or feature_request.yml) — blank issues are disabled
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, NOT issues
- Pre-flight: search existing issues for duplicates BEFORE creating
- Bug Report: pre-flight checks, bug description, steps to reproduce, expected vs actual behavior, OS, agent/client, shell
- Feature Request: pre-flight checks, problem description, proposed solution, affected area
- Bug auto-labels: `bug`, `status:needs-review`. Feature auto-labels: `enhancement`, `status:needs-review`

### judgment-day
- Launch TWO independent blind judge sub-agents via `delegate` (async, parallel) — NEVER sequential
- Orchestrator NEVER reviews code itself — only launches judges, reads results, synthesizes
- Verdict: Confirmed (both judges) → fix immediately; Suspect (one judge) → triage; Contradiction (disagree) → flag for manual
- Warning classification: "real" = triggers in normal production use; "theoretical" = requires contrived conditions
- Fix Agent is a separate `delegate` — never use a judge as the fixer
- Re-judge: max 2 fix iterations before asking user whether to continue
- Must resolve skill registry (mem_search or `.atl/skill-registry.md`) before launching judges — inject compact rules as Project Standards
- After Fix Agent returns, IMMEDIATELY re-launch judges — do NOT push/commit before re-judgment completes

### skill-creator
- Only create for reusable patterns, NOT one-off tasks or existing docs
- Structure: `skills/{skill-name}/SKILL.md` + optional `assets/` + optional `references/`
- Frontmatter: `name` (lowercase, hyphens), `description` (with Trigger: line), `license: Apache-2.0`, `metadata.author: gentleman-programming`, `metadata.version`
- Content sections: When to Use, Critical Patterns, Code Examples, Commands, Resources
- Naming: `{technology}` for generic, `{project}-{component}` for project-specific, `{action}-{target}` for workflow
- DON'T: add Keywords section, duplicate existing docs, use web URLs in references, add troubleshooting
- After creation, register in AGENTS.md table

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Global AGENTS.md | /Users/sofianavamuelespejo/AGENTS.md | InsForge SDK instructions (globs: *, alwaysApply) |
| OpenCode AGENTS.md | /Users/sofianavamuelespejo/.config/opencode/AGENTS.md | Gentle AI persona + engram protocol |
| OpenCode config | /Users/sofianavamuelespejo/.config/opencode/ | Agent/skill configuration root |

No project-level convention files found (no AGENTS.md, CLAUDE.md, .cursorrules in /Users/sofianavamuelespejo/tik_tok_shop).
