import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack, WelcomeSection } from 'shared/components';
import { Connect } from 'shared/wallet';
import styled from 'styled-components';
import { LandingBlock } from './landing';

export const Welcome: FC = () => {
  return (
    <>
      <LandingBlock />
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
