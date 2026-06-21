# Unified CSM/CM Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the two single-module deployments into one widget that discovers a wallet's operators across both CSM and CM and applies the active operator's module rules everywhere.

**Architecture:** Instantiate both SDKs in `LidoSDKProvider`; discovery queries both and merges operators tagged with their module; the operator-context owns the active operator and derives `activeModule`; a new `useModule()` hook replaces the frozen `isModuleCSM`/`isModuleCM` const reads on the render path; module becomes `undefined` when no operator is active (unified UI), never defaulted.

**Tech Stack:** Next.js 12 (Pages Router), React 18, TypeScript, `@lidofinance/lido-csm-sdk`, `@lidofinance/lido-ethereum-sdk`, `@tanstack/react-query`, styled-components. Verification gates: `yarn types` (tsc --noEmit), `yarn lint`, `yarn test:unit` (jest/ts-jest), Playwright e2e (`tests/`).

**Design spec:** `docs/superpowers/specs/2026-06-17-unified-module-widget-design.md`

**Conventions:** `type` not `interface`; function expressions only; conventional commits; no Claude co-author; `yarn lint:fix` after changes. There are currently **zero unit tests** — add Jest tests only for new pure helpers; verify wiring with `yarn types`/`yarn lint`/e2e.

---

## Phase 0 — Safe prep (no behaviour change)

Goal: remove the global-module read from pure helpers so later phases can pass module explicitly. Shippable to current deploys with zero visible change.

### Task 0.1: `operator-type-metadata` takes module as an argument

**Files:**

- Modify: `consts/operator-type-metadata.ts` (around line 118 — the function reading `config.module`)
- Modify: every caller of that function (find them in Step 1)

- [ ] **Step 1: Inventory the function and its callers**

Run:

```bash
grep -rn "operator-type-metadata\|getOperatorType" consts features shared modules --include="*.ts" --include="*.tsx"
```

Expected: the exported helper in `consts/operator-type-metadata.ts` and its call sites. Note the exact exported function name and current signature.

- [ ] **Step 2: Change the helper to accept `module: MODULE_NAME`**

In `consts/operator-type-metadata.ts`, replace the internal `config.module` read (line ~118) with a `module` parameter. Pattern:

```ts
// before: const meta = MAP[config.module]...
// after:
export const getOperatorTypeMetadata = (
  module: MODULE_NAME,
  /* existing params */
) => {
  const meta = MAP[module];
  // ...rest unchanged
};
```

Remove the now-unused `import { config } from 'config'` if nothing else uses it.

- [ ] **Step 3: Update callers to pass module**

React-side callers already have access to the module from the operator/SDK (e.g. `use-operator-type.ts` uses `sm.core.moduleName`). Pass that value through. Example for `modules/web3/hooks/use-operator-type.ts`:

```ts
return useOperatorCurveId(id, (curveId) =>
  getOperatorTypeByCurveId(sm.core.moduleName, curveId),
);
```

(unchanged if it already passes `sm.core.moduleName`; otherwise thread the module in).

- [ ] **Step 4: Typecheck + lint**

Run: `yarn types && yarn lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add consts/operator-type-metadata.ts modules consts features shared
git commit -m "refactor: pass module explicitly to operator-type metadata helper"
```

---

## Phase 1 — Dual SDK + cross-module discovery

Goal: both SDKs live; discovery finds operators in both modules; active-operator resolution and cache become module-qualified. UI still behaves single-module because `useSmSDK()` keeps reading `config.module` until Phase 2. **End state: a single deploy can already discover operators across both modules.**

### Task 1.0: SDK spike — confirm `core`/`moduleId`/`moduleName` semantics

The current provider builds ONE `LidoSDKCore` (with a hardcoded `'CSM'` second arg, `lido-sdk.tsx:108`) and passes it to one SDK. We must confirm whether two SDKs can share one core and still each report the correct `moduleId`/`moduleName`.

**Files:** read-only investigation in `/Users/exromany/projects/lido/lido-csm-sdk/packages/csm-sdk`

- [ ] **Step 1: Find how each SDK derives module identity**

Run:

```bash
grep -rn "moduleId\|moduleName\|class LidoSDKCsm\|class LidoSDKCm" /Users/exromany/projects/lido/lido-csm-sdk/packages/csm-sdk/src | grep -v test
```

Expected: locate where `LidoSDKCsm` and `LidoSDKCm` set/expose `moduleId` and `moduleName`, and whether `.core` is the passed-in core or an internal per-module core.

- [ ] **Step 2: Decide core strategy and record it**

Determine which holds:

- **(A)** Each SDK derives its own `moduleId`/`moduleName` from its class (shared `core` is safe) → build both SDKs over one `core`.
- **(B)** `moduleId`/`moduleName` come from `core` construction (the `'CSM'` arg) → build **two** cores, one per module, and pass each to its SDK.

