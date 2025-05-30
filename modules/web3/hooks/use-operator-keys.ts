import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { Hex } from 'viem';
import { useLidoSDK } from '../web3-provider';

export const useOperatorInfo = <TData = Hex[]>(
  id?: NodeOperatorId,
  select?: (data: Hex[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-keys', { id }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(id);
      return csm.operator.getKeys(id);
    },
    enabled: id !== undefined,
    select,
  });
};
