# Forms

How forms are built: React Hook Form state, network data, a flow resolver that turns input into an action, transaction stages, and the app-ui kit that renders it all.

- Flow layer: `shared/hook-form/form-controller`, `shared/hook-form/validation`
- Fields: `shared/hook-form/fields`
- Page pieces: `shared/form-page`
- Layout ports of unpublished app-ui parts: `shared/ui`
- UI flag: `shared/hook-form/form-ui`
- Tx and confirm modals: `shared/transaction-modal`, `shared/hooks/use-confirm-modal.ts`
- Legacy controls, used only by the forms still waiting for the separate pass: `shared/hook-form/controls`

## Tree

```text
<AppFormUi>
  <XDataProvider>
    <XFormProvider>
      <FormPage notices below faq done>
        <FormReady>
          <XFormGate>
            <Form data-testid="xForm">
              <FormLayout aside={<XAside />}>   archetype A
              <FormCard>                         archetype B
```

- `AppFormUi` is outermost. It sets `ui = 'app'` for the subtree; `TransactionModal` re-provides it, and `useConfirmModal` passes `ui: 'app'` to confirm modals.
- `FormPage` is the page shell, not a `<form>`. `notices` render above the form and `below` under it, and both hide while `done`. `faq` is always last.
- `FormReady` shows a skeleton card (`formSkeleton`) while `useFormState().isLoading` is true or the data provider is pending.
- `XFormGate` reads `useXFlow()` and returns a notice for the non-executable actions (`no-access`, `paused`, empty data). Otherwise it renders its children.
- `<Form>` exists only when the form can submit. It carries the e2e form testid.

## File structure

```text
features/{feature}/{form-name}/
├── context/
│   ├── types.ts
│   ├── {form}-data-provider.tsx
│   ├── {form}-form-provider.tsx
│   ├── {form}-updater.tsx            optional
│   ├── use-{form}-default-values.ts
│   ├── use-{form}-validation.ts
│   ├── use-{form}-flow.ts
│   └── index.ts
├── hooks/use-tx-modal-stages-{form}.tsx
├── controls/
├── {form}-form.tsx
├── {form}-form-gate.tsx
└── {form}-aside.tsx                  archetype A
```

Reference implementations: `features/add-keys/add-keys/` (archetype A) and `features/change-role/claimer-form/` (archetype B).

## Data provider

```tsx
const useMyFormNetworkData: NetworkData<MyFormNetworkData> = () => {
  const ethBalanceQuery = useEthereumBalance();
  const bondQuery = useOperatorBalance({ nodeOperatorId });
  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, KEY_OPERATOR_BALANCE]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  return {
    data: {
      nodeOperatorId,
      ethBalance: ethBalanceQuery.data,
      bond: bondQuery.data,
    } as MyFormNetworkData,
    isPending: ethBalanceQuery.isPending || bondQuery.isPending,
    revalidate,
  };
};

export const useMyFormData = useFormData<MyFormNetworkData>;

export const MyDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useMyFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
```

- `isPending` is the OR of every query's `isPending`.
- `revalidate()` runs after a successful submit (`Form` passes it as `onConfirm`).
- `useMyFormData(true)` throws while pending; use it only under `FormReady`.

## Form provider

```tsx
export const MyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useMyValidation();
  const defaultValues = useMyDefaultValues();

  const formObject = useForm<MyFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useMyFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="myForm">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
```

`formName` is the Matomo form name (`csm_widget_submit_form_<snake_case formName>_start|success`). Keep it stable.

## Default values and validation

```tsx
export const useMyDefaultValues = () =>
  useFormDefaultValues<MyFormInputType, MyFormNetworkData>((data) => ({
    token: getMaxBalanceToken({ [TOKENS.eth]: data.ethBalance }),
    amount: null,
  }));

export const useMyValidation = () =>
  useFormValidation<MyFormInputType, MyFormNetworkData>(
    'amount',
    async (values, data, validate) => {
      await validate('amount', () =>
        validateEtherAmount('amount', values.amount, values.token),
      );
    },
  );
```

- The selector receives fully loaded network data.
- The first argument of `useFormValidation` is the fallback field for errors that name no field. Throw `ValidationError` for a failure; pass a deps array as the third argument when the logic closes over hook values.
- An updater component (`useWatch` + `trigger`) revalidates a field when another field changes.

## Flow

A flow resolver is a pure function from `(input, data)` to a discriminated union. Executable variants carry `Executable = { confirm?, submit, onError? }`.

