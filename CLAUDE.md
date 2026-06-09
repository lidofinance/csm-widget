# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `yarn dev` - Starts Next.js development server on <http://localhost:3000>
- **Build**: `yarn build` - Builds production bundle
- **Production server**: `yarn start` - Starts production server (requires build first)
- **Lint**: `yarn lint` - Runs ESLint on TypeScript files
- **Lint fix**: `yarn lint:fix` - Runs ESLint with auto-fix
- **Type check**: `yarn types` - Runs TypeScript compiler type checking
- **Tests**: `yarn test` - Runs Playwright e2e tests (same as `yarn test:e2e`)
- **Unit tests**: `yarn test:unit` - Runs Jest unit tests

## Environment Setup

The project requires an `.env.local` file with environment variables. Copy from `.env.example` and configure:

- `MODULE` - Set to `csm` (default) or `cm` to choose the module version
- RPC provider URLs and CL API URLs with keys
- For testing, also set `STAND_TYPE`, `WALLET_SECRET_PHRASE`, `WALLET_PASSWORD`, `RPC_URL_TOKEN`

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

1. Read from `process.env.MODULE` in `next.config.mjs` (line 21)
2. Exposed via `publicRuntimeConfig.module` (line 201)
3. Accessible throughout the app via `useConfig()` hook: `config.module`

#### Detecting Module Version in Code

**Config-based detection:**

```typescript
import { useConfig } from 'config';

const {
  config: { module },
} = useConfig();
// module === 'csm' or 'cm'
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

### Key Technologies

- **Next.js 12** with Pages Router (not App Router)
- **React 18** with TypeScript
- **Styled Components** for styling
- **Wagmi v2** + **Reef-Knot** for Web3 wallet connections
- **Lido SDKs** (`@lidofinance/lido-csm-sdk`, `@lidofinance/lido-ethereum-sdk`)
- **React Query** for data fetching
- **React Hook Form** for form management
- **viem** for blockchain interactions

### Project Structure

#### Core Directories

- **`features/`** - Main feature modules (dashboard, add-bond, add-keys, etc.)
- **`shared/`** - Reusable components, hooks, utilities
- **`modules/web3/`** - Web3 provider setup and blockchain hooks
- **`config/`** - Configuration management with feature flags
- **`consts/`** - Application constants and mappings
- **`pages/`** - Next.js pages and API routes

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

### Form Architecture

Forms follow a layered provider pattern documented in `shared/hook-form/README.md`:

```
DataProvider → FormProvider → FormControllerProvider → Form → FormLoader → Controls
```

Each form lives in `features/{feature}/{form-name}/` with a standard file structure:

- `context/types.ts` — `*FormInputType` (form fields) and `*FormNetworkData` (blockchain data)
- `context/{form}-data-provider.tsx` — Network data fetching via React Query
- `context/{form}-provider.tsx` — React Hook Form setup with validation + submission
- `context/use-{form}-default-values.ts` — Initial values from network data
- `context/use-{form}-validation.ts` — Validation using `useFormValidation()` + `ValidationError`
- `context/use-{form}-submit.ts` — Transaction submission (`FormSubmitterHook` pattern)
- `context/{form}-updater.tsx` — Optional cross-field revalidation
- `controls/` — Form input components
- Custom `*FormLoader` — Permission-based rendering (show `<Info />` for read-only, full form for authorized users)

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

## Testing

### PageObject rules

- Tests, pages, and components must always use the correct PageObject
- All locators must reference the component's `data-testid`
- If an element has no `data-testid`, add one — but only where it makes logical sense
- All `data-testid` values must be in camelCase
- Always start from fixtures and build on them

### Test structure

- Test names follow the `"should ... when ..."` pattern
- Each test must cover the UI comprehensively — don't write a test that makes only one assertion
- Always use `test.step` to structure assertions
- Always use fixtures

### Test name style

Names must be **very short** — the `describe` block already provides state context, the test name should only say what it checks.

- Bad: `'Should show correct stETH amount, enable claim button and show "will receive" info when "Claim All" is selected'`
- Bad: `'Should show correct stETH amount and "will receive" info when "Claim All" selected'`
- Good: `'Should show correct stETH and "will receive" when "Claim All" selected'`
- Good: `'Should show SDK amounts on balance cards'`
- Good: `'Should disable "Excess Bond" option when all excess locked'`

Rules:

- Don't repeat the describe context (state/condition) in the test name
- Don't list every assertion — name the main thing being verified
- Drop filler: "and show success modal", "with correct", "option is" → "option", "is selected" → "selected", "is active" → "active", "info icon" → drop
- `when X` at the end is ok only if it adds info not already in describe

### Amount assertions

- **Never** use `not.toContainText('0.0 stETH')` or similar non-zero UI checks
- Compare against SDK values: `cmSDK.operator.getBondBalance(BigInt(noId))` → `.delta`, `cmSDK.getRewards(noId)` → `.available`, convert with `formatEther()`
- When SDK isn't available, use regex: `await expect(element).toContainText(/\d+\.\d+/)`
- Tolerance depends on display precision:
  - Balance cards (display `X.X` — 1 decimal): `Math.abs(parseFloat(text) - expected) < 0.1`
  - Form info / token selector (display 4 decimals): `Math.abs(parseFloat(text) - expected) < 0.0002`

### Fork test pattern

```typescript
let snapshotId: string;
let noId: number; // at describe scope when multiple tests need it

test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
  snapshotId = await cmSDK.evmSnapshot();
  await widgetService.somePage.open();
  noId = await widgetService.extractNodeOperatorId(); // must be before fork actions
  await forkActionService.someSetup(noId, ...);
  await widgetService.somePage.open(); // reopen to reflect new chain state
});

test.afterAll(async ({ cmSDK }) => {
  await cmSDK.evmRevert(snapshotId);
});
```

Use `beforeAll`/`afterAll` (one snapshot per describe), not `beforeEach`/`afterEach`.

### Claim option constants

Always import from the shared file — never inline raw strings:

```typescript
import { CLAIM_OPTION } from './claim.const';
// CLAIM_OPTION.ALL_TO_RA | CLAIM_OPTION.BOND_TO_RA | CLAIM_OPTION.REWARDS_TO_BOND
```
