import { FC } from 'react';

import { Stack } from 'shared/components';
import { useAccount } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { Connect, Fallback } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { WelcomeSection } from './welcome-section';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data } = useCsmStatus();

  const isWrongChain = isConnected && !active;

  // TODO: state for `status.isUnavailable` (RPC error)
  return (
    <>
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        <Stack wrap>
          <Connect
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectAsNodeOperator}
          >
            I am a Node Operator
          </Connect>
          <Connect
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator}
            color="secondary"
          >
            Become a Node Operator
          </Connect>
        </Stack>
      </WelcomeSection>
      {data?.isEarlyAdoption && <EarlyAdoptionBanner />}
    </>
  );
};
