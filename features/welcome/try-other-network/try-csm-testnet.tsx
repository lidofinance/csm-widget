import { Button, Text } from '@lidofinance/lido-ui';
import { CSM_TESTNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { StyledBlock, StyledStack } from './styles';
import { FC } from 'react';

export const TryCsmTestnet: FC = () => {
  return (
    <StyledBlock>
      <StyledStack>
        <Text weight={700} size="lg">
          Try CSM on Hoodi
        </Text>
        <MatomoLink
          href={CSM_TESTNET_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          <Button size="xs" variant="outlined">
            Join CSM testnet
          </Button>
        </MatomoLink>
      </StyledStack>
      <Text color="secondary" size="xs">
        CSM uses Hoodi as a testnet playground for those who want to try the
        module in action in a test environment.
      </Text>
    </StyledBlock>
  );
};
