import { forwardRef } from 'react';
import { ToggleKnobStyle, ToggleTrackStyle } from './styles';

export type ToggleProps = {
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, disabled, onChange }, ref) => (
    <ToggleTrackStyle
      ref={ref}
      type="button"
      $on={checked}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : () => onChange?.(!checked)}
    >
      <ToggleKnobStyle $on={checked} />
    </ToggleTrackStyle>
  ),
);
