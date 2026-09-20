import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { FC } from 'react';
import { TryCsmMainnet } from './try-csm-mainnet';
import { TryCsmTestnet } from './try-csm-testnet';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  return isMainnet ? <TryCsmTestnet /> : <TryCsmMainnet />;
};
