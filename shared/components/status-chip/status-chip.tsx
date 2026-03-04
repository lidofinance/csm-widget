import { FC, PropsWithChildren } from 'react';
import { StatusStyle, Variants } from './style';

export type ChipProps = {
  variant?: Variants;
};

export const StatusChip: FC<PropsWithChildren<ChipProps>> = ({
  children,
  variant,
}) => <StatusStyle $variant={variant}>{children}</StatusStyle>;
