import { FC, PropsWithChildren } from 'react';
import { StackStyle, StackStyleProps } from './style';

type Props = {
  direction?: 'row' | 'column';
  gap?: StackStyleProps['$gap'];
  center?: boolean;
  align?: StackStyleProps['$align'];
  justify?: StackStyleProps['$justify'];
  spaceBetween?: boolean;
  wrap?: boolean;
};

export const Stack: FC<PropsWithChildren<Props>> = ({
  children,
  gap = 'md',
  direction = 'row',
  center,
  align,
  justify,
  spaceBetween,
  wrap,
}) => (
  <StackStyle
    $gap={gap}
    $direction={direction}
    $align={center ? 'center' : align}
    $justify={spaceBetween ? 'space-between' : justify}
    $wrap={wrap}
  >
    {children}
  </StackStyle>
);
