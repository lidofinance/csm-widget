import { Description, H2, Stack } from '@lidofinance/lido-app-ui';
import { LIDO_OPERATOR_PORTAL_BASE } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryOtherNetworkCard } from 'features/validate-with-lido/community-staking/try-other-network-card';
import { FC } from 'react';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { StarterPackCard } from './starter-pack-card';

export const AcknowledgementView: FC<{ onGetStarted: () => void }> = ({
  onGetStarted,
}) => (
  <>
    <Stack gap={8}>
      <H2 as="h1">CSM Node Operator starter pack</H2>
      <Description as="p">
        Make sure you’ve completed all the basic steps before joining the{' '}
        <MatomoLink
          $inline
          href={LIDO_OPERATOR_PORTAL_BASE}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackCSMLink}
        >
          Community Staking Module
        </MatomoLink>
      </Description>
    </Stack>
    <StarterPackCard onGetStarted={onGetStarted} />
    <TryOtherNetworkCard />
  </>
);
