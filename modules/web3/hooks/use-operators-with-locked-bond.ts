import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { STETH_ROUNDING_THRESHOLD } from '@lidofinance/lido-csm-sdk';

export const useOperatorsWithLockedBond = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['operators-with-locked-bond'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.stealing.getOperatorsWithLockedBond(),
    select: (data) =>
      data.filter(({ locked }) => locked > STETH_ROUNDING_THRESHOLD),
  });
};
