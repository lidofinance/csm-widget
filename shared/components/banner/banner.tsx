import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from '../stack/stack';
import {
  BannerContent,
  BannerHeader,
  BannerStyled,
  BannerVariant,
} from './styles';

type BannerProps = {
  title?: ReactNode;
  variant?: BannerVariant;
  extra?: ReactNode;
};

export const Banner: FC<PropsWithChildren<BannerProps>> = ({
  title,
  variant,
  extra,
  children,
}) => (
  <BannerStyled $variant={variant}>
    <Stack spaceBetween center>
      <BannerHeader>{title}</BannerHeader>
      {extra}
    </Stack>
    <BannerContent>{children}</BannerContent>
  </BannerStyled>
);
