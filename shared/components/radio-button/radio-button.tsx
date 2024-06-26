import { PropsWithChildren, forwardRef } from 'react';
import { CheckboxInputStyle, RadioButtonStyle, RadioIconStyle } from './style';

export const RadioButton = forwardRef<HTMLInputElement, PropsWithChildren>(
  ({ children, ...props }, ref) => (
    <RadioButtonStyle>
      <CheckboxInputStyle type="radio" {...props} ref={ref} />
      {children}
    </RadioButtonStyle>
  ),
);

export const RadioIcon = () => <RadioIconStyle />;
