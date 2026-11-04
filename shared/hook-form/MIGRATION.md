# Migrating a legacy form to the app-ui kit

For the forms still on lido-ui: ICS apply, IDVTC apply, surveys, the DKG files page and IDVTC members. The flow layer (`context/*`, resolver, stages) doesn't change; only the render tree, the controls and the e2e locators move.

## Steps

1. **Opt in.** Wrap the form root in `AppFormUi` (outermost, above the data provider).
2. **Tree.** Replace `FormBlock` + `FormLoader` / `WhenLoaded` + `*FormLoader` with `FormPage > FormReady > XFormGate > Form`. Move the e2e testid from `FormBlock` to `<Form>`. If e2e waits on it in a gate state, also put it on the gate's wrapper.
3. **Gate.** Rename `*-form-loader.tsx` to `*-form-gate.tsx`. Non-executable actions render `NoAccessNotice` / `PausedNotice` from `shared/form-page`, and the gate never renders `<form>`. Delete the read-only `Info` panels; if they showed data the form still needs, move it into aside rows (A) or the card (B).
4. **Layout.** Archetype A: `FormLayout aside={<XAside />}` with `SubmitAside rows confirm`, and the page gets `Layout wide`. Archetype B: `FormCard` with the CTA inline.
5. **Controls → fields.**

   | Legacy control                                                       | Kit field                                                                                                                                                                 |
   | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `TextInputHookForm`                                                  | `TextField` (helper text → `description`)                                                                                                                                 |
   | `AddressInputHookForm`                                               | `AddressField` (`isLocked` → `locked`)                                                                                                                                    |
   | `TokenAmountInputHookForm`                                           | `AmountField` (`maxValue`, `balance`, `disabled`)                                                                                                                         |
   | `NumberInputHookForm`                                                | `TextField` with the existing string parsing (no `NumberField` yet)                                                                                                       |
   | `CheckboxHookForm`                                                   | `CheckboxField`                                                                                                                                                           |
   | `SelectHookForm`, `OptionsButtonsHookForm`, `BooleanButtonsHookForm` | no kit field yet; add one on `useFieldController` when the first consumer migrates                                                                                        |
   | `SubmitButtonHookForm`                                               | `SubmitButton` (`noDisableOnError` → `ignoreErrors`, `variant="outlined"` → `variant="outline"`, `fullwidth={false}` → `fullWidth={false}`, `size="xs"` → `size="small"`) |

6. **Confirm modals.** Add an app variant in a sibling `*-app.tsx` on `FormModalShell ui="app"`, and dispatch on `ui` in the existing modal file.
7. **Stage content.** Anything non-text inside a stage `description` or `footer` branches on `useFormUi()` and renders app-ui under `'app'`.
8. **Success.** Keep `TxStageSuccess` unless the form's success is a page state. Then render `SuccessScreen` in place of `FormReady` and pass `FormPage done`.
9. **e2e.** Update the page objects the new DOM breaks, following `tests/CLAUDE.md` (modal and tooltip roles, field error testid, option and token locators). Keep the stage copy and the button labels that e2e pins.
10. **Delete** the loader, the info panel and any feature control the fields replaced. Then delete each `shared/hook-form/controls` file that has no importer left.

## Checklist

- [ ] `AppFormUi` is the outermost wrapper
- [ ] `<Form>` renders only inside the gate, and carries the form testid
- [ ] No import from `shared/hook-form/controls`, `FormBlock`, `FormLoader` or `WhenLoaded` in the form directory
- [ ] `NoAccessNotice` / `PausedNotice` imported from `shared/form-page`
- [ ] Archetype A page has `Layout wide`
- [ ] Flow code has no `useFormUi()` branch
- [ ] Every confirm modal the form opens has an app variant
- [ ] Page objects updated; `yarn types` passes for `tests/`
- [ ] `yarn lint`, `yarn types`, `yarn test:unit` pass
- [ ] Visual check at desktop, 440px and dark
