import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { Dappnode, Ethdocker, PartnersStyle, Sedge, Stereum } from './styles';

export const Partners: FC = () => (
  <PartnersStyle>
    <MatomoLink
      href="https://docs.dappnode.io/docs/user/staking/ethereum/lsd-pools/lido"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.partnerDappnode}
      title="Dappnode"
    >
      <Dappnode />
    </MatomoLink>
    <MatomoLink
      href="https://www.nethermind.io/sedge"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.partnerSedge}
      title="Nethermind Sedge"
    >
      <Sedge />
    </MatomoLink>
    <MatomoLink
      href="https://stereum.net/"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.partnerStereum}
      title="Stereum"
    >
      <Stereum />
    </MatomoLink>
    <MatomoLink
      href="https://github.com/lidofinance/eth-docker"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.partnerEthdocker}
      title="Eth Docker"
    >
      <Ethdocker />
    </MatomoLink>
  </PartnersStyle>
);
