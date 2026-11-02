import { FC, ReactNode } from 'react';
import { FieldErrorStyle } from './styles';

export const FIELD_ERROR_TEST_ID = 'inputMessageError';

export type FieldErrorProps = {
  id?: string;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
};

/** Inline field error for controls without a built-in error slot; renders nothing without a message. */
export const FieldError: FC<FieldErrorProps> = ({
  children,
  'data-testid': testId = FIELD_ERROR_TEST_ID,
  ...rest
}) => {
  if (!children) return null;

  return (
    <FieldErrorStyle role="alert" data-testid={testId} {...rest}>
      {children}
    </FieldErrorStyle>
  );
};
