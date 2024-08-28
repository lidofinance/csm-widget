import { ButtonProps, External } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { WithMatomoEvent } from 'utils';
import { MatomoLink } from '../matomo-link/matomo-link';
import { StyledButton } from './style';

type LinkButtonProps = {
  href: string;
} & ButtonProps;

export const LinkButton: FC<
  PropsWithChildren<WithMatomoEvent<LinkButtonProps>>
> = ({ children, href, matomoEvent, ...props }) => {
  return (
    <MatomoLink {...{ href, matomoEvent }}>
      <StyledButton size="xs" color="secondary" {...props}>
        {children} <External />
      </StyledButton>
    </MatomoLink>
  );
};
