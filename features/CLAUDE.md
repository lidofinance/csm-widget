# Form Architecture

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