Write the answer as a one-line comment at the top of `modules/web3/web3-provider/lido-sdk.tsx` so the next tasks follow it. No commit (investigation only).

### Task 1.1: Build both SDKs in `LidoSDKProvider`

**Files:**

- Modify: `modules/web3/web3-provider/lido-sdk.tsx`

- [ ] **Step 1: Add both SDKs to the context type**

Replace the `sm` field in `LidoSDKContextValue` (lido-sdk.tsx:43) with both:

```ts
type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  withdraw: LidoSDKWithdraw;
  csm: LidoSDKCsm;
  cm: LidoSDKCm;
};
```

- [ ] **Step 2: Instantiate both in the memo**

Replace line 131 (`const sm = isModuleCSM ? ...`) and the returned object. Per Task 1.0's decision, either share `core` (A) or build two cores (B). Strategy A:

```ts
const csm = new LidoSDKCsm(smProps);
const cm = new LidoSDKCm(smProps);

return {
  chainId: core.chainId,
  core,
  stake,
  stETH,
  wstETH,
  wrap,
  withdraw,
  csm,
  cm,
};
```

Remove the now-unused `import { isModuleCSM } from 'consts'`.

- [ ] **Step 3: Add `useSmSDKByModule` and re-point `useSmSDK` (behaviour-preserving)**

Replace the `useSmSDK` block (lido-sdk.tsx:57-67) with:

```ts
export const useSmSDKByModule = (module: MODULE_NAME) => {
  const { csm, cm } = useLidoSDK();
  return module === MODULE_NAME.CSM ? csm : cm;
};

export function useSmSDK(): LidoSDKCsm | LidoSDKCm;
export function useSmSDK(module: MODULE_NAME.CSM): LidoSDKCsm | undefined;
export function useSmSDK(module: MODULE_NAME.CM): LidoSDKCm | undefined;
// eslint-disable-next-line func-style
export function useSmSDK(module?: MODULE_NAME) {
  const { csm, cm } = useLidoSDK();
  const active = config.module; // Phase 1: still static; Phase 2 swaps to active operator
  if (module && module !== active) return undefined;
  return active === MODULE_NAME.CSM ? csm : cm;
}
```

- [ ] **Step 4: Verify both SDKs report distinct module identity**

Add a temporary `console.info` in the provider after building both:

```ts
console.info(
  'sdk modules',
  csm.core.moduleId,
  cm.core.moduleId,
  csm.core.moduleName,
  cm.core.moduleName,
);
```

Run: `yarn dev`, open the app, connect a wallet, check the console.
Expected: the two `moduleId`/`moduleName` values **differ**. If they're identical, switch to Task 1.0 strategy B (two cores). Remove the `console.info` once confirmed.

- [ ] **Step 5: Typecheck + lint**

Run: `yarn types && yarn lint`
Expected: no errors. (Existing `useSmSDK()` call sites compile unchanged — `operator`, `discovery`, `core` still resolve on the union.)

- [ ] **Step 6: Commit**

```bash
git add modules/web3/web3-provider/lido-sdk.tsx
git commit -m "feat: instantiate both CSM and CM SDKs in LidoSDKProvider"
```

### Task 1.2: Module-tagged operator type + pure merge helper

**Files:**

- Create: `modules/web3/operator-provider/types.ts`
- Create: `modules/web3/operator-provider/merge-operators.ts`
- Create: `modules/web3/operator-provider/merge-operators.test.ts`

- [ ] **Step 1: Define the tagged type**

`modules/web3/operator-provider/types.ts`:

```ts
import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';

export type ModuleNodeOperator = NodeOperatorShortInfo & {
  module: MODULE_NAME;
};

export type CachedOperatorRef = {
  id: NodeOperatorShortInfo['nodeOperatorId'];
  module: MODULE_NAME;
};
```

- [ ] **Step 2: Write the failing test for the merge helper**

`modules/web3/operator-provider/merge-operators.test.ts`:

```ts
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { mergeOperators } from './merge-operators';

const op = (id: bigint) => ({ nodeOperatorId: id }) as any;

describe('mergeOperators', () => {
  it('tags each operator with its module and concatenates CSM first', () => {
    const result = mergeOperators([op(1n)], [op(2n)]);
    expect(result).toEqual([
      { nodeOperatorId: 1n, module: MODULE_NAME.CSM },
      { nodeOperatorId: 2n, module: MODULE_NAME.CM },
    ]);
  });

  it('keeps same numeric id from different modules as distinct entries', () => {
    const result = mergeOperators([op(5n)], [op(5n)]);
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.module)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CM,
    ]);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `yarn test:unit merge-operators`
Expected: FAIL — `Cannot find module './merge-operators'`.

- [ ] **Step 4: Implement the helper**

`modules/web3/operator-provider/merge-operators.ts`:

```ts
import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { ModuleNodeOperator } from './types';

