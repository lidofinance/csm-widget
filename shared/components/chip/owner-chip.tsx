import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { StyledOwnerChip } from './styles';

export const OwnerChip = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<'span'>
>((props, ref) => {
  return (
    <StyledOwnerChip ref={ref} {...props} data-testid="ownerChip">
      Owner
    </StyledOwnerChip>
  );
});

OwnerChip.displayName = 'OwnerChip';
