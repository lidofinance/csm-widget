import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import { BannerHeader, BlockStyled } from './styles';

export const NotEligibleBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        You are not eligible to join CSM during Early&nbsp;Adoption&nbsp;period
      </BannerHeader>
      <p>
        You will be most welcome when the module is on the permissionless phase.
      </p>
      <MatomoLink
        href="https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22"
        matomoEvent={
          MATOMO_CLICK_EVENTS_TYPES.notEligibleEarlyAdoptionLearnMore
        }
      >
        Learn more about Early Adoption.
      </MatomoLink>
    </BlockStyled>
  );
};
