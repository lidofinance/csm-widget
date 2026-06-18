import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { TryCsmMainnet } from './try-csm-mainnet';
import { TryCsmTestnet } from './try-csm-testnet';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;
  const { isCM } = useModule();

  if (isCM) return null; // CM is not available on mainnet networks yet

  return isMainnet ? <TryCsmTestnet /> : <TryCsmMainnet />;
};
