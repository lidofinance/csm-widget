import { PropsWithChildren, forwardRef } from 'react';
import { CheckboxInputStyle, RadioButtonStyle, RadioIconStyle } from './style';

type RadioButtonProps = {
  small?: boolean;
  error?: boolean;
};

export const RadioButton = forwardRef<
  HTMLInputElement,
  PropsWithChildren<RadioButtonProps>
>(({ children, small, error, ...props }, ref) => (
  <RadioButtonStyle $small={small} $error={error}>
    <CheckboxInputStyle type="radio" {...props} ref={ref} />
    {children}
  </RadioButtonStyle>
));

export const RadioIcon = () => <RadioIconStyle />;
