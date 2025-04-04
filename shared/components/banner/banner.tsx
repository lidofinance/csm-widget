import { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
import {
  BannerContent,
  BannerHeader,
  BannerStyled,
  BannerVariant,
} from './styles';
import { LocalLink } from 'shared/navigate';
import { Stack } from '../stack/stack';
import { SectionHeaderLinkStyle } from '../section-title/styles';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';

type BannerProps = Partial<
  Pick<ComponentProps<typeof LocalLink>, 'href' | 'matomoEvent'>
> & {
  title?: ReactNode;
  variant?: BannerVariant;
};

export const Banner: FC<PropsWithChildren<BannerProps>> = ({
  title,
  variant,
  href,
  children,
}) => (
  <BannerStyled $variant={variant}>
    <Stack spaceBetween center>
      <BannerHeader>{title}</BannerHeader>
      {!!href && (
        <SectionHeaderLinkStyle href={href}>
          <RoundedArrowIcon />
        </SectionHeaderLinkStyle>
      )}
    </Stack>
    <BannerContent>{children}</BannerContent>
  </BannerStyled>
);
