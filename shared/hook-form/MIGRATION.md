# Migrating Old-Style Forms to the Flow Pattern

Guide for upgrading forms that still use the manual `TransactionCallback` switch + `useTransactionModalStage` pattern.

## Forms to migrate

| Form                                         | Complexity | Side effects                                         |
| -------------------------------------------- | ---------- | ---------------------------------------------------- |
| `claim-bond`                                 | Low        | None                                                 |
| `accept-invite`                              | Medium     | `appendNO`, navigation                               |
| `add-keys`                                   | High       | `addCachePubkeys`/`removeCachePubkeys`, navigation   |
| `create-node-operator/curated-operator-form` | High       | `appendNO`, `setOperatorCustomAddresses`, navigation |
| `create-node-operator/submit-keys-form`      | Highest    | Cache, `appendNO`, custom addresses, 2 SDK paths     |

## What changes

### Before (old pattern)

```
features/{form}/
├── context/
│   ├── use-{form}-submit.ts        ← Manual callback switch, SDK call, try/catch
│   └── ...
└── hooks/
    └── use-tx-modal-stages-{form}.tsx  ← useTransactionModalStage + custom Props type
```

**Submit hook** — 60-100 lines of manual wiring:

```ts
export const useMySubmit: FormSubmitterHook<F, C> = () => {
  const { txModalStages } = useTxModalStagesMyForm();
  const sdk = useSmSDK();

  return useCallback(
    async (input, data, { onConfirm, onRetry }) => {
      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(props);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(props, payload.hash);
              break;
            // ... 5+ more cases
          }
        };
        await sdk.method({ ...params, callback });
        await onConfirm?.();
        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [sdk, txModalStages],
  );
};
```

**Stages hook** — custom Props type, `useTransactionModalStage`:

```tsx
type Props = { amount: bigint; token: TOKENS };

const getStages = (transitStage: TransactionModalTransitStage) => ({
  ...getGeneralTransactionModalStages(transitStage),
  sign: (props: Props) => transitStage(<TxStageSign {...} />),
  pending: (props: Props, txHash?: string) => transitStage(<TxStagePending {...} />),
  success: (result: SuccessProps, txHash?: string) => transitStage(<TxStageSuccess {...} />),
});

export const useTxModalStagesMyForm = () =>
  useTransactionModalStage(getStages);
```

### After (flow pattern)

```
features/{form}/
├── context/
│   ├── use-{form}-flow.ts          ← Flow type + resolver (logic)
│   └── ...                          ← NO submit hook needed
└── hooks/
    └── use-tx-modal-stages-{form}.tsx  ← useTransitStage + buildTxCallback factory (UI)
```

## Step-by-step migration

### Step 1: Define the flow type

Create `context/use-{form}-flow.ts`. Model every possible state as a discriminated union:

```ts
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';

export type MyFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'no-data' }
  | ({ action: 'submit' } & Executable);
```

Rules:

- One variant per distinct user action
- Non-interactive states: `{ action: 'name' }` (optionally with metadata like `access`)
- Interactive states: `{ action: 'name' } & Executable`
- `Executable` has:
  - `submit: (onRetry: () => void) => Promise<unknown>` — SDK call + callback
  - `confirm?: () => Promise<boolean>` — pre-submit modal, return `false` to abort
  - `onError?: () => void` — rollback on submit failure (cache cleanup, etc.)

### Step 2: Refactor the stages hook

Change `use-tx-modal-stages-{form}.tsx` to return a **callback factory**:

```tsx
import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';

export const useTxModalStagesMyForm = (): ((
  input: MyFormInputType,
  data: MyFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<MyResult>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (input: MyFormInputType, data: MyFormNetworkData, onRetry: () => void) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () => transitStage(<TxStageSign title="..." />),
            pending: (txHash) =>
              transitStage(<TxStagePending title="..." txHash={txHash} />),
            success: (result: MyResult, txHash) =>
              transitStage(<TxStageSuccess txHash={txHash} />, {
                isClosableOnLedger: true,
              }),
          },
          onRetry,
        ),
    [transitStage],
  );
};
```

Key changes from old pattern:

- `useTransactionModalStage` → `useTransitStage` (direct access to `transitStage`)
- Stage handlers: `sign: (props: Props) =>` → `sign: () =>` (closure over `input`/`data`)
- Returns `(input, data, onRetry) => TransactionCallback` instead of `{ txModalStages }`
- `getGeneralTransactionModalStages(transitStage)` spread unchanged

### Step 3: Write the flow resolver

The resolver replaces the submit hook. It determines what action is available and how to execute it:

```ts
export const useMyFlowResolver = (): FlowResolver<
  MyFormInputType,
  MyFormNetworkData,
  MyFlow
> => {
  const sdk = useSmSDK();
  const [canSubmit, access] = useCanPerform(sdk.module, 'method');
  const buildCallback = useTxModalStagesMyForm();

  return useCallback(
    (input, data) => {
      // Gate: permission check
      if (!canSubmit) return { action: 'no-access', access };

      // Gate: data availability
      if (!data.requiredField) return { action: 'no-data' };

      // Executable action
      return {
        action: 'submit' as const,
        submit: (onRetry) =>
          sdk.module.method({
            ...params,
            callback: buildCallback(input, data, onRetry),
          }),
      };
    },
    [sdk, canSubmit, access, buildCallback],
  );
};
```

