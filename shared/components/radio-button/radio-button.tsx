import { PropsWithChildren, forwardRef } from 'react';
import { CheckboxInputStyle, RadioButtonStyle, RadioIconStyle } from './style';

export const RadioButton = forwardRef<
  HTMLInputElement,
  PropsWithChildren<{ small?: boolean }>
>(({ children, small, ...props }, ref) => (
  <RadioButtonStyle $small={small}>
    <CheckboxInputStyle type="radio" {...props} ref={ref} />
    {children}
  </RadioButtonStyle>
));

export const RadioIcon = () => <RadioIconStyle />;
