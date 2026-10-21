# Knot Code

**AI coding, without the bloat.**

A lightweight, AI-native code editor powered by [OpenClaw](https://github.com/openclaw/openclaw). Your agent, your gateway, your data. Desktop (macOS, Windows, Linux) + iOS + Browser.

<p align="center">
  <img src="assets/start-chat.png" alt="Knot Code — Start screen" width="720" />
</p>

## Why this fork exists

**What it does.** Knot Code is a code editor built with Next.js and Tauri v2 that ships as a desktop app (macOS, Windows, Linux) and as a static web build. It embeds an agent panel (Ask, Agent and Plan modes), inline diff review, a Monaco editor, an xterm.js terminal and git operations, and it routes every AI request through an [OpenClaw](https://github.com/openclaw/openclaw) gateway that the user runs.

**Who it serves.** Developers who want AI-assisted editing on a machine they control, where the model endpoint is whatever their own OpenClaw gateway is configured for (hosted API, local model, or both) rather than a vendor-operated cloud.

**Why Alex forked it.** The fork was created on 2026-03-06 (GitHub `created_at`), five days after the upstream repository (2026-03-01). The stated motivation is recorded on the `techtide/build-out` branch (commit `1cbd384`, 2026-05-21, "docs: add TechTide fork backstory and architecture notes"), which opens with: "Field engineers and client teams need AI coding agents running locally" with "no code leaving the machine, no third-party API dependencies for sensitive projects." The eight fork-only commits on `main` (2026-10-17 to 2026-10-19, PRs #1 to #8) are CI and security hardening rather than feature work: a pnpm 9 / Node 20 CI fix, a dependency refresh, a vendored GLib iterator soundness backport for GTK3, redirect validation and device-token key protection, cryptographic identifiers for kanban records, constrained markdown link and image destinations, and single-pass HTML entity decoding on import. Three further fork branches hold accessibility, test and SECURITY.md changes that are open as upstream PRs OpenKnots/code-editor #20, #21 and #22.

**Real-world use case (2025–2026 evidence).** **Proposed use case.** A developer on a workstation where source code may not be sent to third-party SaaS runs an OpenClaw gateway bound to loopback, points Knot Code at it, and gets agent chat, plan mode and inline edits while the repository stays on disk. Three pieces of external evidence support the shape of this scenario. Stack Overflow's 2025 Developer Survey (49,000+ respondents) found 84% of developers using or planning to use AI tools while 46% distrust the accuracy of their output, which is the review-every-diff posture that Knot Code's per-hunk accept/reject flow is built for.[^1] OpenClaw's gateway is documented as the single control plane that runs on the user's own machine or server, with a local-first design that keeps keys, config and data on that machine; Knot Code is a client of that gateway, not a replacement for it.[^2] Tauri 2.x, the desktop runtime Knot Code is built on, shipped its 2.12 release in September 2026 with a new permission request handler, so the native shell that keeps the app at a few megabytes without a bundled browser is actively maintained.[^3] The repository contains Vitest unit tests for the `lib/` modules and screenshots of the running app, but no deployment config or fixture that demonstrates this specific locked-down scenario, so it is labeled proposed rather than verified.

[^1]: Stack Overflow, "Stack Overflow's 2025 Developer Survey Reveals Trust in AI at an All Time Low", press release, 2025-07-29. https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey

[^2]: MarkTechPost, "OpenClaw Releases iOS and Android Companion Node Apps That Connect a Phone to a Self-Hosted AI Agent Gateway", 2026-06-29. https://www.marktechpost.com/2026/06/29/openclaw-releases-ios-and-android-companion-node-apps-that-connect-a-phone-to-a-self-hosted-ai-agent-gateway/

[^3]: Tauri, "Announcing Tauri 2.12", 2026-09-26. https://tauri.app/blog/tauri-2.12/

## Upstream

- **Upstream project:** [OpenKnots/code-editor](https://github.com/OpenKnots/code-editor) (Knot Code), licensed under the [Apache License 2.0](LICENSE). The license file is preserved unchanged; neither upstream nor this fork ships a NOTICE file.
- **Fork created:** 2026-03-06 (GitHub `created_at`).
- **Sync status (2026-10-20):** 8 commits ahead of and 0 commits behind `OpenKnots/code-editor@main` (`gh api repos/Alexi5000/BobKnots/compare/OpenKnots:main...Alexi5000:main`).
- **What changed in this fork:** 8 commits, 146 files changed (+57,742 / -3,288). 124 of those files and about 54,900 of the added lines are the vendored `src-tauri/vendor/glib` crate carrying the iterator soundness backport; the remaining changes are small code and CI fixes.
  - `8cd2695` fix(ci): use pnpm 9 compatible with Node 20 (#1)
  - `e5706a6` ci: allow manual quality verification (#2)
  - `7cb1204` fix: refresh vulnerable JavaScript and Rust dependencies (#3)
  - `2ff0b69` fix: backport upstream GLib iterator soundness patch for GTK3 (#4)
  - `54ee16a` Validate preview and Spotify redirects and protect device token keys (#5)
  - `44007d6` fix: use cryptographic identifiers for kanban records (#6)
  - `c44779d` fix: constrain rendered markdown link and image destinations (#7)
  - `16fb579` fix: decode imported HTML entities once (#8)

## Screenshots

|                   Chat                   |                 Agent Workshop                 |
| :--------------------------------------: | :--------------------------------------------: |
| ![Chat screen](./assets/chat-screen.png) | ![Agent Workshop](./assets/agent-workshop.png) |

|                 Prompt Library                 |                Skills Library                |
| :--------------------------------------------: | :------------------------------------------: |
| ![Prompt Library](./assets/prompt-library.png) | ![Skills Library](assets/skills-library.png) |

|                Project Tasks                 |
| :------------------------------------------: |
| ![Project Tasks](./assets/project-tasks.png) |

## How It Compares

|                          |       **Knot Code**       |   **Cursor**   |  **Windsurf**   | **VS Code + Copilot** | **Competitor Avg** |
| ------------------------ | :-----------------------: | :------------: | :-------------: | :-------------------: | :----------------: |
| **App Size**             |        **7.8 MB**         |    ~500 MB     |     ~450 MB     |     ~400 MB + ext     |    **~450 MB**     |
| **RAM (idle)**           |        **~80 MB**         |  500 MB–2 GB   |  400 MB–1.5 GB  |      300 MB–1 GB      |    **~750 MB**     |
| **RAM (AI active)**      |        **~120 MB**        |    1–10+ GB    |     1–4 GB      |      500 MB–2 GB      |    **~2.5 GB**     |
| **Startup**              |          **<1s**          |      3–8s      |      3–6s       |         2–5s          |      **~4s**       |
| **Electron?**            | ❌ Tauri (native WebKit)  |  ✅ Electron   |   ✅ Electron   |      ✅ Electron      |  **3/3 Electron**  |
| **AI Backend**           |     Your own gateway      |  Cursor cloud  | Windsurf cloud  |     GitHub cloud      |   **All cloud**    |
| **Data Privacy**         |      **100% local**       | Sent to Cursor | Sent to Codeium |    Sent to GitHub     |   **All cloud**    |
| **BYO Model**            | ✅ Any model via OpenClaw | ❌ Cursor only |   ❌ Limited    |    ❌ Copilot only    |      **0/3**       |
| **Custom System Prompt** |  ✅ Agent Builder wizard  |       ❌       |       ❌        |          ❌           |      **0/3**       |
| **Themes**               |        24 built-in        |       3        | VS Code themes  |    VS Code themes     |         —          |
| **Offline AI**           | ✅ Local models supported |       ❌       |       ❌        |          ❌           |      **0/3**       |
| **Subscription**         |     **Free forever**      |     $20/mo     |     $15/mo      |        $10/mo         |    **~$15/mo**     |
| **Open Source**          |       ✅ Apache 2.0       | ❌ Proprietary | ❌ Proprietary  |       Partially       |     **0.5/3**      |

> **Why so light?** Knot Code uses Tauri (Rust + native WebKit) instead of Electron. No bundled Chromium. No background processes phoning home. The AI runs through your own [OpenClaw](https://github.com/openclaw/openclaw) gateway — your keys, your models, your data stays on your machine.

## Platform Availability

<p align="center">
  <img src="assets/knotcode-platforms.png" alt="KnotCode — Available on macOS, Windows, Linux, and iOS" width="720" />
</p>

| Platform              | Format              | Status      |
| --------------------- | ------------------- | ----------- |
| macOS (Apple Silicon) | `.dmg`              | Available   |
| Windows (x64)         | `.msi`, `.exe`      | Available   |
| Linux (x64)           | `.AppImage`, `.deb` | Available   |
| iOS (iPhone/iPad)     | App Store           | Coming Soon |

## Quick Start

### Desktop

Download the [latest release](https://github.com/OpenKnots/code-editor/releases/latest) for your platform (`.dmg`, `.exe`, `.msi`, `.AppImage`, `.deb`).

After installing, macOS may show _"KnotCode is damaged"_ — this is because the app isn't notarized with Apple (yet). Fix it with:

```bash
xattr -cr /Applications/KnotCode.app
```

Or build from source:

```bash
pnpm install
pnpm desktop:dev          # dev mode (Tauri + hot reload)
pnpm desktop:build        # production build (.app + .dmg)
```

> First Tauri build takes 2-5 minutes (compiling Rust deps). Subsequent builds are fast.

### Web (self-hosted)

```bash
pnpm install
pnpm dev              # http://localhost:3080
pnpm build            # static export
```

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) gateway running locally
- Node.js 20+
- pnpm

### Environment

Copy `.env.example` to `.env` and configure. All variables are optional — the editor works without them, but GitHub auth and plugins need their respective keys.

## Features

- **AI Agent Chat** — Ask, Agent, and Plan modes with streaming responses
- **Agent Builder** — Choose a persona, customize your system prompt, configure behaviors
- **Inline Edits** — Agent proposes changes, you review diffs and accept/reject per-hunk
- **24 Themes** — Claude, Supreme, Obsidian, Neon, Catppuccin, VooDoo, CyberNord, PrettyPink, and 16 more
- **Monaco Editor** — Multi-tab, Vim mode, syntax highlighting, Cmd/Ctrl+P quick open
- **GitHub Integration** — Token-based auth, commit, push, branch switching
- **Terminal** — Integrated xterm.js with gateway slash commands
- **Spotify + YouTube** — Built-in music and video plugins
- **Desktop Native** — Tauri v2 with local file system access, git operations, OS keychain

See [docs/FEATURES.md](docs/FEATURES.md) for the full feature list and roadmap.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the technical architecture, data flow, and component map.

## Documentation

| Doc                                           | Description                                 |
| --------------------------------------------- | ------------------------------------------- |
| [FEATURES.md](docs/FEATURES.md)               | Feature list, status, and roadmap           |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)       | Technical architecture and component map    |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md)         | Development workflow and conventions        |
| [DESKTOP.md](docs/DESKTOP.md)                 | Tauri desktop build details                 |
| [IOS.md](docs/IOS.md)                         | iOS application scope and rollout plan      |
| [AGENT.md](docs/AGENT.md)                     | AI agent integration                        |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and fixes                     |
| [SECURITY.md](SECURITY.md)                    | Security policy and vulnerability reporting |

## Keyboard Shortcuts

| Shortcut     | Action                         |
| ------------ | ------------------------------ |
| `Cmd/Ctrl+P` | Quick file open (fuzzy search) |
| `Cmd/Ctrl+K` | Inline edit at selection       |
| `Cmd/Ctrl+B` | Toggle file explorer           |
| `Cmd/Ctrl+I` | Toggle agent panel             |
| `Cmd/Ctrl+J` | Toggle terminal                |
| `Enter`      | Send message / Start chat      |
| `Esc`        | Close overlays                 |

## Tech Stack

- **Framework:** Next.js 16 + React 19 + TypeScript 5.9
- **Desktop:** Tauri v2 (Rust + system WebKit) — no Electron
- **Editor:** Monaco Editor with optional Vim mode
- **Terminal:** xterm.js with fit addon and web links
- **Styling:** Tailwind CSS v4 (CSS custom properties)
- **Icons:** @iconify/react (Lucide icon set)
- **Package Manager:** pnpm

## Security

As of 2026-10-21 this fork has 0 open Dependabot alerts (GitHub `vulnerabilityAlerts(states: OPEN)` = 0) and 0 open secret-scanning alerts, and no known upstream advisory without a fixed release applies to its dependency tree. CodeQL reported 18 open medium-severity warnings and no critical or high findings on 2026-10-20: unpinned third-party action tags and missing explicit `permissions` blocks in the GitHub workflows, three indirect command-line injection findings in `scripts/release.mjs`, and a missing `postMessage` origin check in `components/plugins/youtube/youtube-plugin.tsx`. The four findings in `ci.yml` are fixed in this fork by pinning `dtolnay/rust-toolchain` and `pnpm/action-setup` to commit SHAs and setting `permissions: contents: read`; the other 14 remain open and have not been dismissed. Report vulnerabilities as described in [SECURITY.md](SECURITY.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

## License

[Apache License 2.0](LICENSE) — Copyright 2025-2026 OpenKnot Contributors