```tsx
export type MyFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'paused' }
  | ({ action: 'add-bond' } & Executable);

export const useMyFlowResolver = (): FlowResolver<
  MyFormInputType,
  MyFormNetworkData,
  MyFlow
> => {
  const { bond } = useActiveOperatorSDK();
  const [canAdd, access] = useCanPerform(bond, 'addBond');
  const buildCallback = useTxModalStagesMy();
  const confirmOperator = useConfirmOperatorModal();

  return useCallback(
    (input, data) => {
      if (!canAdd) return { action: 'no-access', access };
      if (data.isPaused) return { action: 'paused' };

      return {
        action: 'add-bond' as const,
        confirm: () => confirmOperator(),
        submit: () =>
          bond.addBond({
            nodeOperatorId: data.nodeOperatorId,
            token: input.token,
            amount: input.amount ?? 0n,
            callback: buildCallback(input, data),
          }),
      };
    },
    [bond, canAdd, access, buildCallback, confirmOperator],
  );
};

export const useMyFlow = (): MyFlow => {
  const resolve = useMyFlowResolver();
  const data = useMyFormData(true);
  return resolve({} as MyFormInputType, data);
};
```

- `useFlowSubmit(resolve)` runs resolve → `confirm()` (abort on `false`) → `submit()` → `onConfirm()` (revalidate). On a throw it calls `onError?.()` and then `handleTxError`.
- `useCanPerform(sdkModule, 'method')` returns `[allowed, access]`. A `no-access` variant carries `access` for `NoAccessNotice`.
- Rollback on failure goes in `onError`, not in a try/catch inside `submit`.
- Side effects that need the tx result (`appendNO`, cache updates, `setCreated`) go inside `submit`, after the SDK call resolves.
- A single-write variant also carries `estimate: () => sdk.estimateX(props())`. Build the write props once in a `props()` helper, spread them plus `callback` in `submit`, and pass the same object to `estimate`. Pass `resolve` to `FormControllerProvider`; `<GasCostRow />` / `<GasCostList />` (`shared/form-page`) call it with the live form values and show the max-fee USD cost, or N/A on any estimate error.
- The gate reads the same union through `useMyFlow()` (resolved with empty input), so gating and submitting can't disagree.

## Transaction stages

```tsx
export const useTxModalStagesMy = () =>
  useTxStages<MyFormInputType, MyFormNetworkData>((transitStage, input) => ({
    sign: () =>
      transitStage(
        <TxStageSignOperationAmount
          operationText="Adding Bond"
          amount={input.amount ?? 0n}
          token={input.token}
        />,
      ),
    pending: (txHash) =>
      transitStage(
        <TxStageSignOperationAmount
          operationText="Adding Bond"
          amount={input.amount ?? 0n}
          token={input.token}
          isPending
          txHash={txHash}
        />,
      ),
    success: (_result, txHash) =>
      transitStage(
        <TxStageSuccess
          txHash={txHash}
          title="Bond has been added"
          description="Adding Bond operation was successful."
        />,
      ),
  }));
```

- Every stage renders through `TransactionModalContent`. Under `AppFormUi` that's app-ui `TxStatus` (testids `txStage`, `title`, `description`, `footer`).
- Content inside a stage's `description` or `footer` that isn't plain text must be ui-aware: branch on `useFormUi()` and render app-ui under `'app'`. The shared parts already do: `TxAmount`, `TxLinkEtherscan`, `AfterAddressProposed`, `AfterKeysUpload`, `WhatsNextBlock`, `SkeletonBalance`. `TxStatus` centers its message, so block content sets its own `text-align: left`.
- Stage copy is e2e-pinned. Don't reword it as part of a UI change.

## UI kit

### Archetypes

- **A, `FormLayout` + `SubmitAside`:** a card with a main column and a 340px tinted aside that holds the rows (`DataListRow`), an optional confirm checkbox and the CTA. The page passes `Layout wide`. Gate states that keep the card render `FormLayout aside={null}` without `<Form>`.
- **B, `FormCard`:** a narrow app-ui `Card` with an optional `title` / `description` / `action`. The CTA is the last child. The page keeps the default narrow layout. When a view state still submits an intent (accept, unset, cancel), `<Form>` wraps every card.

```tsx
<Form data-testid="myForm">
  <FormCard title="Specify a new address">
    <AddressField name="address" label="New address" />
    <SubmitButton disableIfClean>Set new address</SubmitButton>
  </FormCard>
</Form>
```

### Gate notices

```tsx
export const MyFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useMyFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }
  if (flow.action === 'paused') return <PausedNotice />;

  return <>{children}</>;
};
```

`NoAccessNotice` derives its copy from `access` (the role label comes from `getAccessRoleLabel`). `PausedNotice` has a `headline` (default "`<module>` is paused") and a body that `children` overrides. `NoAccessNotice` `children` replaces its whole copy.

### Fields

Every field takes `name`, reads the form through `useFormContext`, keeps the `name` attribute on its input and shows errors as `<span role="alert" data-testid="inputMessageError">`. An error shows once the field is touched, the form is submitted, the field has a value, or `showUntouched` is set.

