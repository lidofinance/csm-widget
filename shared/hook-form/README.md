# Form Hooks

A standardized architecture for building forms with React Hook Form, network data management, validation, and transaction handling.

## Architecture Overview

Forms follow a layered provider pattern with clear separation of concerns:

```tsx
<DataProvider>
  {' '}
  {/* Network data fetching */}
  <FormProvider>
    {' '}
    {/* React Hook Form setup */}
    <FormControllerProvider>
      {' '}
      {/* Submission handling */}
      <Form>
        {' '}
        {/* Form element with submit */}
        <FormLoader>
          {' '}
          {/* Loading state wrapper */}
          <Controls /> {/* Form inputs */}
        </FormLoader>
      </Form>
    </FormControllerProvider>
  </FormProvider>
</DataProvider>
```

## File Structure

```
features/{feature-name}/{form-name}/
├── context/
│   ├── {form-name}-data-provider.tsx     # Network data fetching
│   ├── {form-name}-provider.tsx          # Form state management
│   ├── {form-name}-updater.tsx           # Field revalidation (optional)
│   ├── types.ts                          # TypeScript types
│   ├── use-{form-name}-default-values.ts # Default values computation
│   ├── use-{form-name}-validation.ts     # Validation logic
│   └── use-{form-name}-submit.ts         # Submit logic
├── controls/                             # Form controls
│   ├── amount-input.tsx
│   └── submit-button.tsx
└── {form-name}.tsx                       # Main form component
```

## Core Concepts

### 1. Data Provider

Manages network data fetching and provides it via context:

```tsx
// *-data-provider.tsx
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';

const useMyFormNetworkData: NetworkData<MyFormNetworkData> = () => {
  const ethBalanceQuery = useEthereumBalance();
  const bondQuery = useOperatorBalance();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, bondQuery.queryKey]);
  }, [invalidate, ethBalanceQuery.queryKey, bondQuery.queryKey]);

  const isPending = ethBalanceQuery.isPending || bondQuery.isPending;

  return {
    data: {
      ethBalance: ethBalanceQuery.data,
      bond: bondQuery.data,
    },
    isPending,
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

**Key Points:**

- Returns `FormData<T>` with `data`, `isPending`, and `revalidate`
- Export typed `useFormData` hook for accessing data in controls
- `revalidate()` refreshes data after transactions

### 2. Form Provider

Sets up React Hook Form with validation and submission:

```tsx
// *-provider.tsx
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';

export const MyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useMyValidation();
  const defaultValues = useMyDefaultValues();
  const submitter = useMySubmit();

  const formObject = useForm<MyFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        <MyUpdater /> {/* Optional field revalidation */}
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
```

### 3. Default Values Hook

Computes initial form values from network data:

```tsx
// use-*-default-values.ts
import { useFormDefaultValues } from 'shared/hook-form/form-controller';

export const useMyDefaultValues = () => {
  return useFormDefaultValues<MyFormInputType, MyFormNetworkData>((data) => ({
    token: selectBestToken(data.balances),
    amount: 0n,
  }));
};
```

**Key Points:**

- Automatically waits for `isPending: false`
- Returns async default values for React Hook Form
- Selector function receives fully loaded network data

### 4. Validation Hook

Creates validation resolver using network data:

```tsx
// use-*-validation.ts
import {
  useFormValidation,
  type UseFormValidation,
} from 'shared/hook-form/validation';

export const useMyValidation: UseFormValidation<
  MyFormInputType,
  MyFormNetworkData
> = () => {
  return useFormValidation<MyFormInputType, MyFormNetworkData>(
    'fallbackField', // Field for general errors
    async (values, data, validate) => {
      // Validate fields
      await validate(['token', 'amount'], () =>
        validateBondAmount({
          token: values.token,
          amount: values.amount,
          maxStakeEth: data.maxStakeEth,
          ethBalance: data.ethBalance,
        }),
      );

      await validate('amount', () =>
        validateEtherAmount('amount', values.amount, values.token),
      );
    },
  );
};
```

**With Dependencies:**

```tsx
export const useMyValidation: UseFormValidation<
  MyFormInputType,
  MyFormNetworkData
> = () => {
  const {
    csm: { depositData: sdk },
  } = useLidoSDK();

  return useFormValidation<MyFormInputType, MyFormNetworkData>(
    'token',
    async (values, data, validate) => {
      await validate('depositData', () => {
        const { error } = sdk.parseDepositData(values.depositData);
        if (error) throw new ValidationError('depositData', error);
      });
    },
    [sdk], // Dependencies for React's change tracking
  );
};
```

**Key Points:**

- Uses `useFormValidation()` to eliminate boilerplate
- Network data automatically available from context
- Dependencies captured via closure, tracked in deps array
- Throw `ValidationError` for validation failures

### 5. Submit Hook

Implements transaction submission:

```tsx
// use-*-submit.ts
import { FormSubmitterHook } from 'shared/hook-form/form-controller';

