import { ComponentPropsWithoutRef, FC } from 'react';
import { ChipStyle, Variants } from './style';

export type ChipProps = ComponentPropsWithoutRef<'div'> & {
  variant?: Variants;
  squared?: boolean;
  pale?: boolean;
};

export const StatusChip: FC<ChipProps> = ({
  children,
  variant,
  squared,
  pale,
  ...rest
}) => (
  <ChipStyle $variant={variant} $squared={squared} $pale={pale} {...rest}>
    {children}
  </ChipStyle>
);

export const SquaredChip: FC<ChipProps> = (props) => (
  <StatusChip squared pale {...props} />
);
