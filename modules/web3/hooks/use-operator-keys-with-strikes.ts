import {
  KeyWithStrikes,
  MODULE_NAME,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useActiveSmSDK } from '../web3-provider';

export const KEY_OPERATOR_STRIKES = ['operator-strikes'];

export const useOperatorKeysWithStrikes = <TData = KeyWithStrikes[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: KeyWithStrikes[]) => TData,
) => {
  const sdk = useActiveSmSDK(MODULE_NAME.CSM);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_STRIKES,
      { nodeOperatorId, module: MODULE_NAME.CSM },
    ],
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
