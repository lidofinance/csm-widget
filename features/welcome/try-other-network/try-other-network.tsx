import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useRenderedModule } from 'shared/hooks';
import { FC } from 'react';
import { TryCsmMainnet } from './try-csm-mainnet';
import { TryCsmTestnet } from './try-csm-testnet';

const { defaultChain } = getConfig();

export const TryOtherNetwork: FC = () => {
  const renderedModule = useRenderedModule();
  const isMainnet = defaultChain === CHAINS.Mainnet;

  if (renderedModule === MODULE_NAME.CM) return null; // CM is not available on mainnet networks yet

  return isMainnet ? <TryCsmTestnet /> : <TryCsmMainnet />;
};
