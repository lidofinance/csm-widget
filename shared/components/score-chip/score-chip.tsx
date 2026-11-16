import { FC, PropsWithChildren, ReactNode } from 'react';
import { ChipStyle, Variants } from './style';
import { Check, Close } from '@lidofinance/lido-ui';
import Clock from 'assets/icons/clock.svg?react';

type Props = {
  type?: Variants;
};

const ICONS: Record<Variants, ReactNode> = {
  default: <Check />,
  success: <Check />,
  error: <Close />,
  pending: <Clock />,
};

export const ScoreChip: FC<PropsWithChildren<Props>> = ({
  children,
  type = 'default',
}) => (
  <ChipStyle $variant={type} data-testid="scoreChip">
    {ICONS[type]}
    {children}
  </ChipStyle>
);
