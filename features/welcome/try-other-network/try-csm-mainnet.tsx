import { Button, Text } from '@lidofinance/lido-ui';
import { CSM_MAINNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { StyledBlock, StyledStack } from './styles';

export const TryCsmMainnet: FC = () => {
  return (
    <StyledBlock>
      <StyledStack>
        <Text weight={700} size="lg">
          Try CSM on Mainnet
        </Text>
        <MatomoLink
          href={CSM_MAINNET_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          <Button size="xs" variant="outlined">
            Join CSM Mainnet
          </Button>
        </MatomoLink>
      </StyledStack>
    </StyledBlock>
  );
};
