# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

The project requires an `.env.local` file with environment variables. Copy from `.env.example` and configure:

- RPC provider URLs and CL API URLs with keys
- For testing, also set `STAND_TYPE`, `WALLET_SECRET_PHRASE`, `WALLET_PASSWORD`

Install Playwright browser for tests: `yarn playwright install chromium --with-deps`

## Architecture Overview

This is a Next.js React application for the unified Lido "Operators" widget, built on the Lido Frontend Template. One deployment serves every staking module — CSM, CSM_02 and CM — there is no `MODULE` env or "primary" module.

### Module Versions

`deployedModules` (`consts/modules`) lists the modules configured for the current chain (CSM first). Which module a screen is about is never static — it comes from the active node operator:

- **Two-zone rule**: operator-facing code (dashboard, keys, bond, claim, …) reads the module reactively via `useModule()` / `useSmSDK()` / `useModuleMeta()`. Pre-operator code (welcome, starter pack, `/create`) has no active module yet and passes an explicit `MODULE_NAME` where one is needed (e.g. `/create/cm` passes `MODULE_NAME.CM`). Never silently default to CSM in operator-facing code.
- `useModule()` returns `{ module: MODULE_NAME | undefined, isCSM, isCSM02, isCsmFamily, isCM }` — `module` is `undefined` until an operator is active, and all booleans are `false` in that state.

#### Detecting Module Version in Code

**Reactive (operator-facing) detection:**

```typescript
import { useModule } from 'modules/web3';

const { module, isCSM, isCM } = useModule();
// module is MODULE_NAME.CSM / CSM_02 / CM, or undefined pre-operator
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

The active operator's module determines:

- Available navigation routes
- Feature accessibility
- UI components and workflows specific to that module type
- Permission gates (CM only)

Module constants and titles are defined in `consts/module.ts`; the widget brand (`WIDGET_TITLE`, etc.) is module-neutral.

### Project Structure

#### Key Architecture Patterns

**Feature-Based Structure**: Each feature in `features/` contains its page component, form logic, and feature-specific components.

**Web3 Integration**:

- `modules/web3/web3-provider/` - Wagmi + Reef-Knot wallet provider setup
- `modules/web3/hooks/` - Custom hooks for blockchain data (balances, operator info, etc.)
- `modules/web3/operator-provider/` - Node operator context and state management

**SDK Access:**

Use `useSmSDK()` hook to access Lido SDK instances:

- `useSmSDK()` - Active operator's SDK, or `undefined` when no operator is active
- `useSmSDK(MODULE_NAME.CSM)` - That module's SDK whether or not it is active; `undefined` if not deployed
- `useActiveSmSDK(MODULE_NAME.CM)` - That module's SDK only while it is the active operator's module, else `undefined`. Use in operator-scoped queries as the `enabled` gate
- `useTargetSmSDK(module?)` - `{ targetModule, sdk }` for `module`, defaulting to the active one, else `undefined`

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
