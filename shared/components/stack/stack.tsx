import { type Theme } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StackStyle } from './style';

type Props = {
  direction?: 'row' | 'column';
  gap?: keyof Theme['spaceMap'];
  center?: boolean;
  spaceBetween?: boolean;
};

export const Stack: FC<PropsWithChildren<Props>> = ({
  children,
  gap = 'md',
  direction = 'row',
  center,
  spaceBetween,
}) => (
  <StackStyle
    $gap={gap}
    $direction={direction}
    $center={center}
    $spaceBetween={spaceBetween}
  >
    {children}
  </StackStyle>
);
