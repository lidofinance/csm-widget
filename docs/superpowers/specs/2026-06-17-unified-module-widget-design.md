# Unified CSM/CM Widget — Design

- **Date:** 2026-06-17
- **Status:** Approved (design); implementation plan pending
- **Author:** exromany

## Problem

The widget ships as **two separate deployments** selected at boot by the `MODULE`
env var (`csm` | `cm`). `MODULE` flows `process.env.MODULE` → `publicRuntimeConfig.module`
→ `config.module`, read **once at startup**. Everything module-specific derives from
that frozen value:

- `LidoSDKProvider` instantiates **exactly one** SDK —
  `isModuleCSM ? new LidoSDKCsm() : new LidoSDKCm()` (`modules/web3/web3-provider/lido-sdk.tsx:131`).
- `useAvailableOperators` discovers operators through that single SDK's
  `discovery.getNodeOperatorsByAddress()` (`modules/web3/operator-provider/use-available-operators.ts:11-31`)
  — so it can only ever see one module's operators.
- `useShowRule`'s `IS_CSM`/`IS_CM` (`shared/hooks/use-show-rule.ts:119-120`), `moduleMeta`,
  and the const exports `isModuleCSM`/`isModuleCM` (`consts/module.ts:27-28`) all derive
  from the static value. **~144 references total, ~97 inside `features/`.**

## Goal

A **single** widget that discovers a connected wallet's operators across **both** modules
and, based on the **active operator**, applies CSM or CM rules.

### Mental model (confirmed)

1. **One active operator drives the app.** Discovery merges operators from both modules
   into one list; a single active operator is resolved, and the whole app reconfigures to
   that operator's module rules. **Module becomes reactive state derived from the active
   operator.**
2. **Unified branding.** One widget title/brand. The active operator's module is surfaced
   as a small **badge in the header next to operator-id**.
3. **Module is strictly a property of the active operator.** There is **no default module
   and no deploy module** anywhere. Module is present when an operator is active and
   **`undefined`** when none — `undefined` renders a **unified, module-agnostic UI**. The
   unified no-operator screens are _designed from_ today's CSM no-operator behaviour, but
   module does **not** silently become CSM.

## Non-goals (out of scope, this iteration)

- **Creating operators** (the `/create` flow and create-adjacent landing/welcome screens —
  `StarterPackPage`, `CmWelcomePage` — are kept working, not unified).
- **Switching-operator UX** (the selector polish / explicit cross-module switch).

In scope (required for "active operator drives the app"): active-operator **resolution**
(cached → first-found) and the **module-qualified cache shape**.

## Architecture

### Operator identity becomes `(module, id)`

`NodeOperatorId` alone is no longer unique — id `5` can exist in both modules. Identity is
the pair. The merged operator type carries its module:

```ts
type ActiveOperator = NodeOperatorShortInfo & { module: MODULE_NAME };
```

### Provider layering (no circular dependency)

```
LidoSDKProvider (builds BOTH SDKs over one shared core)
  └─ NodeOperatorProvider (discovery via both SDKs; resolves active operator + activeModule)
       └─ features (consume useModule() / useSmSDK() = active module's SDK)
```

Discovery reads **both** SDKs _directly_ (via `useLidoSDK()`), while the active-module
`useSmSDK()` is only consumed by feature code _below_ the operator provider — so there is
no cycle.

### Dual SDK

`LidoSDKProvider` (`modules/web3/web3-provider/lido-sdk.tsx:99-142`) builds both SDKs over
the one shared `core` (which already owns chain/RPC/wallet):

```ts
const csm = new LidoSDKCsm(smProps);
const cm = new LidoSDKCm(smProps);
// context exposes { core, stake, …, csm, cm }  (instead of a single `sm`)
```

### Discovery across both modules

`use-available-operators.ts` queries both and merges with module tags:

