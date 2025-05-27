import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';

export const useOperatorInfo = <TData = NodeOperatorInfo>(
  id?: NodeOperatorId,
  select?: (data: NodeOperatorInfo) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['node-operator-info', { id }],
    ...STRATEGY_CONSTANT,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => csm.operator.getInfo(id!),
    enabled: id !== undefined,
    select,
  });
};
