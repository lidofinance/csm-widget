import { useRewardsFrame } from 'modules/web3';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';
import { formatSecondsDuration } from '../parameters-list/format';

export const FaqFrameDuration: FC = () => {
  const { data, isPending } = useRewardsFrame();

  formatPercent;
  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <>{formatSecondsDuration(data?.frameDuration ?? 0n)}</>
  );
};
