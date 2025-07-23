import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId, BondBalance } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

export const useOperatorBalance = <TData = BondBalance>(
  id: NodeOperatorId | undefined,
  select?: (data: BondBalance) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-balance', { id }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(id !== undefined);
      return csm.operator.getBondBalance(id);
    },
    enabled: id !== undefined,
    select,
  });
};