const tag =
  (module: MODULE_NAME) =>
  (operator: NodeOperatorShortInfo): ModuleNodeOperator => ({
    ...operator,
    module,
  });

export const mergeOperators = (
  csmOperators: NodeOperatorShortInfo[],
  cmOperators: NodeOperatorShortInfo[],
): ModuleNodeOperator[] => [
  ...csmOperators.map(tag(MODULE_NAME.CSM)),
  ...cmOperators.map(tag(MODULE_NAME.CM)),
];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `yarn test:unit merge-operators`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add modules/web3/operator-provider/types.ts modules/web3/operator-provider/merge-operators.ts modules/web3/operator-provider/merge-operators.test.ts
git commit -m "feat: add module-tagged operator type and merge helper"
```

### Task 1.3: Discovery queries both modules

**Files:**

- Modify: `modules/web3/operator-provider/use-available-operators.ts`

- [ ] **Step 1: Query both SDKs and merge**

Rewrite `use-available-operators.ts`:

```ts
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { mergeOperators } from './merge-operators';
import { useCachedNodeOperator } from './use-cached-node-operator';

export const KEY_OPERATORS = ['node-operators'];

export const useAvailableOperators = () => {
  const { csm, cm } = useLidoSDK();
  const { address } = useDappStatus();

  const { data: cached } = useCachedNodeOperator();
  const placeholderData = useMemo(
    () => (cached ? [cached] : undefined),
    [cached],
  );

  return useQuery({
    queryKey: [...KEY_OPERATORS, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      const [csmOperators, cmOperators] = await Promise.all([
        csm.discovery.getNodeOperatorsByAddress(address),
        cm.discovery.getNodeOperatorsByAddress(address),
      ]);
      return mergeOperators(csmOperators, cmOperators);
    },
    enabled: !!address,
    placeholderData,
  });
};
```

- [ ] **Step 2: Typecheck**

Run: `yarn types`
Expected: errors will surface in `use-active-node-operator.ts` / `node-operator-provider.tsx` because `list` is now `ModuleNodeOperator[]`. Those are fixed in Tasks 1.4–1.5. If only those files error, proceed.

- [ ] **Step 3: Commit (after 1.4–1.5 typecheck clean — see note)**

This task is committed together with 1.4 and 1.5 because they share the type change. Continue to Task 1.4 before committing.

### Task 1.4: Module-qualified cache + active-operator resolution

**Files:**

- Modify: `modules/web3/operator-provider/use-cached-id.ts`
- Modify: `modules/web3/operator-provider/use-cached-node-operator.ts`
- Modify: `modules/web3/operator-provider/use-active-node-operator.ts`
- Modify: `modules/web3/hooks/use-operator-short-info.ts`

- [ ] **Step 1: Store `{ id, module }` keyed by address only**

Rewrite `use-cached-id.ts` to persist the operator reference (not just the id), keyed per address:

```ts
import { useDappStatus } from '../hooks';
import { useLocalStorage } from 'shared/hooks';
import { CachedOperatorRef } from './types';

export const useCachedId = () => {
  const { address } = useDappStatus();

  return useLocalStorage<CachedOperatorRef | undefined>(
    address ? `sm-no-${address}` : undefined,
    undefined,
  );
};
```

(Drop the `BigInt` transform — the stored value is now an object. If `useLocalStorage`'s third arg is a value-transform, confirm omitting it serialises via JSON. `nodeOperatorId` is a bigint, so verify it round-trips; if not, store `id` as a decimal string and convert at read in Step 2.)

- [ ] **Step 2: Resolve the cached operator from the correct module's SDK**

`use-operator-short-info.ts` must fetch from a specified module, not the active one. Add an optional `module` param:

```ts
import {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK, useSmSDKByModule } from '../web3-provider';
import { KEY_OPERATOR_INFO } from './use-operator-info';

