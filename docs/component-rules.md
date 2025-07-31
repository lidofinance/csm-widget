# Component Architecture Rules and Patterns

This document outlines the established patterns and rules for components in the Lido CSM codebase, based on analysis of both `shared/components/` and `features/` directories.

## File Organization and Naming

### Directory Structure

```
shared/components/
├── [component-name]/           # kebab-case directory names
│   ├── index.ts               # barrel exports
│   ├── [component-name].tsx   # main component file
│   ├── styles.ts              # styling (or style.ts for simple components)
│   └── types.ts               # optional type definitions
```

### File Naming Conventions

- **Directories**: kebab-case (`accordion-navigatable`, `input-amount`)
- **Component files**: `{component-name}.tsx` matching directory name
- **Style files**: `styles.ts` (complex) or `style.ts` (simple) or `styles.tsx` (with JSX)
- **Type files**: `types.ts` (when needed)
- **Index files**: `index.ts` for re-exports

## Component Structure Patterns

### Basic Component Pattern

```typescript
import { FC, ReactNode } from 'react';
import { ComponentNameStyled } from './styles';

type Props = {
  children?: ReactNode;
  variant?: 'default' | 'warning';
  big?: boolean;
};

export const ComponentName: FC<Props> = ({
  children,
  variant = 'default',
  big = false,
  ...props
}) => (
  <ComponentNameStyled $variant={variant} $big={big} {...props}>
    {children}
  </ComponentNameStyled>
);
```

### Compound Component Pattern

```typescript
// For related components (like FAQ items)
export const Faq = ({ items }) => (
  <div>
    {items.map(item => (
      <FaqItem key={item.id} {...item} />
    ))}
  </div>
);

export const FaqItem = ({ title, content }) => (
  <details>
    <summary>{title}</summary>
    {content}
  </details>
);
```

## Styling Patterns

### Styled-Components with Theme Integration

```typescript
// styles.ts
import styled, { css } from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

const VARIANTS = {
  default: css`
    background: var(--lido-color-background);
  `,
  warning: css`
    background: var(--lido-color-warning);
  `,
};

export const ComponentStyled = styled(Block)<{
  $variant?: keyof typeof VARIANTS;
  $big?: boolean;
}>`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;

  ${({ $variant }) => $variant && VARIANTS[$variant]}
  ${({ $big }) =>
    $big &&
    css`
      font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
    `}
`;
```

### Styled-Component Props Rules

- **Dollar prefix**: All styled-component props use `$` prefix (`$variant`, `$big`, `$gap`)
- **Boolean props**: Use direct boolean values (`$loading`, `$secondary`)
- **Variant props**: Use union types from variant objects

## TypeScript Patterns

### Props Type Definition

```typescript
// Inline type definitions (preferred)
type ComponentProps = {
  title?: ReactNode;
  variant?: 'default' | 'warning';
  big?: boolean;
} & Omit<ComponentProps<typeof BaseComponent>, 'children'>;

// OR for complex components
interface ComponentProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  disabled?: boolean;
}
```

### Generic Component Pattern

```typescript
type Component<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & {
  customProp?: string;
};
```

### ForwardRef Pattern (for inputs)

```typescript
export const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...props }, ref) => (
    <InputStyled
      ref={ref}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
);
```

## Export/Import Patterns

### Index File Exports

```typescript
// index.ts - barrel exports
export * from './component-name';
export { ComponentName } from './component-name';

// For multiple related exports
export * from './component-name';
export * from './sub-component';
```

### Import Patterns

```typescript
// Named imports (preferred)
import { Text, Button } from '@lidofinance/lido-ui';
import { Stack } from '../stack';

// Type-only imports
import type { ComponentProps, FC } from 'react';
```

## Feature-Based Architecture

### Feature Structure

```
features/
├── [feature-name]/
│   ├── index.ts                    # feature exports
│   ├── [feature-name].tsx         # main feature component
│   ├── [feature-name]-page.tsx    # page wrapper
│   └── [feature-name]-form/       # form-specific logic
│       ├── context/               # form state management
│       ├── controls/              # form controls
│       ├── hooks/                 # feature-specific hooks
│       └── [feature-name]-form.tsx
```

