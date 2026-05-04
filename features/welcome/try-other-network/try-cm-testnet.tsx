import { Button, Text } from '@lidofinance/lido-ui';
import { CM_MAINNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { StyledBlock, StyledStack } from './styles';

export const TryCmTestnet: FC = () => {
  return (
    <StyledBlock>
      <StyledStack>
        <Text weight={700} size="lg">
          Navigate to CM on Hoodi
        </Text>
        <MatomoLink
          href={CM_MAINNET_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          <Button size="xs" variant="outlined">
            Open CM testnet widget
          </Button>
        </MatomoLink>
      </StyledStack>
      <Text color="secondary" size="xs">
        CM uses Hoodi as a testnet playground for those who want to try the
        module in action in a test environment.
      </Text>
    </StyledBlock>
  );
};
