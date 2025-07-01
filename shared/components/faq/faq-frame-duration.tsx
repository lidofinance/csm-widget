import { useDappStatus, useFrameInfo } from 'modules/web3';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';
import { formatSecondsDuration } from '../parameters-list/format';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const FaqFrameDuration: FC = () => {
  const { data, isPending } = useFrameInfo((data) => data.frameDuration);

  formatPercent;
  return isPending ? <ShortInlineLoader /> : <>{formatSecondsDuration(data)}</>;
};

export const FaqRebaseDuration: FC = () => {
  const { chainId } = useDappStatus();
  const isMainnet = chainId === CHAINS.Mainnet;
  return isMainnet ? <>225 epochs (24hrs)</> : <>12 epochs (1hr 20min)</>;
};
