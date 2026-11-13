import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { FC } from 'react';
import { TryOtherNetworkBanner } from 'features/validate-with-lido/community-staking/try-other-network-card';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => (
  <TryOtherNetworkBanner isMainnet={defaultChain === CHAINS.Mainnet} />
);
