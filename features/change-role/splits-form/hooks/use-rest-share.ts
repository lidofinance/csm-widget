import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import { bigMax } from 'utils';
import { SplitsFormInputType } from '../context';

export const useRestShare = () => {
  const totalShare = useWatch<SplitsFormInputType, 'totalShare'>({
    name: 'totalShare',
  });

  const share = bigMax(0n, PERCENT_BASIS - totalShare);

  return share;
};
