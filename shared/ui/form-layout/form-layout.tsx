import type { FC, HTMLAttributes, ReactNode } from 'react';
import {
  AsideContentStyle,
  AsideStyle,
  LayoutStyle,
  MainStyle,
} from './styles';

export type FormLayoutProps = HTMLAttributes<HTMLDivElement> & {
  aside: ReactNode;
};

export const FormLayout: FC<FormLayoutProps> = ({
  aside,
  children,
  ...rest
}) => (
  <LayoutStyle {...rest}>
    <MainStyle>{children}</MainStyle>
    <AsideStyle>
      <AsideContentStyle>{aside}</AsideContentStyle>
    </AsideStyle>
  </LayoutStyle>
);