```ts
const [csmOps, cmOps] = await Promise.all([
  csm.discovery.getNodeOperatorsByAddress(address),
  cm.discovery.getNodeOperatorsByAddress(address),
]);
return [...tag(csmOps, MODULE_NAME.CSM), ...tag(cmOps, MODULE_NAME.CM)];
```

### Operator-context owns the active module

The active operator already lives in `NodeOperatorProvider`
(`modules/web3/operator-provider/node-operator-provider.tsx:54-78`). We extend it so
`activeModule = activeOperator?.module` (no fallback) and expose it. `useModule()` is a
thin selector over this context.

### `useModule()` contract

```ts
{ module: MODULE_NAME | undefined, isCSM: boolean, isCM: boolean }
// no active operator ⇒ module undefined ⇒ isCSM=false, isCM=false ⇒ unified UI
```

`useSmSDK()` reads `activeModule` and returns `csm`/`cm`; `useSmSDK(MODULE.CM)` returns the
CM SDK only when `activeModule === CM` — **identical semantics to today**, sourced from the
active operator instead of `config.module`. Every existing CM-only / CSM-only data hook
keeps working unchanged.

### Cache key gains the module

`use-cached-id.ts:6-17` — today `sm-${moduleId}-no-${address}`. We persist the pair
`{ id, module }` per address so resolution (cached → first-found) survives reloads, even
though the switcher UX is out of scope.

## The migration

There is **no "deploy module" fallback**. Reads split into three meanings:

| Concern                                                                                                                           | Resolution                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Render-path** (`features/**` ~97, `faq/index.ts:142`, dashboard titles, keys/bond/monitoring branches, `use-external-links.ts`) | `useModule()` — reactive; `undefined` renders unified                                 |
| **Widget branding** (title, OG, `manifest`, `scripts/build-dynamics.mjs:22`, `consts/matomo-click-events.ts:19`)                  | **Unified** — module dependency _removed_. Per-module manifest copy collapses to one. |
| **Server / metrics** (`utilsApi/contractAddressesMetricsMap.ts:68`)                                                               | Carries **both** modules' addresses                                                   |
| **Pure helpers** (`consts/operator-type-metadata.ts:118`)                                                                         | Takes `module` as an **argument** from the operator; reads no global                  |

`MODULE_METADATA` survives only for its **per-module short labels** (the header badge);
its widget-level title/host/preview are superseded by the unified brand.

Mechanical transform for the render-path bucket:
`import { isModuleCSM }` → `const { isCSM } = useModule()`. Volume, not difficulty.

## Show-rules, routing & query keys

- **Show-rules reactive** (`shared/hooks/use-show-rule.ts`): `IS_CSM`/`IS_CM` (119-120),
  `ICS_APPLY_ENABLED`/`IS_SURVEYS_ACTIVE` (114-118), and `useFilterShowRules`'
  `module === config.module` (162) swap `config.module` → `activeModule`.
- **No active operator ⇒ `IS_CSM` and `IS_CM` both false.** Module-gated routes
  (`/type/*` → `IS_CSM`, `/settings/metadata` & `/group` → `IS_CM`) are naturally excluded;
  the unified no-operator shell relies on neither rule.
- **Nav filtering** (`shared/layout/navigation/use-nav-items.tsx:38,113`) and `Gate`
  routing react automatically — a CM operator on `/type/*` redirects home with no extra code.
- **React-Query keys gain module.** Operator-scoped keys (`use-operator-info`, etc.) are
  single-module-implicit today; with two SDKs live, id `5` could collide across modules, so
  module joins the `queryKey`. Discovery's key already includes `address`.

## UI states & branding

The shell renders one of four states, keyed on wallet + resolution + `useModule()`:

