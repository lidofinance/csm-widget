import { useShareLimitPercentage } from 'modules/web3';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { ShortInlineLoader } from './styles';

export const FaqShareLimit: FC = () => {
  const { data, isPending } = useShareLimitPercentage();

  formatPercent;
  return isPending ? <ShortInlineLoader /> : <>{formatPercent(data)}</>;
};
