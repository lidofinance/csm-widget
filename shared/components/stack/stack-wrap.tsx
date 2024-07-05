import { type Theme } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StackWrapStyle } from './style';

type Props = {
  gap?: keyof Theme['spaceMap'];
};

export const StackWrap: FC<PropsWithChildren<Props>> = ({
  children,
  gap = 'md',
}) => (
  <StackWrapStyle $gap={gap} $direction={'row'}>
    {children}
  </StackWrapStyle>
);