| State                  | Module      | UI                                                                          |
| ---------------------- | ----------- | --------------------------------------------------------------------------- |
| Disconnected           | —           | Unified connect prompt (sourced from today's CSM)                           |
| Connected, resolving   | —           | Unified loading (same shell as no-operator)                                 |
| Connected, 0 operators | `undefined` | Unified empty state (from CSM's no-operator screen; create CTA stays as-is) |
| Active operator        | `CSM`\|`CM` | Module-specific UI via `isCSM`/`isCM`                                       |

- Operator-scoped pages (dashboard, keys, bond, monitoring, settings, roles) always have an
  active operator → cleanly module-specific.
- **Branding:** widget title/OG/manifest become one unified brand (replaces
  `MODULE_METADATA.title` at `pages/_app.tsx:47` and `navigation.tsx:40`).
- **Header badge:** active operator's module shown next to operator-id (around
  `shared/node-operator/switch-operator-button`), using `MODULE_METADATA[module].shortName`,
  only when an operator is active.

## Phasing

Each phase is independently mergeable into the current two-deploy setup without regression.

- **Phase 0 — Prep (low risk):** unify branding/manifest/matomo; make
  `contractAddressesMetricsMap` carry both modules; convert pure helpers
  (`operator-type-metadata`) to take `module` as an argument. No behavioural change per
  existing deploy.
- **Phase 1 — Dual SDK + discovery:** `LidoSDKProvider` builds both SDKs; discovery queries
  both and merges with module tags; operator-context resolves active operator + `activeModule`;
  cache key gains module. _A single deploy can now find operators across both modules._
- **Phase 2 — Reactive module (the bulk):** add `useModule()`; migrate render-path const
  reads → hook; make show-rules / `Gate` / nav reactive (gate on "operator resolved?");
  module-qualify React-Query keys; implement the nullable-module states.
- **Phase 3 — UI & verify:** unified brand live, header badge, unified no-operator shell;
  run the `csm-cm-parity-reviewer` agent over the diff and `form-architecture-reviewer` over
  any touched forms; add an e2e scenario for a wallet owning operators in **both** modules.

## Risks

1. **Resolution timing.** Before the active operator resolves (async, post-connect),
   `useModule()` returns `undefined`. `Gate` and module-gated screens must gate on
   **"operator resolved?"** (loading state), choosing between _unified_ and _module-specific_
   — never guessing between CSM and CM. Nullable (not defaulted) module keeps this simple:
   pre-resolution and no-operator render the _same_ unified shell.
2. **Query-key collisions** across modules → module-qualified keys.
3. **Parity surface.** ~97 branches become nullable; every migrated `isCSM`/`isCM` needs a
   verified unified `else` — guarded by the `csm-cm-parity-reviewer` agent in Phase 3.
4. **SDK instantiation** doubles some setup; minor (both already ship in the bundle).

## Open questions

- **Unified widget brand name** — TBD (replaces "Community Staking Module" / "Curated
  Module" as the title).

## Key files

- `modules/web3/web3-provider/lido-sdk.tsx` — `LidoSDKProvider`, `useLidoSDK`, `useSmSDK`
  (57-67, 99-142)
- `modules/web3/operator-provider/node-operator-provider.tsx` — provider, active operator
  (54-78), `switchNodeOperator` (58-66)
- `modules/web3/operator-provider/use-available-operators.ts` — discovery (11-31)
- `modules/web3/operator-provider/use-active-node-operator.ts` — active resolution (7-42)
- `modules/web3/operator-provider/use-cached-id.ts` — cache key (6-17)
- `consts/module.ts` — `MODULE_METADATA`, `moduleMeta`, `isModuleCSM`, `isModuleCM`
- `shared/hooks/use-show-rule.ts` — `IS_CSM`/`IS_CM`, `useFilterShowRules` (114-120, 156-172)
- `shared/layout/navigation/use-nav-items.tsx` — nav filtering (38, 113)
- `consts/operator-type-metadata.ts:118`, `utilsApi/contractAddressesMetricsMap.ts:68`,
  `consts/matomo-click-events.ts:19`, `scripts/build-dynamics.mjs:22`
