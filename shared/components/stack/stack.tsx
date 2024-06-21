import { type Theme } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StackStyle } from './style';

type Props = {
  direction?: 'row' | 'column';
  gap?: keyof Theme['spaceMap'];
};

export const Stack: FC<PropsWithChildren<Props>> = ({
  children,
  gap,
  direction,
}) => (
  <StackStyle $gap={gap} $direction={direction}>
    {children}
  </StackStyle>
);
