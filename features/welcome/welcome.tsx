import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModule } from 'modules/web3';
import { Stack, WelcomeSection } from 'shared/components';
import { Connect } from 'shared/wallet';
import styled from 'styled-components';
import { LandingBlock } from './landing';

export const Welcome: FC = () => {
  const { isCSM } = useModule();

  return (
    <>
      {isCSM && <LandingBlock />}
      <WelcomeSection>
        {isCSM ? (
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
              matomoEvent={
                MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator
              }
              color="secondary"
              data-testid="becomeANodeOperatorBtn"
            >
              Become a Node Operator
            </ConnectStyle>
          </Stack>
        ) : (
          <ConnectStyle
            fullwidth
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.connectWallet} // TODO: dedicated event for welcome page
            data-testid="connectWallet"
          >
            Connect wallet
          </ConnectStyle>
        )}
      </WelcomeSection>
    </>
  );
};

const ConnectStyle = styled(Connect)`
  min-width: max-content;
`;
