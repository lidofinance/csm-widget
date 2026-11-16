import { Banner, Button, IconLink } from '@lidofinance/lido-app-ui';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CSM_MAINNET_LINK, CSM_TESTNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { trackMatomoEvent } from 'utils';

export const TryOtherNetworkBanner: FC<{ isMainnet: boolean }> = ({
  isMainnet,
}) => (
  <Banner
    title={isMainnet ? 'Try CSM on Hoodi' : 'Try CSM on Mainnet'}
    description={
      isMainnet
        ? 'CSM uses Hoodi as a testnet playground for those who want to try the module in action in a test environment'
        : undefined
    }
    action={
      <Button
        href={isMainnet ? CSM_TESTNET_LINK : CSM_MAINNET_LINK}
        variant="outline"
        size="small"
        iconRight={<IconLink />}
        onClick={() =>
          trackMatomoEvent(
            isMainnet
              ? MATOMO_CLICK_EVENTS_TYPES.csmJoinTestnet
              : MATOMO_CLICK_EVENTS_TYPES.csmJoinMainnet,
          )
        }
      >
        {isMainnet ? 'Join CSM testnet' : 'Join CSM Mainnet'}
      </Button>
    }
  />
);

export const TryOtherNetworkCard: FC = () => (
  <TryOtherNetworkBanner
    isMainnet={useDappStatus().chainId === CHAINS.Mainnet}
  />
);