| Field               | Value                                                | Backing                                                                                                                      |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `TextField`         | `string`                                             | app-ui `Input`                                                                                                               |
| `AddressField`      | `string` (ENS resolved)                              | app-ui `Input`; `currentAddress`, `locked`, `trailing`, `simple`, `error`                                                    |
| `AmountField`       | `bigint \| null` (wei)                               | `RichInput` + `SingleTokenSelector`; `maxValue` (Max, `maxBtn`), `balance`, `locked`, `disabled`                             |
| `PercentField`      | `bigint \| null` (basis points)                      | app-ui `Input` with `%`                                                                                                      |
| `CheckboxField`     | `boolean`                                            | app-ui `Checkbox`                                                                                                            |
| `SwitchField`       | `boolean`                                            | app-ui `Switch`; `submitOnChange`                                                                                            |
| `TokenSelectField`  | token `string`                                       | app-ui `TokenSelector`; testids `tokenSelectTrigger`, `tokenOption-<TOKEN>`                                                  |
| `OptionCardsField`  | `string`                                             | `OptionList` radiogroup (`role="radio"`, no `<input>`); `variant`, `orientation`                                             |
| `SegmentCardsField` | `string`                                             | lib `SegmentedControlCard` (`role="tab"`, `aria-selected`); options `{value,title,description,icon,tag,disabled,dataTestId}` |
| `KeyListField`      | `{ start, count }` (`range`) or `number[]` (`multi`) | app-ui `Checkbox` rows + `KeyStatusTag`                                                                                      |
| `DisclosureField`   | `boolean`                                            | `Disclosure`; stays open while a dependent field has an error                                                                |
| `DepositDataField`  | deposit data                                         | `Dropzone` + JSON/Parsed/Parameters tabs                                                                                     |

- Build a new control on `useFieldController` (`useController` + the error rule). A control without a forwarded ref wraps itself in `<div ref={useFocusableRef(field.ref, selector)}>` so RHF can focus it on error.
- A read-only amount that isn't a form value (a fee, a computed cost) is a plain `RichInput locked` with a `SingleTokenSelector`, not an `AmountField`.

### Submit button

`SubmitButton` (`shared/form-page`) shows "Connect wallet" when no wallet is active. It's disabled on form errors (unless `ignoreErrors`), on `disableIfClean && !isDirty`, on `disabled` / `disabledReason`, and while another intent submits. It also takes `variant`, `size` and `fullWidth`. An intent button (`intent="revoke"`) is `type="button"` and submits with that intent, so the form type must include `intent?: string` (`IntentFormInput`).

### Confirm modals

```tsx
export const ConfirmMyModal: ModalComponentType<ConfirmModalProps> = ({
  ui,
  open,
  onConfirm,
  onReject,
}) =>
  ui === 'app' ? (
    <ConfirmMyModalApp open={open} onConfirm={onConfirm} onReject={onReject} />
  ) : (
    <LegacyBody />
  );
```

The app variant uses `FormModalShell ui="app" open onClose={onReject} title subtitle data-testid` (pass `isClosable={false}` for a modal that must not close). Open it from the flow's `confirm` through `getUseConfirmModal(ConfirmMyModal)`.

### Success

- Default: `TxStageSuccess` in the tx modal.
- Success as form state (create, claim ICS/IDVTC): the data provider holds the success record. The flow sets it synchronously before closing the tx modal, and the form renders `SuccessScreen` in place of `FormReady`:

```tsx
<FormPage done={!!created} faq={created ? undefined : faq}>
  {created ? (
    <MySuccess created={created} />
  ) : (
    <FormReady>
      <MyFormGate>
        <Form data-testid="myForm">…</Form>
      </MyFormGate>
    </FormReady>
  )}
</FormPage>
```

## Types

```ts
type FormData<T> =
  | {
      data: Partial<T>;
      isPending: true;
      revalidate: () => Promise<void> | void;
    }
  | { data: T; isPending: false; revalidate: () => Promise<void> | void };

type NetworkData<T, P = void> = (props: P) => FormData<T>;

type FormSubmitter<F, C> = (
  form: F,
  data: C,
  options: { onConfirm?: () => Promise<void> | void; onRetry: () => void },
) => Promise<boolean>;

type FlowResolver<F, C, Flow> = (input: F, data: C) => Flow;
```

Conventions: `*FormInputType` for fields and `*FormNetworkData` for external data. Data fields that load are optional, and chain numbers are `bigint`.

## Testing

- Jest runs in node with ts-jest and no DOM. Test pure helpers, and use `renderToStaticMarkup` for render checks.
- `jest.mock` anything that pulls the SDK barrel, wagmi or `modules/web3`. Specs import concrete files, never the `shared/form-page` or `shared/hook-form/fields` barrels.
- e2e conventions for kit forms are in `tests/CLAUDE.md`.
