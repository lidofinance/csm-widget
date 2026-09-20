import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useDappStatus, useFrameInfo } from 'modules/web3';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';
import { formatSecondsDuration } from '../parameters-list/format';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

// FAQ items using this are CSM-only content (FAQ_BOND_CSM / FAQ_MONITORING_CSM).
export const FaqFrameDuration: FC = () => {
  const { data, isPending } = useFrameInfo(
    (data) => data.frameDuration,
    MODULE_NAME.CSM,
  );

  formatPercent;
  return isPending ? <ShortInlineLoader /> : <>{formatSecondsDuration(data)}</>;
};

export const FaqRebaseDuration: FC = () => {
  const { chainId } = useDappStatus();
  const isMainnet = chainId === CHAINS.Mainnet;
  return isMainnet ? <>225 epochs (24hrs)</> : <>12 epochs (1hr 20min)</>;
};
