import { FC } from 'react';

import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import { BannerHeader, BlockStyled } from './styles';

const links = getExternalLinks();

export const ConsumedBanner: FC = () => (
  <BlockStyled>
    <BannerHeader>
      You have already joined CSM during Early&nbsp;Adoption&nbsp;period
    </BannerHeader>
    <p>
      You will be most welcome when the module is on the permissionless phase.
    </p>
    <MatomoLink
      href={links.earlyAdoptionAbout}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.consumedEarlyAdoptionLearnMore}
    >
      Learn more about Early Adoption.
    </MatomoLink>
  </BlockStyled>
);
