import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack } from 'shared/components';
import { useAccount } from 'shared/hooks';
import { useCsmPublicRelease } from 'shared/hooks/useCsmStatus';
import { Connect, Fallback } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { WelcomeSection } from './welcome-section';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data: isPublicRelease } = useCsmPublicRelease();

  const isWrongChain = isConnected && !active;

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
      {!isPublicRelease && <EarlyAdoptionBanner />}
    </>
  );
};
