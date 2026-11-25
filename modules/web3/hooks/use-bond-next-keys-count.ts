import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_BOND_NEXT_KEYS_COUNT = ['getBondForNextKeysPerToken'];

type Props = {
  nodeOperatorId: NodeOperatorId | undefined;
  token: TOKENS;
  keysCount?: number;
};

export const useBondNextKeysCount = ({
  nodeOperatorId,
  token,
  keysCount = 0,
}: Props) => {
  const sdk = useSmSDK();

  return useQuery({
    queryKey: [
      ...KEY_BOND_NEXT_KEYS_COUNT,
      { keysCount, nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined && sdk);
      return sdk.accounting.getBondForNextKeysPerToken({
        keysCount: BigInt(keysCount),
        nodeOperatorId,
      });
    },
    enabled: keysCount > 0 && nodeOperatorId !== undefined && !!sdk,
    select: (data) => data[token],
  });
};
