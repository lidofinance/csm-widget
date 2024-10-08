import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import { BannerHeader, BlockStyled } from './styles';
import { getExternalLinks } from 'consts/external-links';

const links = getExternalLinks();

export const NotEligibleBanner: FC = () => (
  <BlockStyled>
    <BannerHeader>
      You are not eligible to join CSM during Early&nbsp;Adoption&nbsp;period
    </BannerHeader>
    <p>
      You will be most welcome when the module is on the permissionless phase.
    </p>
    <MatomoLink
      href={links.earlyAdoptionAbout}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.notEligibleEarlyAdoptionLearnMore}
    >
      Learn more about Early Adoption.
    </MatomoLink>
  </BlockStyled>
);
