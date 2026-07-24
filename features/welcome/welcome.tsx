import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack, WelcomeSection } from 'shared/components';
import { Connect } from 'shared/wallet';
import styled from 'styled-components';
import { LandingBlock } from './landing';
import { isModuleCSM } from 'consts';

export const Welcome: FC = () => {
  return (
    <>
      {isModuleCSM && <LandingBlock />}
      <WelcomeSection>
        {isModuleCSM ? (
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
