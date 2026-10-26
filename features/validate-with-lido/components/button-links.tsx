import { Button, IconLink } from '@lidofinance/lido-app-ui';
import type { ButtonProps } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ExternalLink, LocalLink } from 'shared/navigate';
import { trackMatomoEvent } from 'utils';

type ButtonLinkProps = Pick<ButtonProps, 'variant' | 'size'> & {
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES;
  'data-testid'?: string;
};

const GhostButton = styled(Button)`
  && {
    --local-pad-h: 12px;
  }
`;

const pickButton = (variant: ButtonProps['variant']) =>
  variant === 'ghost' ? GhostButton : Button;

export const InternalButtonLink: FC<
  PropsWithChildren<ButtonLinkProps & { href: PATH }>
> = ({
  href,
  matomoEvent,
  'data-testid': testId,
  children,
  ...buttonProps
}) => {
  const ButtonComponent = pickButton(buttonProps.variant);

  return (
    <LocalLink href={href} matomoEvent={matomoEvent} data-testid={testId}>
      <ButtonComponent {...buttonProps}>{children}</ButtonComponent>
    </LocalLink>
  );
};

const ExternalAnchor = styled(ExternalLink)`
  display: inline-flex;
  text-decoration: none;
`;

export const ExternalCtaButton: FC<
  PropsWithChildren<ButtonLinkProps & { href: string }>
> = ({
  href,
  matomoEvent,
  'data-testid': testId,
  children,
  ...buttonProps
}) => {
  const ButtonComponent = pickButton(buttonProps.variant);

  return (
    <ExternalAnchor
      href={href}
      data-testid={testId}
      onClick={() => trackMatomoEvent(matomoEvent)}
    >
      <ButtonComponent iconRight={<IconLink />} {...buttonProps}>
        {children}
      </ButtonComponent>
    </ExternalAnchor>
  );
};
