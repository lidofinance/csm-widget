import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { isModuleCM } from 'consts/module';
import { FC } from 'react';
import { TryCsmMainnet } from './try-csm-mainnet';
import { TryCsmTestnet } from './try-csm-testnet';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  if (isModuleCM) return null; // CM is not available on mainnet networks yet

  return isMainnet ? <TryCsmTestnet /> : <TryCsmMainnet />;
};
