# Form Architecture

Forms use the flow pattern described in `shared/hook-form/README.md` and render on the app-ui kit. The guide for moving a legacy form onto the kit is `shared/hook-form/MIGRATION.md`.

```text
AppFormUi                     ui = 'app' for this subtree (tx and confirm modals follow it)
└─ XDataProvider              network data: FormDataContext { data, isPending, revalidate }
   └─ XFormProvider           useForm + FormControllerProvider(useFlowSubmit(useXFlowResolver()))
      └─ FormPage             notices (above) / below / faq / done
         └─ FormReady         skeleton card while the form is loading
            └─ XFormGate      no-access / paused / empty → notice; never renders a <form>
               └─ Form data-testid="xForm"
                  └─ FormLayout aside={<XAside />}   archetype A (aside with rows + CTA)
                     or FormCard                     archetype B (narrow card, CTA inline)
```

Each form lives in `features/{feature}/{form-name}/`:

- `context/types.ts`: `*FormInputType` (form fields) and `*FormNetworkData` (chain/API data)
- `context/{form}-data-provider.tsx`: network data via React Query, exports `useXFormData`
- `context/{form}-form-provider.tsx`: `useForm` + `useFlowSubmit(useXFlowResolver())` + `FormControllerProvider formName="x"`
- `context/use-{form}-default-values.ts`: `useFormDefaultValues`
- `context/use-{form}-validation.ts`: `useFormValidation` + `ValidationError`
- `context/use-{form}-flow.ts`: `XFlow` union, `useXFlowResolver`, `useXFlow`
- `context/{form}-updater.tsx`: optional cross-field revalidation
- `hooks/use-tx-modal-stages-{form}.tsx`: `useTxStages` stage factory
- `{form}-form.tsx`: the tree above
- `{form}-form-gate.tsx`: reads `useXFlow()`, renders `NoAccessNotice` / `PausedNotice` from `shared/form-page`
- `{form}-aside.tsx`: archetype A only, `SubmitAside rows confirm` + `SubmitButton`
- `controls/`: feature compositions of kit fields

Rules:

- Fields come from `shared/hook-form/fields`. Page pieces come from `shared/form-page`, and layout ports from `shared/ui`. `shared/hook-form/controls` is legacy and serves only the forms still waiting for the separate pass (ICS/IDVTC apply, surveys); never import it in a kit form.
- `<Form>` sits inside the gate, so no `<form>` exists while loading or in a gate state. When e2e waits on the form testid in a gate state, put the same testid on the gate's wrapper too.
- Archetype A pages pass `wide` to `Layout`. Archetype B pages keep the default narrow `PageContent` (600px).
- `NoAccessNotice` and `PausedNotice` come from `shared/form-page`. The `shared/components` export of the same name is gone.
- Success stays in the tx modal (`TxStageSuccess`) by default. Forms whose success is form state (create, claim ICS/IDVTC) render `SuccessScreen` in place of `FormReady` and pass `FormPage done`.
- Flow code never branches on `useFormUi()`. Only content rendered inside the tx or confirm modal does.
- Confirm modals are app-only `*-modal-app.tsx` components on `FormModalShell ui="app"`, registered directly via `getUseConfirmModal`.
- Reference forms: `features/add-keys/add-keys/` (A) and `features/change-role/claimer-form/` (B).
