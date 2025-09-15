import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { Stack, WelcomeSection } from 'shared/components';
import { Connect, Fallback } from 'shared/wallet';
import styled from 'styled-components';

export const Welcome: FC = () => {
  const { isSupportedChain, isWalletConnected } = useDappStatus();

  const isWrongChain = isWalletConnected && !isSupportedChain;

  return (
    <>
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
