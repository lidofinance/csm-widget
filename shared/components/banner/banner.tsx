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
  center?: boolean;
};

export const Banner: FC<PropsWithChildren<BannerProps>> = ({
  title,
  variant,
  extra,
  center,
  children,
}) => (
  <BannerStyled $variant={variant}>
    <Stack justify={center && !extra ? 'center' : 'space-between'} center>
      <BannerHeader>{title}</BannerHeader>
      {extra}
    </Stack>
    <BannerContent $center={center}>{children}</BannerContent>
  </BannerStyled>
);
