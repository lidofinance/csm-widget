# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

The project requires an `.env.local` file with environment variables. Copy from `.env.example` and configure:

- `MODULE` - Set to `csm` (default) or `cm` to choose the module version
- RPC provider URLs and CL API URLs with keys
- For testing, also set `STAND_TYPE`, `WALLET_SECRET_PHRASE`, `WALLET_PASSWORD`

Install Playwright browser for tests: `yarn playwright install chromium --with-deps`

## Architecture Overview

This is a Next.js React application for Lido's Community Staking Module (CSM) widget, built on the Lido Frontend Template.

### Module Versions

**IMPORTANT**: This application has two distinct versions that share the same codebase:

- **CSM (Community Staking Module)** - Fully implemented and production-ready
- **CM (Curated Module v2)** - Currently in development

#### Configuration

The active version is controlled by the `MODULE` environment variable:

- Set `MODULE=csm` (default) for Community Staking Module
- Set `MODULE=cm` for Curated Module

The module value is:

1. Read from `process.env.MODULE` in `next.config.mjs` (uppercased to `moduleMode`)
2. Exposed via `publicRuntimeConfig.module`, then mapped to the `MODULE_NAME` enum in `config/get-preconfig.ts`
3. Accessible throughout the app via `useConfig()` hook: `config.module`

#### Detecting Module Version in Code

**Config-based detection:**

```typescript
import { useConfig } from 'config';

const {
  config: { module },
} = useConfig();
// module === 'CSM' or 'CM' (MODULE_NAME enum values, uppercase)
```

**Show Rules (for conditional rendering):**

Use the `useShowRule` hook with `IS_CSM` or `IS_CM` rules:

```typescript
import { useShowRule } from 'shared/hooks';

const check = useShowRule();
if (check('IS_CSM')) {
  // CSM-specific logic
}
```

Show rules can be applied to:

- Navigation items (see `shared/layout/navigation/use-nav-items.tsx`)
- Page components
- Feature flags
- Any conditional UI rendering

**Gates (CM-specific):**

For CM module, gates control operator access levels:

- Retrieved via `useAvailableGates` hook
- Gate types: `curated`, `permissioned`, `permissionless`
- Each gate has an ID, name, and curveId
- Used in CM operator registration flow

#### Module-Specific Features

Each module version has its own set of features and pages. The module type determines:

- Available navigation routes
- Feature accessibility
- UI components and workflows specific to that module type
- Permission gates (CM only)

Module constants and titles are defined in `consts/module.ts`.

### Project Structure

#### Key Architecture Patterns

**Feature-Based Structure**: Each feature in `features/` contains its page component, form logic, and feature-specific components.

**Web3 Integration**:

- `modules/web3/web3-provider/` - Wagmi + Reef-Knot wallet provider setup
- `modules/web3/hooks/` - Custom hooks for blockchain data (balances, operator info, etc.)
- `modules/web3/operator-provider/` - Node operator context and state management

**SDK Access:**

Use `useSmSDK()` hook to access Lido SDK instances:

- `useSmSDK()` - Returns module-agnostic SDK (CSM or CM based on MODULE env var)
- `useSmSDK(MODULE.CSM)` - Returns CSM-specific SDK with type safety
- `useSmSDK(MODULE.CM)` - Returns CM-specific SDK with type safety

Note: "SM" = Staking Module (module-agnostic terminology for code shared between CSM and CM).

**Configuration System**:

- Runtime configuration with server/public configs in `next.config.mjs`
- Feature flags in `config/feature-flags/`
- User configuration in `config/user-config/`

**Shared Components**:

- `shared/components/` - Reusable UI components
- `shared/hook-form/` - Form controls and validation utilities
- `shared/layout/` - Navigation, header, footer components

### Development Notes

- Uses **publicRuntimeConfig** for environment variables to support Docker deployment
- Includes bundle analysis with `ANALYZE_BUNDLE=true yarn build`
- Has automatic versioning using conventional commits
- Uses Playwright for e2e testing with wallet extensions

Form conventions live in `features/CLAUDE.md`; e2e test conventions live in `tests/CLAUDE.md`.

### Show Rules

`useShowRule` from `shared/hooks` powers conditional rendering based on module, wallet, and operator state:

- Module: `IS_CSM`, `IS_CM`
- Wallet: `IS_CONNECTED_WALLET`, `IS_MAINNET`
- Operator: `IS_NODE_OPERATOR`, `NOT_NODE_OPERATOR`, `HAS_MANAGER_ROLE`, `HAS_REWARDS_ROLE`, `HAS_OWNER_ROLE`
- Features: `HAS_LOCKED_BOND`, `CAN_CREATE`, `CAN_CLAIM_ICS`

Used in navigation items (`use-nav-items.tsx`), page guards, and conditional UI.

## Code Style

**IMPORTANT**: Follow these rules when writing code:

- Always use `type` instead of `interface` for TypeScript type definitions
- Use function expressions only (`func-style: expression`) — no function declarations
- No `console.log` — only `console.warn`, `console.error`, `console.info`, `console.debug`
- Prefix unused variables with `_` (e.g., `_unused`)
- Respect `.editorconfig` (2-space indent) and `.prettierrc` (single quotes, trailing commas)
- Run `yarn lint:fix` after changes

## Commit Conventions

- Conventional commits required: `fix:`, `feat:`, `chore:`, etc.
- Enforced by commitlint + husky pre-commit hooks

## Figma Design

- When implementing UI from Figma designs, always use **exact texts** from the design. Do not rephrase, rewrite, or improvise copy — use the precise wording as shown in the Figma mockup.

## Copy & Text

- UI prose punctuation depends on sentence count: a single sentence has **no trailing dot**; two or more sentences end with a dot. Applies to descriptive copy — tooltips, descriptions, helper text, info/warning banners, error and toast messages — not button labels, titles, or short headings.
- Only the trailing **dot** is governed: leave `?`, `!`, and `…` as-is. Commas, semicolons, abbreviations (e.g., etc.), decimals, and URLs do not split a sentence.
- Examples: `"…Increases daily."` (2 sentences → dot); `"…part of your Excess Bond"` (1 sentence → no dot).
