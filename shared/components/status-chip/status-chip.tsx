import { FC, PropsWithChildren } from 'react';
import { ChipStyle, Variants } from './style';

export type ChipProps = {
  variant?: Variants;
  squared?: boolean;
  pale?: boolean;
};

export const StatusChip: FC<PropsWithChildren<ChipProps>> = ({
  children,
  variant,
  squared,
  pale,
}) => (
  <ChipStyle $variant={variant} $squared={squared} $pale={pale}>
    {children}
  </ChipStyle>
);

export const SquaredChip: FC<PropsWithChildren<ChipProps>> = (props) => (
  <StatusChip squared pale {...props} />
);