export const useMySubmit: FormSubmitterHook<
  MyFormInputType,
  MyFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStages();

  return useCallback(
    async (
      { amount, token }, // Form values
      { nodeOperatorId }, // Network data
      { onConfirm, onRetry }, // Callbacks
    ): Promise<boolean> => {
      try {
        await csm.bond.addBond({
          nodeOperatorId,
          token,
          amount,
          callback: (stage, payload) => {
            // Handle transaction stages
          },
        });

        await onConfirm?.(); // Revalidate network data
        return true; // Success
      } catch (error) {
        return handleTxError(error);
      }
    },
    [csm.bond, txModalStages],
  );
};
```

**Key Points:**

- Returns `boolean` - `true` for success, `false` for cancellation
- `onConfirm()` triggers data revalidation after success
- `onRetry()` allows user to retry failed transactions
- Use `invariant()` for validating required form values

### 6. Updater Component (Optional)

Revalidates fields when dependencies change:

```tsx
// *-updater.tsx
export const MyUpdater: FC = () => {
  const [token] = useWatch<MyFormInputType, ['token']>({
    name: ['token'],
  });

  const { trigger } = useFormContext<MyFormInputType>();

  useEffect(() => {
    void trigger('amount'); // Revalidate amount when token changes
  }, [token]);

  return null;
};
```

**Use updaters when:**

- One field's validation depends on another field's value
- Validation rules change based on user selections
- Calculated values need to update on field changes

## Type System

### Core Types

```tsx
// Network data structure
type FormData<T> =
  | {
      data: Partial<T>; // Data (partial when loading)
      isPending: boolean; // Loading state
      revalidate: () => Promise<void>; // Refresh function
    }
  | {
      data: T; // Full data when loaded
      isPending: false;
      revalidate: () => Promise<void>;
    };

// Network data hook type
type NetworkData<T> = () => FormData<T>;

// Submit function type
type FormSubmitter<F extends FieldValues, C extends object> = (
  form: F, // Form values
  data: C, // Network data
  options: FormSubmitOptions, // Callbacks
) => Promise<boolean>;

// Submit hook type
type FormSubmitterHook<
  F extends FieldValues,
  C extends object,
> = () => FormSubmitter<F, C>;

// Validation hook type
type UseFormValidation<TInput, TNetworkData> = () => Resolver<TInput>;
```

### Form Types

```tsx
// types.ts
export type MyFormInputType = {
  token?: string;
  amount?: bigint;
};

export type MyFormNetworkData = {
  nodeOperatorId?: number;
  ethBalance?: bigint;
  maxStakeEth?: bigint;
};
```

**Conventions:**

- `*FormInputType` - Form field values (React Hook Form state)
- `*FormNetworkData` - External data from blockchain/APIs
- Use optional fields (`?`) for data that may not be loaded yet
- Use `bigint` for blockchain numbers

## Hooks & Utilities

### Context Hooks

```tsx
// Access network data
const { ethBalance, bond } = useFormData<MyFormNetworkData>();

// Access full FormData structure
const { data, isPending, revalidate } = useFormDataContext<MyFormNetworkData>();

// Access only loading state
const isPending = useFormDataPending();

// Get promise that resolves with data (for validation)
const dataPromise = useAwaitFormData<MyFormNetworkData>();
const data = await dataPromise; // Waits for isPending: false
```

### Validation

```tsx
// From 'shared/hook-form/validation'
export {
  // Core
  useFormValidation,
  ValidationError,
  initValidator,

  // Type utilities
  type UseFormValidation,
  type ValidationLogic,
  type ValidateFn,

  // Validators
  validateBondAmount,
  validateBigintMax,
  validateDepositData,
  validateEtherAmount,
  validateHash,
  validateNodeOperatorId,
};
```

### Components

```tsx
// From 'shared/hook-form/form-controller'
export {
  Form, // Form element with submit handling
  FormLoader, // Loading state wrapper
  FormControllerProvider, // Submission context provider

  // Context
  FormDataContext,
  useFormData,
  useFormDataContext,
  useFormDataPending,
  useAwaitFormData,

  // Utilities
  useFormDefaultValues,

  // Types
  type FormData,
  type FormSubmitter,
  type FormSubmitterHook,
  type NetworkData,
};
```

## Example: Complete Form

```tsx
// my-form.tsx
export const MyForm: FC = memo(() => {
  return (
    <MyDataProvider>
      <MyFormProvider>
        <FormBlock>
          <FormLoader>
            <Form>
              <TokenSelect />
              <AmountInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </MyFormProvider>
    </MyDataProvider>
  );
});
```

## Best Practices

### Architecture

- Always use the layered provider pattern
- Keep data fetching, validation, and submission in separate files
- Define strong types for inputs and network data

### Data Management

- Create dedicated `*-data-provider.tsx` for network data
- Use `revalidate()` to refresh data after transactions
- Aggregate all `isPending` flags in data provider
- Export typed `useFormData` hooks for each form

### Validation

- Use `useFormValidation()` to eliminate boilerplate
- Capture dependencies via closure, track in deps array
- Throw `ValidationError` for validation failures
- Use updater components for field dependencies

### Submission

- Follow `FormSubmitterHook` pattern
- Always call `onConfirm()` after success to revalidate data
- Support retry through `onRetry` callback
- Use `invariant()` to validate required form values

### Components

- Extract reusable controls to `controls/` directory
- Use `FormLoader` for consistent loading experience
- Reuse components from `shared/hook-form/controls`