### Form Architecture Pattern

```typescript
// Form Provider (context/[form-name]-form-provider.tsx)
export const FormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useFormNetworkData();
  const validationResolver = useFormValidation(networkData);
  const formObject = useForm<FormInputType>({
    resolver: validationResolver,
    mode: 'onChange',
  });

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

### Form Validation Pattern

```typescript
// use-[form-name]-validation.ts
export const useFormValidation = (networkData: NetworkData) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<FormInputType>>(
    async (values) => {
      try {
        const networkContext = await dataPromise;
        // Validation logic
        return { values, errors: {} };
      } catch (error) {
        return handleResolverValidationError(error, 'FormName', 'defaultField');
      }
    },
    [dataPromise],
  );
};
```

### Form Submission Pattern

```typescript
// use-[form-name]-submit.ts
export const useFormSubmit = ({ onConfirm, onRetry }) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStages();

  const submit = useCallback(
    async (formData, networkData) => {
      const callback: TransactionCallback = async ({ stage, payload }) => {
        switch (stage) {
          case TransactionCallbackStage.SIGN:
            txModalStages.sign(formData);
            break;
          case TransactionCallbackStage.RECEIPT:
            txModalStages.pending(formData, payload.hash);
            break;
          case TransactionCallbackStage.DONE:
            txModalStages.success(payload.result, payload.hash);
            break;
          case TransactionCallbackStage.ERROR:
            txModalStages.failed(payload.error, onRetry);
            break;
        }
      };

      await csm.operation({ ...formData, callback });
      return true;
    },
    [csm, txModalStages, onConfirm, onRetry],
  );

  return { submit };
};
```

## Component Naming Conventions

### Shared Components

- **Descriptive names**: `AccordionNavigatable`, `AmountWithPrice`, `ExternalButtonLink`
- **Suffix patterns**: `Styled` for styled components, `Hook` for hook components
- **Boolean props**: `big`, `loading`, `disabled`, `warning`

### Feature Components

- **Pages**: `[Feature]Page` (e.g., `AddBondPage`, `DashboardPage`)
- **Main components**: `[Feature]` (e.g., `AddBond`, `Dashboard`)
- **Forms**: `[Feature]Form` (e.g., `AddBondForm`, `SubmitKeysForm`)
- **Form controls**: Descriptive names (`AmountInput`, `SubmitButton`, `TokenSelect`)
- **Providers**: `[Feature]FormProvider`
- **Hooks**: `use[Feature][Purpose]` (e.g., `useAddBondSubmit`, `useAddBondValidation`)

## Performance and Best Practices

### Optimization Patterns

- Use `forwardRef` for input components
- Implement `useCallback` for expensive operations
- Use `useMemo` for complex calculations
- Implement proper loading states

### Error Handling

- Graceful fallbacks (return `null` when required props missing)
- Try-catch blocks for parsing operations
- Consistent error messaging through validation utilities

### Accessibility

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader considerations
- Semantic HTML structure

## Integration Patterns

### External Libraries

- **Base components**: Extend `@lidofinance/lido-ui` components
- **Web3 integration**: Use `@lidofinance/lido-csm-sdk` for blockchain operations
- **Form handling**: React Hook Form with custom resolvers
- **Styling**: Styled-components with theme integration

### Theme Integration

```typescript
// Use theme properties
gap: ${({ theme }) => theme.spaceMap.md}px;
border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
color: var(--lido-color-text);
```

## Common Anti-Patterns to Avoid

1. **Don't** use direct DOM manipulation
2. **Don't** create styled-component props without `$` prefix
3. **Don't** mix file naming conventions (stick to kebab-case)
4. **Don't** create new validation patterns - use existing utilities
5. **Don't** bypass the form context architecture for forms
6. **Don't** create components without proper TypeScript types
7. **Don't** ignore accessibility requirements

## Conclusion

These patterns ensure:

- **Consistency** across the codebase
- **Maintainability** through clear conventions
- **Type safety** with comprehensive TypeScript usage
- **Performance** through optimized patterns
- **Accessibility** through proper implementation
- **Developer experience** through predictable structure

Follow these patterns when creating new components or modifying existing ones to maintain codebase quality and consistency.
