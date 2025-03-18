import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack } from 'shared/components';
import { useAccount } from 'shared/hooks';
import { useCsmPaused, useCsmPublicRelease } from 'shared/hooks/useCsmStatus';
import { Connect, Fallback } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { WelcomeSection } from './welcome-section';
import styled from 'styled-components';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data: isPublicRelease } = useCsmPublicRelease();
  const { data: paused } = useCsmPaused();

  const isWrongChain = isConnected && !active;

  return (
    <>
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        <Stack wrap>
          <ConnectStyle
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectAsNodeOperator}
          >
            I am a Node Operator
          </ConnectStyle>
          <ConnectStyle
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator}
            color="secondary"
          >
            Become a Node Operator
          </ConnectStyle>
        </Stack>
      </WelcomeSection>
      {!isPublicRelease && !paused && <EarlyAdoptionBanner />}
    </>
  );
};

const ConnectStyle = styled(Connect)`
  min-width: max-content;
`;
