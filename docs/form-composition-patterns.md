# Form Composition Patterns in Features

This document describes the standardized form composition patterns used throughout the `features/` directory in the Lido CSM application.

## Overview

Forms in the codebase follow a consistent architectural pattern that promotes reusability, maintainability, and type safety. Each form is composed of several layers that work together to handle state management, validation, data fetching, and user interactions.

## Core Architecture Pattern

### 1. Form Provider Layer

Each form has a dedicated provider component that wraps the entire form logic:

```
features/{feature-name}/{form-name}/
├── context/
│   ├── {form-name}-provider.tsx     # Main provider component
│   ├── types.ts                     # TypeScript interfaces
│   ├── use-{form-name}-network-data.tsx  # Data fetching hook
│   ├── use-{form-name}-submit.ts    # Submit logic hook
│   ├── use-{form-name}-validation.ts # Validation logic hook
│   └── use-get-default-values.ts    # Default values hook
└── {form-name}.tsx                  # Main form component
```

### 2. Form Component Structure

All forms follow this consistent component hierarchy:

```tsx
export const ExampleForm: FC = memo(() => {
  return (
    <ExampleFormProvider>
      {' '}
      {/* Context Provider */}
      <FormBlock>
        {' '}
        {/* Shared layout component */}
        <BaseFormLoader>
          {' '}
          {/* Loading wrapper */}
          <FormControllerStyled>
            {' '}
            {/* Form controller */}
            <Control1 /> {/* Form controls */}
            <Control2 />
            <SubmitButton />
          </FormControllerStyled>
          <ExampleFormInfo /> {/* Additional info display */}
        </BaseFormLoader>
      </FormBlock>
      {/* Optional additional components */}
    </ExampleFormProvider>
  );
});
```

## Provider Pattern Implementation

### Context Provider Structure

Each form provider follows this pattern:

```tsx
export const ExampleFormProvider: FC<PropsWithChildren> = ({ children }) => {
  // 1. Fetch network data
  const [networkData, revalidate] = useExampleFormNetworkData();

  // 2. Setup validation
  const validationResolver = useExampleValidation(networkData);

  // 3. Get default values
  const asyncDefaultValues = useGetDefaultValues(networkData);

  // 4. Initialize React Hook Form
  const formObject = useForm<ExampleFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  // 5. Setup submit handler
  const { submitAction } = useExampleSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  // 6. Create context values
  const formControllerValue = useMemo(
    () => ({
      onSubmit: submitAction,
      retryEvent,
    }),
    [submitAction, retryEvent],
  );

  // 7. Provide contexts
  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
```

### Type Definitions Pattern

Each form defines two main types:

```tsx
// Input type - represents form field values
export type ExampleFormInputType = {
  field1: string;
  field2?: bigint;
  field3: SomeEnum;
};

// Network data type - represents external data needed by the form
export type ExampleFormNetworkData = {
  balance?: bigint;
  nodeOperatorId?: NodeOperatorId;
  loading: LoadingRecord<'balance' | 'nodeOperatorId'>;
};
```

## Controls Pattern

### Form Controls Structure

Form controls are organized in a `controls/` directory:

```
controls/
├── amount-input.tsx      # Reusable amount input
├── submit-button.tsx     # Submit button with state handling
├── token-select.tsx      # Token selection dropdown
└── info.tsx             # Information display component
```

### Control Implementation Pattern

Controls follow this pattern:

```tsx
export const ExampleControl = () => {
  // Access form data through context
  const { someNetworkData } = useExampleFormData();

  // Use shared form components
  return (
    <SomeSharedFormComponent name="fieldName" networkData={someNetworkData} />
  );
};
```

## Hooks Pattern

### Custom Hooks Organization

Forms use several types of custom hooks:

1. **Data Fetching Hooks** (`use-{form-name}-network-data.tsx`)

   - Fetch external data needed by the form
   - Return data and revalidation function
   - Handle loading states

2. **Validation Hooks** (`use-{form-name}-validation.ts`)

   - Create validation resolver for React Hook Form
   - Use network data to determine validation rules
   - Return resolver function

3. **Submit Hooks** (`use-{form-name}-submit.ts`)

   - Handle form submission logic
   - Manage transaction modal stages
   - Execute blockchain transactions

4. **Utility Hooks**
   - `use-get-default-values.ts` - Compute initial form values
   - `use-form-revalidate.ts` - Handle form revalidation
   - `use-max-value.ts` - Calculate maximum allowed values

## Modal Integration Pattern

### Transaction Modal Stages

Forms integrate with transaction modals using a consistent pattern:

```tsx
const useTxModalStages = () => {
  return useMemo(
    () => [
      {
        sign: {
          title: 'Sign transaction',
          description: 'Please sign the transaction...',
        },
        pending: {
          title: 'Transaction pending',
          description: 'Waiting for confirmation...',
        },
        success: {
          title: 'Success',
          description: 'Transaction completed successfully',
        },
      },
    ],
    [],
  );
};
```

## Loading States Pattern

### BaseFormLoader Component

Forms use a shared loading wrapper:

```tsx
<BaseFormLoader>
  {/* Form content only renders when data is loaded */}
</BaseFormLoader>
```

This component:

- Shows loading spinner while data fetches
- Prevents form interaction during loading
- Handles error states gracefully

## Validation Pattern

### Validation Integration

Forms use a unified validation approach:

```tsx
const useExampleValidation = (networkData: ExampleFormNetworkData) => {
  return useMemo(() => {
    return zodResolver(
      z.object({
        amount: z
          .bigint()
          .min(1n, 'Amount must be greater than 0')
          .max(networkData.maxAmount || 0n, 'Insufficient balance'),
      }),
    );
  }, [networkData]);
};
```

## Info Components Pattern

### Form Information Display

Each form includes an info component that displays:

- Current form state
- Calculated values
- Important warnings or notices
- Transaction estimates

```tsx
export const ExampleFormInfo = () => {
  const { formData } = useExampleFormData();

  return (
    <InfoBox>
      <InfoItem label="Current Balance" value={formatEther(formData.balance)} />
      <InfoItem label="Transaction Fee" value={formatEther(formData.fee)} />
    </InfoBox>
  );
};
```

## Examples by Feature

### Simple Forms

- `add-bond-form` - Basic amount input with token selection
- `unlock-bond-form` - Amount input with balance validation

### Complex Forms

- `submit-keys-form` - Multiple inputs, custom addresses, referrer logic
- `add-keys-form` - Keys input, amount calculation, deposit queue display

### Specialized Forms

- `change-role-form` - Address input with role-specific validation
- `eject-keys-form` - Key selection with confirmation modals

## Best Practices

1. **Consistent Naming**: Follow the `{feature-name}-form` pattern
2. **Provider Composition**: Always wrap forms in their dedicated provider
3. **Type Safety**: Define strong types for inputs and network data
4. **Loading States**: Use BaseFormLoader for consistent loading UX
5. **Validation**: Implement validation hooks with network data dependency
6. **Error Handling**: Use shared error handling patterns
7. **Transaction Integration**: Follow the modal stages pattern for blockchain interactions
8. **Code Reuse**: Extract common controls into shared components

## Shared Components Used

- `FormBlock` - Layout wrapper for forms
- `FormControllerStyled` - Styled form controller
- `BaseFormLoader` - Loading state wrapper
- `SubmitButtonHookForm` - Standardized submit button
- `PausedButton` - Button for paused states
- Various input controls from `shared/hook-form/controls`

This pattern ensures consistency, maintainability, and type safety across all forms in the application while providing flexibility for feature-specific requirements.
