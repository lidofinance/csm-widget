import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import { SiweSignInPage } from 'shared/wallet';

export const SurveysSignInPage: FC = () => (
  <SiweSignInPage connectDescription="Connect your wallet and sign a verification message to continue">
    Here you can voluntarily provide information about your Node Operator,
    including your contact details, experience, and setup. This information may
    be used for report building (
    <MatomoLink
      $inline
      data-testid="vanomDashboardLink"
      href="https://app.hex.tech/8dedcd99-17f4-49d8-944e-4857a355b90a/app/3f7d6967-3ef6-4e69-8f7b-d02d903f045b/latest"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.vanomDashboardLink}
    >
      VaNOM
    </MatomoLink>
    ), UI/UX improvements, or feedback purposes. To view or submit this
    information, you must sign in to verify that you are the owner of the Reward
    or Manager Address.
  </SiweSignInPage>
);
