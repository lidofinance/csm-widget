import { Button, Text } from '@lidofinance/lido-ui';
import { getConfig } from 'config';
import { CSM_MAINNET_LINK, CSM_TESTNET_LINK } from 'consts/external-links';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { StyledBlock, StyledStack } from './styles';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const { defaultChain } = getConfig();

export const TryCSM: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  if (isMainnet)
    return (
      <StyledBlock>
        <StyledStack>
          <Text weight={700} size="lg">
            Try CSM on Hoodi
          </Text>
          <MatomoLink
            href={CSM_TESTNET_LINK}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryCsmOtherNetworkLink}
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

  return (
    <StyledBlock>
      <StyledStack>
        <Text weight={700} size="lg">
          Try CSM on Mainnet
        </Text>
        <MatomoLink
          href={CSM_MAINNET_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryCsmOtherNetworkLink}
        >
          <Button size="xs" variant="outlined">
            Join CSM Mainnet
          </Button>
        </MatomoLink>
      </StyledStack>
    </StyledBlock>
  );
};
