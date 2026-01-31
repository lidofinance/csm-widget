import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config, getConfig } from 'config';
import { MODULE } from 'consts/module';
import { FC } from 'react';
import { TryCsmMainnet } from './try-csm-mainnet';
import { TryCsmTestnet } from './try-csm-testnet';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  if (config.module === MODULE.CM) return null; // CM is not available on mainnet networks yet

  return isMainnet ? <TryCsmTestnet /> : <TryCsmMainnet />;
};