### Step 4: Add the convenience hook

For UI components that need to check `flow.action`:

```ts
export const useMyFlow = (): MyFlow => {
  const resolve = useMyFlowResolver();
  const data = useMyFormData(true);
  return resolve({} as MyFormInputType, data);
};
```

### Step 5: Update the form provider

Replace submit hook wiring with `useFlowSubmit`:

```tsx
// BEFORE
import { useMySubmit } from './use-my-submit';
const submitter = useMySubmit();

// AFTER
import { useFlowSubmit } from 'shared/hook-form/form-controller';
import { useMyFlowResolver } from './use-my-flow';
const submitter = useFlowSubmit(useMyFlowResolver());
```

### Step 6: Delete the old submit hook

Remove `context/use-{form}-submit.ts` and its export from `context/index.ts`.

### Step 7: Update form loader / gates

Replace boolean checks with flow action checks:

```tsx
// BEFORE
const { HAS_MANAGER_ROLE } = useShowFlags();
const isView = !data.bond || !HAS_MANAGER_ROLE;

// AFTER
const flow = useMyFlow();
const isReadOnly = flow.action === 'no-access' || flow.action === 'no-data';
```

---

## Permission gating with `useCanPerform`

Use `useCanPerform` from `shared/hooks` to check SDK method-level access. It calls `getMethodAccess` + `hasMethodAccess` on the SDK module, taking the connected wallet and operator info into account:

```ts
import { useCanPerform } from 'shared/hooks';

const [canSubmit, access] = useCanPerform(sdk.bond, 'addBond');
// canSubmit: boolean — whether the current wallet can call this method
// access: MethodAccess — access level metadata (for UI: NoAccessNotice)

if (!canSubmit) return { action: 'no-access', access };
```

When `action === 'no-access'`, render `<NoAccessNotice access={flow.access} />` from `shared/components/no-access-notice`.

## Handling side effects

### Rollback on error — use `Executable.onError`

For forms that need cleanup when submit fails (e.g., cache rollback), use the `onError` callback on the flow object:

```ts
return {
  action: 'add-keys' as const,
  submit: async (onRetry) => {
    addCachePubkeys(pubkeys); // optimistic cache update
    await sdk.keys.addKeys({ callback: buildCallback(input, data, onRetry) });
  },
  onError: () => removeCachePubkeys(pubkeys), // rollback
};
```

`useFlowSubmit` calls `flow.onError?.()` in its catch block before `handleTxError`. No try/catch needed inside `submit`.

### Post-submit side effects (cache update, navigation)

Put them inside `submit`, after the SDK call resolves:

```ts
submit: async (onRetry) => {
  const { result } = await sdk.method({ callback: buildCallback(input, data, onRetry) });
  if (result) appendNO(result);     // after SDK resolves, before onConfirm
},
```

`useFlowSubmit` calls `onConfirm()` (data revalidation) after submit resolves.

For navigation AFTER revalidation, wire manually in the provider:

```ts
const resolve = useMyFlowResolver();

const submitter = useCallback(
  async (input, data, { onConfirm, onRetry }) => {
    const flow = resolve(input, data);
    if (!isExecutable(flow)) return false;
    try {
      await flow.submit(onRetry);
      await onConfirm?.();
      navigate(PATH.HOME); // after revalidation
      return true;
    } catch (error) {
      flow.onError?.();
      return handleTxError(error);
    }
  },
  [resolve],
);
```

### Confirmation modals

Use `Executable.confirm`:

```ts
return {
  action: 'submit' as const,
  confirm: async () => {
    if (needsWarning && !(await showWarningModal({}))) return false;
    return confirmSubmitModal({});
  },
  submit: (onRetry) =>
    sdk.method({ callback: buildCallback(input, data, onRetry) }),
};
```

`useFlowSubmit` calls `confirm()` before `submit()`. Return `false` to abort.

---

## Checklist

- [ ] Flow type covers all states (no-access, no-data, paused, each action)
- [ ] Permission checks use `useCanPerform(sdk.module, 'methodName')`
- [ ] Non-executable states carry `access: MethodAccess` for `<NoAccessNotice />`
- [ ] Stages hook uses `useTransitStage` + `buildTxCallback`, returns factory
- [ ] Flow resolver imports `buildCallback` from stages hook
- [ ] `submit: (onRetry) =>` builds callback via `buildCallback(input, data, onRetry)`
- [ ] Rollback logic uses `onError` callback, not try/catch inside submit
- [ ] Provider uses `useFlowSubmit(useResolver())` or manual pattern for navigation
- [ ] Old submit hook deleted, export removed from `context/index.ts`
- [ ] Form loader / gate components use `flow.action` instead of boolean flags
- [ ] `yarn types` passes
- [ ] `yarn lint` passes
