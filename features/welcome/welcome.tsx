import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack, WelcomeSection } from 'shared/components';
import { useAccount } from 'shared/hooks';
import { Connect, Fallback } from 'shared/wallet';
import styled from 'styled-components';
import { HoleskyBanner } from './holesky-banner';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { HoodiBanner } from './hoodi-banner';

const { defaultChain } = getConfig();

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();

  const isWrongChain = isConnected && !active;

  return (
    <>
      {defaultChain === CHAINS.Holesky && <HoleskyBanner />}
      {defaultChain === CHAINS.Hoodi && <HoodiBanner />}
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        <Stack wrap>
          <ConnectStyle
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectAsNodeOperator}
            data-testid="iAmANodeOperatorBtn"
          >
            I am a Node Operator
          </ConnectStyle>
          <ConnectStyle
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator}
            color="secondary"
            data-testid="becomeANodeOperatorBtn"
          >
            Become a Node Operator
          </ConnectStyle>
        </Stack>
      </WelcomeSection>
    </>
  );
};

const ConnectStyle = styled(Connect)`
  min-width: max-content;
`;
