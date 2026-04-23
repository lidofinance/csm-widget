import { LidoLogo } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link';

import { LogoLidoStyle } from './styles';

export const LogoLido: FC = () => (
  <LogoLidoStyle>
    <LidoLogo data-testid="lidoLogo" as="span" />
  </LogoLidoStyle>
);

export const LogoLidoLink: FC = () => (
  <LogoLidoStyle>
    <MatomoLink
      href="https://lido.fi"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.lidoHomeLink}
    >
      <LidoLogo data-testid="lidoLogo" as="span" />
    </MatomoLink>
  </LogoLidoStyle>
);
