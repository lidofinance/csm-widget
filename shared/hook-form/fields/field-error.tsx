import { FieldError as LibFieldError } from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useId } from 'react';

export const FIELD_ERROR_TEST_ID = 'inputMessageError';

export type FieldErrorProps = {
  /** Id of the described control; the message gets `getFieldErrorId(id)`. */
  id?: string;
  children?: ReactNode;
  'data-testid'?: string;
};

/** Inline field error for controls without a built-in error slot; renders nothing without a message. */
export const FieldError: FC<FieldErrorProps> = ({
  id,
  children,
  'data-testid': testId = FIELD_ERROR_TEST_ID,
}) => {
  const fallbackId = useId();
  if (!children) return null;

  return (
    <LibFieldError id={id ?? fallbackId} dataTestId={testId}>
      {children}
    </LibFieldError>
  );
};
