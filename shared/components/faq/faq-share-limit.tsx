import { useShareLimitPercentage } from 'modules/web3';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './short-inline-loader';

export const FaqShareLimit: FC = () => {
  const { data, isPending } = useShareLimitPercentage();

  formatPercent;
  return isPending ? <ShortInlineLoader /> : <>{formatPercent(data)}</>;
};