export const useOperatorShortInfo = <TData = NodeOperatorShortInfo>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorShortInfo) => TData,
  module?: MODULE_NAME,
) => {
  const active = useSmSDK();
  const scoped = useSmSDKByModule(module ?? active.core.moduleName);
  const operator = module ? scoped.operator : active.operator;
  const sdkModule = module ?? active.core.moduleName;

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_INFO,
      'short',
      { nodeOperatorId, module: sdkModule },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getManagementProperties(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
```

(Note: `useSmSDKByModule` is called unconditionally to respect hook rules; `active.core.moduleName` is the Phase-1 fallback. Adjust the exact `core.moduleName` accessor to whatever Task 1.0 confirmed.)

- [ ] **Step 3: Pass the cached module through `use-cached-node-operator`**

Rewrite `use-cached-node-operator.ts`:

```ts
import {
  getNodeOperatorRoles,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { useDappStatus, useOperatorShortInfo } from '../hooks';
import { useCachedId } from './use-cached-id';
import { ModuleNodeOperator } from './types';

export const useCachedNodeOperator = () => {
  const { address } = useDappStatus();
  const [cachedRef, setCachedRef] = useCachedId();

  const select = useCallback(
    (data: NodeOperatorShortInfo): ModuleNodeOperator | undefined => {
      if (!cachedRef || !address) return undefined;
      const roles = getNodeOperatorRoles(data, address);
      if (roles.length === 0) {
        setCachedRef(undefined);
        return undefined;
      }
      return { ...data, module: cachedRef.module };
    },
    [address, cachedRef, setCachedRef],
  );

  return useOperatorShortInfo(cachedRef?.id, select, cachedRef?.module);
};
```

- [ ] **Step 4: Resolve active operator by `(module, id)` and cache the ref**

Rewrite `use-active-node-operator.ts`. The list is now `ModuleNodeOperator[]`; match on both module and id; persist `{ id, module }`:

```ts
import { useEffect, useRef, useState } from 'react';
import { useDappStatus } from '../hooks';
import { useCachedId } from './use-cached-id';
import { useInvalidateOperatorCache } from './use-invalidate-operator-cache';
import { ModuleNodeOperator } from './types';

const sameOperator = (a?: ModuleNodeOperator, b?: ModuleNodeOperator) =>
  !!a && !!b && a.module === b.module && a.nodeOperatorId === b.nodeOperatorId;

export const useActiveNodeOperator = (list?: ModuleNodeOperator[]) => {
  const [active, setActive] = useState<ModuleNodeOperator | undefined>();
  const [, setCachedRef] = useCachedId();
  const { address } = useDappStatus();
  const invalidate = useInvalidateOperatorCache();

  const resolved = active ?? list?.[0];

  const prevActiveRef = useRef(resolved);
  const prevAddressRef = useRef(address);

  if (address !== prevAddressRef.current) {
    prevAddressRef.current = address;
    prevActiveRef.current = resolved;
    invalidate('operatorAndAddress');
  } else if (!sameOperator(resolved, prevActiveRef.current)) {
    prevActiveRef.current = resolved;
    invalidate('operator');
  }

  useEffect(() => {
    setActive((prev) => {
      const updated = list?.find((item) => sameOperator(item, prev));
      return updated ?? list?.[0];
    });
  }, [list]);

  useEffect(() => {
    if (resolved) {
      setCachedRef({ id: resolved.nodeOperatorId, module: resolved.module });
    }
  }, [resolved, setCachedRef]);

  return [resolved, setActive] as const;
};
```

- [ ] **Step 5: Typecheck + lint**

Run: `yarn types && yarn lint:fix`
Expected: the operator-provider files are clean. `node-operator-provider.tsx` may still error on the `switchNodeOperator(id)` signature — fixed in Task 1.5.

- [ ] **Step 6: Commit (1.3 + 1.4 together)**

```bash
git add modules/web3/operator-provider modules/web3/hooks/use-operator-short-info.ts
git commit -m "feat: discover operators across both modules with module-qualified cache"
```

### Task 1.5: Expose `activeModule` from the operator context

**Files:**

- Modify: `modules/web3/operator-provider/node-operator-provider.tsx`

- [ ] **Step 1: Add `activeModule` to the context and tag the operator type**

Rewrite the context value and provider:

```ts
import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { ModuleNodeOperator } from './types';
import { useActiveNodeOperator } from './use-active-node-operator';
import { useAvailableOperators } from './use-available-operators';

export type NodeOperatorContextValue = {
  isPending: boolean;
  nodeOperator: ModuleNodeOperator | undefined;
  activeModule: MODULE_NAME | undefined;
  switchNodeOperator: (id: NodeOperatorId, module: MODULE_NAME) => void;
};

export type NodeOperatorDefinedContextValue = NodeOperatorContextValue & {
  nodeOperator: ModuleNodeOperator;
  activeModule: MODULE_NAME;
};
```

(Keep `useNodeOperator` / `useNodeOperatorId` generics as-is; only the `nodeOperator` element type tightened.)

- [ ] **Step 2: Update the provider body**

```ts
export const NodeOperatorProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: list, isPending } = useAvailableOperators();
  const [active, setActive] = useActiveNodeOperator(list);

  const switchNodeOperator = useCallback(
    (id: NodeOperatorId, module: MODULE_NAME) => {
      const newActive = list?.find(
        (item) => item.nodeOperatorId === id && item.module === module,
      );
      if (newActive) setActive(newActive);
    },
    [list, setActive],
  );

  const value = useMemo(
    () => ({
      isPending,
      nodeOperator: active,
      activeModule: active?.module,
      switchNodeOperator,
    }),
    [active, isPending, switchNodeOperator],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
```

- [ ] **Step 3: Fix `switchNodeOperator` call sites**

Run:

```bash
grep -rn "switchNodeOperator" features shared modules --include="*.ts" --include="*.tsx"
```

Update each call (e.g. `shared/node-operator/switch-modal/use-switch-modal.tsx`) to pass the operator's `module` alongside its id. The switch UI is out of scope to redesign, but the call signature must compile — the switch list items are `ModuleNodeOperator`, so pass `item.module`.

- [ ] **Step 4: Typecheck + lint + unit**

Run: `yarn types && yarn lint && yarn test:unit`
Expected: all clean (UI still single-module via static `useSmSDK`).

- [ ] **Step 5: Manual smoke**

Run: `yarn dev`. Connect a wallet that owns operators in the deploy's module. Confirm the dashboard still resolves the operator and nothing regressed. (Cross-module discovery is wired but `useSmSDK()` is still static, so feature data reads remain single-module until Phase 2.)

- [ ] **Step 6: Commit**

```bash
git add modules/web3/operator-provider/node-operator-provider.tsx features shared
git commit -m "feat: expose activeModule from node-operator context"
```

---

## Phase 2 — Reactive module

Goal: flip the app from `config.module` to the active operator's module. After this phase, an active CM operator makes the whole UI behave as CM and vice-versa; no active operator → `undefined` → unified.

### Task 2.1: `useModule()` + flip `useSmSDK` to the active module

To avoid a circular import (web3-provider → operator-provider), `useSmSDK` moves into operator-provider where it can read the active module.

**Files:**

- Create: `modules/web3/operator-provider/use-module.ts`
- Create: `modules/web3/operator-provider/use-sm-sdk.ts`
- Modify: `modules/web3/web3-provider/lido-sdk.tsx` (drop `useSmSDK`, keep `useSmSDKByModule` + `useLidoSDK`)
- Modify: `modules/web3/web3-provider/index.ts`, `modules/web3/operator-provider/index.ts`

- [ ] **Step 1: Add `useModule()`**

`modules/web3/operator-provider/use-module.ts`:

```ts
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from './node-operator-provider';

export const useModule = () => {
  const { activeModule } = useNodeOperator();
  return {
    module: activeModule,
    isCSM: activeModule === MODULE_NAME.CSM,
    isCM: activeModule === MODULE_NAME.CM,
  };
};
```

- [ ] **Step 2: Move `useSmSDK` into operator-provider, sourced from active module**

`modules/web3/operator-provider/use-sm-sdk.ts`:

```ts
import { LidoSDKCm, LidoSDKCsm, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useLidoSDK, useSmSDKByModule } from '../web3-provider';
import { useModule } from './use-module';

export function useSmSDK(): LidoSDKCsm | LidoSDKCm;
export function useSmSDK(module: MODULE_NAME.CSM): LidoSDKCsm | undefined;
export function useSmSDK(module: MODULE_NAME.CM): LidoSDKCm | undefined;
// eslint-disable-next-line func-style
export function useSmSDK(module?: MODULE_NAME) {
  const { csm, cm } = useLidoSDK();
  const { module: active } = useModule();
  if (module) {
    if (module !== active) return undefined;
    return module === MODULE_NAME.CSM ? csm : cm;
  }
  // no active operator: default to CSM SDK so discovery/short-info reads
  // (which pass explicit module) and pre-operator reads still resolve a client.
  return active === MODULE_NAME.CM ? cm : csm;
}
```

(`useSmSDKByModule` stays in `lido-sdk.tsx`. Discovery and `use-operator-short-info` already pass an explicit module, so they don't depend on `active`.)

- [ ] **Step 3: Remove `useSmSDK` from `lido-sdk.tsx` and fix barrels**

In `lido-sdk.tsx` delete the `useSmSDK` overloads/impl (keep `useSmSDKByModule`, `useLidoSDK`, `LidoSDKProvider`). Update:

- `modules/web3/web3-provider/index.ts`: export `useLidoSDK, useSmSDKByModule` (drop `useSmSDK`).
- `modules/web3/operator-provider/index.ts`: add `export * from './use-module'; export * from './use-sm-sdk';`.

Then fix internal imports of `useSmSDK` that pointed at `../web3-provider` (e.g. `use-operator-info.ts`, `use-operator-short-info.ts`, `use-invalidate-operator-cache.ts`) to import from the operator-provider barrel or `modules/web3`. Top-level `modules/web3/index` re-exports both, so `from 'modules/web3'` consumers are unaffected.

Run:

```bash
grep -rn "from '../web3-provider'" modules/web3 | grep useSmSDK
grep -rn "useSmSDK" modules/web3/web3-provider
```

Expected after fixes: no `useSmSDK` left importing from `web3-provider`.

- [ ] **Step 4: Typecheck + lint**

Run: `yarn types && yarn lint`
Expected: clean. Resolve any remaining import errors from the move.

- [ ] **Step 5: Commit**

```bash
git add modules/web3
git commit -m "feat: make useSmSDK and useModule track the active operator's module"
```

### Task 2.2: Reactive show-rules

**Files:**

- Modify: `shared/hooks/use-show-rule.ts`

- [ ] **Step 1: Source module from the active operator**

In `useShowFlags`, replace the `useConfig().config.module` read (lines 91-93) with the active module:

```ts
import { useModule } from 'modules/web3';
// ...
const { module } = useModule();
```

The rest of the object (lines 95-138) is unchanged — `IS_CSM`/`IS_CM`/`ICS_APPLY_ENABLED`/`IS_SURVEYS_ACTIVE` now react to the active operator. When `module` is `undefined`, all four are false (unified).

- [ ] **Step 2: Make `useFilterShowRules` reactive**

Replace the static `config.module` filter (line 162):

```ts
export const useFilterShowRules = <T extends ShowRuleProps>(items: T[]) => {
  const check = useShowRule();
  const { module: activeModule } = useModule();

  return useMemo(
    () =>
      items
        .filter(({ module }) => !module || module === activeModule)
        .filter(
          ({ showRules }) =>
            !showRules?.length ||
            showRules.some((rule) =>
              Array.isArray(rule) ? rule.every(check) : check(rule),
            ),
        ),
    [check, items, activeModule],
  );
};
```

Remove the now-unused `config` import if nothing else needs it.

- [ ] **Step 3: Typecheck + lint**

Run: `yarn types && yarn lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add shared/hooks/use-show-rule.ts
git commit -m "feat: drive show-rules from the active operator's module"
```

### Task 2.3: Module-qualify operator-scoped query keys

With both SDKs live and `useSmSDK()` switching, operator-scoped keys must include module or id `5` collides across modules.

**Files:**

- Modify: `modules/web3/hooks/use-operator-info.ts` and sibling operator-scoped query hooks (`use-operator-short-info.ts` already done in 1.4)

- [ ] **Step 1: Inventory operator-scoped query keys**

Run:

```bash
grep -rn "queryKey:" modules/web3 features --include="*.ts" --include="*.tsx" | grep "nodeOperatorId"
```

Expected: a list of hooks keying on `{ nodeOperatorId }`.

- [ ] **Step 2: Add module to each key**

For each, read the active module and add it to the key. Pattern for `use-operator-info.ts`:

```ts
import { useModule } from 'modules/web3';
// ...
const { operator } = useSmSDK();
const { module } = useModule();
// ...
queryKey: [...KEY_OPERATOR_INFO, { nodeOperatorId, module }],
```

Apply the same `{ ..., module }` addition to every hook found in Step 1.

- [ ] **Step 3: Update invalidation predicate if needed**

`use-invalidate-operator-cache.ts` matches on the presence of `nodeOperatorId`/`address` keys (not values), so adding `module` to keys does not break it — verify by reading it. No change expected.

- [ ] **Step 4: Typecheck + lint**

Run: `yarn types && yarn lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add modules/web3 features
git commit -m "fix: module-qualify operator-scoped react-query keys"
```

### Task 2.4: Render-path sweep — const reads → `useModule()`

The ~97 `isModuleCSM`/`isModuleCM`/`moduleMeta` reads in render code become hook reads. This is mechanical; enumerate against the live codebase and migrate in directory-sized batches, each gated by typecheck.

**Files:** primarily `features/**`, plus `faq/index.ts`, `shared/hooks/use-external-links.ts`, dashboard/keys/bond/monitoring components.

- [ ] **Step 1: Generate the inventory**

Run:

```bash
grep -rn "isModuleCSM\|isModuleCM\|moduleMeta\b" features shared faq consts --include="*.ts" --include="*.tsx" \
  | grep -v "consts/module.ts" | sort > /tmp/module-sweep.txt
wc -l /tmp/module-sweep.txt && cat /tmp/module-sweep.txt
```

Expected: the full call-site list. Classify each line as **render-path** (inside a component/hook) or **static** (top-level module scope, non-React). Static reads in `features/`/`shared/` are rare; flag any for manual handling.

- [ ] **Step 2: Migrate one directory at a time**

For each directory batch (e.g. `features/dashboard`, then `features/keys`, …), apply the mechanical transform inside components/hooks:

```ts
// remove: import { isModuleCSM, isModuleCM } from 'consts';
// add inside the component/hook body:
import { useModule } from 'modules/web3';
const { isCSM, isCM } = useModule();
// replace isModuleCSM → isCSM, isModuleCM → isCM
```

For `moduleMeta` reads that are operator-module-specific copy, replace with `MODULE_METADATA[module]` guarded on `module` being defined (unified copy when `undefined`). For `faq/index.ts`, convert the FAQ builder that branches on module into a hook (or pass `module` from the calling component) — it renders per active operator.

- [ ] **Step 3: Typecheck after each batch**

Run: `yarn types`
Expected: clean before moving to the next directory. Fix any `undefined`-module `else` paths surfaced by the type checker (every `isCSM`/`isCM` branch now needs a defined unified fallback).

- [ ] **Step 4: Lint fix and commit per batch**

```bash
yarn lint:fix
git add <directory>
git commit -m "refactor: read active module via useModule in <directory>"
```

Repeat Steps 2-4 until `/tmp/module-sweep.txt` is exhausted (re-run the Step 1 grep; expected: only `consts/module.ts` self-references remain, plus deliberately-static reads handled in Phase 3).

### Task 2.5: Nullable-module routing (gate on resolution)

**Files:**

- Modify: `shared/navigate/gates/gate.tsx`
- Modify: any page/screen that assumed a module before the operator resolves

- [ ] **Step 1: Read the current Gate and operator-pending state**

Run:

```bash
cat shared/navigate/gates/gate.tsx
grep -rn "isPending" modules/web3/operator-provider/node-operator-provider.tsx
```

Confirm `isPending` from `useNodeOperator()` reflects discovery-in-flight.

- [ ] **Step 2: Hold module-gated routes until resolution**

In `Gate` (and module-gated pages), when `isPending` is true, render the unified loading shell rather than evaluating `IS_CSM`/`IS_CM` (which are false pre-resolution and would mis-redirect). Pattern:

```ts
const { isPending } = useNodeOperator();
if (isPending) return <UnifiedLoading />; // same shell as no-operator
// then existing rule checks
```

Use the existing loading component the app already shows during operator fetch; do not invent a new one.

- [ ] **Step 3: Typecheck + lint + manual**

Run: `yarn types && yarn lint`, then `yarn dev`. With a CM-owning wallet, navigate directly to `/type/*` (CSM-only): expect redirect home, no CSM flash. With no operators: expect the unified shell, no module-specific chrome.

- [ ] **Step 4: Commit**

```bash
git add shared/navigate
git commit -m "fix: gate module-specific routes on operator resolution"
```

---

## Phase 3 — Unified UI + verification

Goal: unified branding, the header module badge, the unified no-operator shell, and a parity audit.

### Task 3.1: Header module badge next to operator-id

**Files:**

- Create: `shared/node-operator/module-badge/module-badge.tsx` (+ `index.ts`)
- Modify: the header/operator area around `shared/node-operator/switch-operator-button/switch-operator-button.tsx`

- [ ] **Step 1: Build the badge**

`module-badge.tsx` — renders `MODULE_METADATA[module].shortName` only when a module is active:

```ts
import { FC } from 'react';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA } from 'consts';

export const ModuleBadge: FC<{ module: MODULE_NAME | undefined }> = ({
  module,
}) => {
  if (!module) return null;
  return <Badge>{MODULE_METADATA[module].shortName}</Badge>;
};
```

(Use the project's existing badge/pill styled-component or a small styled `span` consistent with the header; match `switch-operator-button` styling.)

- [ ] **Step 2: Render it beside the operator id**

In the operator header area, read `const { activeModule } = useNodeOperator()` and render `<ModuleBadge module={activeModule} />` next to the operator id.

- [ ] **Step 3: Typecheck + lint + visual**

Run: `yarn types && yarn lint`, then `yarn dev`. Confirm the badge shows `CSM`/`CM` matching the active operator and disappears when none.

- [ ] **Step 4: Commit**

```bash
git add shared/node-operator
git commit -m "feat: show active module badge next to operator id"
```

### Task 3.2: Unified branding + no-operator shell

**Files:**

- Modify: `pages/_app.tsx:47` (title), `shared/layout/navigation/navigation.tsx:40` (nav title)
- Modify: `consts/module.ts` (widget-level brand), `consts/matomo-click-events.ts`, `scripts/build-dynamics.mjs`, manifests
- Modify: the no-operator screens to a unified shell (designed from CSM's current no-operator behaviour)

- [ ] **Step 1: Apply the unified brand name**

> **BLOCKED ON:** the unified brand name (open question in the spec). Once provided, set a single `WIDGET_TITLE` constant and use it in `_app.tsx` and `navigation.tsx`. Collapse `MODULE_METADATA[...].title/host/previewFile` widget-level usages to the unified brand; keep `shortName` for the badge.

- [ ] **Step 2: Unify manifest + matomo**

Collapse `scripts/build-dynamics.mjs` per-module manifest copy to a single manifest. Set a single matomo app name in `consts/matomo-click-events.ts` (remove the `config.module` branch).

- [ ] **Step 3: Unify the no-operator shell**

Make the connected-but-no-operator state render one module-agnostic shell, sourced from today's CSM no-operator screen. The create CTA stays as-is (out of scope). Ensure neither `IS_CSM` nor `IS_CM` is required to render it.

- [ ] **Step 4: Carry both modules in server metrics**

In `utilsApi/contractAddressesMetricsMap.ts:68`, include both modules' contract addresses (remove the single-module branch).

- [ ] **Step 5: Typecheck + lint + visual**

Run: `yarn types && yarn lint`, then `yarn dev`. Verify unified title, unified no-operator shell, and that an active operator still shows module-specific UI.

- [ ] **Step 6: Commit**

```bash
git add pages consts scripts utilsApi public shared features
git commit -m "feat: unify widget branding and no-operator shell"
```

### Task 3.3: Verification — parity audit + e2e

- [ ] **Step 1: Run the parity reviewer over the full diff**

Dispatch the `csm-cm-parity-reviewer` agent against the branch diff (`git diff main...HEAD`). Address any asymmetric `isCSM`/`isCM` branch with a missing unified `else`.

- [ ] **Step 2: Run the form-architecture reviewer over touched forms**

Dispatch `form-architecture-reviewer` over any `features/*/*-form/` touched by the sweep.

- [ ] **Step 3: Add a dual-module e2e scenario**

In `tests/`, add a scenario where the connected wallet owns operators in **both** modules: assert discovery lists both, switching the active operator flips the module badge and the module-specific UI (e.g. CM "Stake & Keys" vs CSM "Keys"). Follow the existing Playwright patterns in `tests/widget/`.

- [ ] **Step 4: Full gate**

Run: `yarn types && yarn lint && yarn test:unit && yarn test:e2e`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add tests
git commit -m "test: add dual-module discovery e2e scenario"
```

---

## Self-review notes

- **Spec coverage:** identity `(module,id)` → 1.2/1.4; dual SDK → 1.1; discovery both → 1.3; operator-context owns module → 1.5/2.1; `useModule()` nullable → 2.1; migration buckets → 2.4 (render) / 3.2 (branding, metrics) / 0.1 (pure helper); show-rules+routing → 2.2/2.5; query keys → 2.3; UI states+badge → 2.5/3.1/3.2; verification → 3.3.
- **Known unknowns resolved by spike:** `core.moduleId`/`moduleName` on a shared core (Task 1.0) gates the dual-SDK strategy; `useLocalStorage` object serialization (Task 1.4 Step 1) must be verified for bigint round-trip.
- **Out of scope (unchanged):** creating operators; switching-operator UX (only the call signature is updated in 1.5).

---

## Dropping `MODULE` env / `config.module` (follow-up)

Goal: remove the deploy-time `MODULE` env entirely. `process.env.MODULE` → `config.module`
is a single chain, so "drop MODULE" = "remove every `config.module` read".

**MVP decisions (2026-06-21):**

- **`/create` is the CSM path only** (direct, no module picker / route param / gate
  selection this iteration). So every deploy-module fallback in a pre-operator / no-operator
  code path becomes a literal `MODULE_NAME.CSM` — no behavior change vs today's CSM deploy
  (`config.module` already defaulted to `csm`).
- Unified widget = CSM-primary for branding/links/analytics until CM is released.

**Done (Steps 0–2):**

- Removed dead `sm` field from `LidoSDKContext` (`lido-sdk.tsx`).
- `matomo-click-events.ts`: single app identity (`CSM_Widget` / `csm_widget`).
- `external-links.ts`: `landing`/`feedbackForm` pinned to CSM links; dropped `isModuleCSM/CM`.
- `use-operator-short-info.ts`, `use-other-module.ts`, `useSmSDK()` no-arg fallback
  (`lido-sdk.tsx:92`): `?? config.module` → `MODULE_NAME.CSM`.

**Remaining `config.module` reads (Step 3 — needs unified pre-operator UI):**

- `consts/module.ts` — `moduleMeta`, `isModuleCSM`, `isModuleCM` (+ ~27 consumers across
  `welcome*`, `/create` chain, `starter-pack`, `accept-invite`). Keep `MODULE_METADATA.shortName`
  (badge) + `WIDGET_TITLE/DESCRIPTION`.
- `shared/components/welcome-section/{welcome-section.tsx,styles.ts}` — `DESCRIPTIONS`/`LOGOS`.
- TODO(unified): make `useSmSDK()` no-arg `undefined`-aware (spec: no silent CSM).

**Step 4 — delete plumbing** once Step 3 lands: `next.config.mjs` (`moduleMode`,
`publicRuntimeConfig.module`), runtime-config type in `global.d.ts`, `config` `module` export,
`.env.example:19` (`MODULE=csm`).
