import { STETH_ROUNDING_THRESHOLD } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useOperatorsWithLockedBond = () => {
  const { stealing } = useSmSDK();

  return useQuery({
    queryKey: ['operators-with-locked-bond'],
    ...STRATEGY_CONSTANT,
    queryFn: () => stealing.getOperatorsWithLockedBond(),
    select: (data) =>
      data.filter(({ locked }) => locked > STETH_ROUNDING_THRESHOLD),
  });
};
