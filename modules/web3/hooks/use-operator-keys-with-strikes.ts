import { KeyWithStrikes, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { MODULE, STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_STRIKES = ['operator-strikes'];

export const useOperatorKeysWithStrikes = <TData = KeyWithStrikes[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStrikes[]) => TData,
) => {
  const sdk = useSmSDK(MODULE.CSM);

  return useQuery({
    queryKey: [...KEY_OPERATOR_STRIKES, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);
      return sdk.strikes.getKeysWithStrikes(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
    select,
  });
};
