import { type Theme } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StackStyle, StackStyleProps } from './style';

type Props = {
  direction?: 'row' | 'column';
  gap?: keyof Theme['spaceMap'] | 'none';
  center?: boolean;
  align?: StackStyleProps['$align'];
  spaceBetween?: boolean;
  wrap?: boolean;
};

export const Stack: FC<PropsWithChildren<Props>> = ({
  children,
  gap = 'md',
  direction = 'row',
  center,
  align,
  spaceBetween,
  wrap,
}) => (
  <StackStyle
    $gap={gap}
    $direction={direction}
    $align={center ? 'center' : align}
    $spaceBetween={spaceBetween}
    $wrap={wrap}
  >
    {children}
  </StackStyle>
);
