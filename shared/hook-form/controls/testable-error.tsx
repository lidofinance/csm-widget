import { ReactNode } from 'react';

export const testableError = (
  error: ReactNode | boolean | undefined,
  fieldName: string,
): ReactNode | boolean | undefined => {
  if (typeof error === 'string') {
    return (
      <span data-testid={`error-${fieldName}`} role="alert">
        {error}
      </span>
    );
  }
  return error;
};
