# TechTide AI — Why This Fork Exists

## The Problem

Field engineers and client teams need AI coding agents running locally — no code leaving the machine, no third-party API dependencies for sensitive projects. Most code editors either lock you into a cloud provider or have no agent integration at all. The gap between "local-first" and "AI-powered" shouldn't exist.

## Why KnotCode (BobKnots)

KnotCode gives us a desktop-native code editor with a built-in agent panel that routes through the user's own gateway. Code stays local, the LLM connection is self-hosted, and the editor ships as a single binary. We use it for air-gapped client deployments where cloud editors aren't an option.

We use KnotCode internally at TechTide for environments where code cannot leave the local machine — government contracts, financial services audits, and any deployment where data sovereignty is non-negotiable.

## What TechTide Uses This For

- **Air-gapped agent deployments** — Run Claude/Gemini/local models through a self-hosted gateway with zero cloud dependency
- **Client-site installations** — Ship a single desktop binary that includes editor + agent + terminal
- **Skill-first development** — Leverage the skills system to give agents project-specific knowledge without prompt engineering
- **Secure code review** — Agents review code locally without transmitting source to external services

## Upstream Contributions

We contribute test coverage, accessibility, and documentation improvements back to the upstream project:

| PR | Description |
|----|-------------|
| [#20](https://github.com/OpenKnots/code-editor/pull/20) | Add unit tests for plan-parser module (zero coverage gap) |
| [#21](https://github.com/OpenKnots/code-editor/pull/21) | Add ARIA combobox pattern to command palette and quick open |
| [#22](https://github.com/OpenKnots/code-editor/pull/22) | Clean up SECURITY.md and add supported versions table |

## Architecture Notes

KnotCode is a Next.js + Tauri 2 desktop application with:
- **Frontend** (`app/`, `components/`): Next.js 15 (App Router) + React 19 + Monaco Editor + TailwindCSS
- **Desktop** (`src-tauri/`): Rust (Tauri 2) for native file access, keychain, and shell
- **Agent** (`context/`, `lib/`): Gateway protocol over WebSocket to OpenClaw
- **Skills** (`.tools/`): Markdown skill files that inject project knowledge into agent context
- **Tests** (`__tests__/`): Vitest with comprehensive lib coverage

Key strengths:
- **Local-first**: All code stays on the machine; gateway is self-hosted
- **Skill-first**: Agents get project-specific knowledge via declarative skill files
- **Cross-platform**: macOS, Windows, Linux via Tauri (+ iOS in beta)
- **Zero telemetry**: No data collection, no analytics, no cloud dependencies

---

*This fork is maintained by [TechTide AI](https://github.com/TechTideOhio) as part of our secure agent deployment infrastructure stack.*
