import { ReactNode } from 'react';

export const testableError = (
  error: ReactNode | boolean | undefined,
): ReactNode | boolean | undefined => {
  if (typeof error === 'string') {
    return (
      <span data-testid="inputMessageError" role="alert">
        {error}
      </span>
    );
  }
  return error;
};
