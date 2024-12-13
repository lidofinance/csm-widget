import { FC, PropsWithChildren, ReactNode } from 'react';
import {
  BannerContent,
  BannerHeader,
  BannerStyled,
  BannerVariant,
} from './styles';

type BannerProps = {
  title?: ReactNode;
  variant?: BannerVariant;
};

export const Banner: FC<PropsWithChildren<BannerProps>> = ({
  title,
  variant,
  children,
}) => (
  <BannerStyled $variant={variant}>
    <BannerHeader>{title}</BannerHeader>
    <BannerContent>{children}</BannerContent>
  </BannerStyled>
);
