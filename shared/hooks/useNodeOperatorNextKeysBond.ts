import { Zero } from '@ethersproject/constants';
import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { TOKENS } from 'consts/tokens';
import { useCSAccountingRPC } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { NodeOperatorId } from 'types';

const METHOD_BY_TOKEN = {
  [TOKENS.ETH]: 'getRequiredBondForNextKeys',
  [TOKENS.STETH]: 'getRequiredBondForNextKeys',
  [TOKENS.WSTETH]: 'getRequiredBondForNextKeysWstETH',
} as const;

type UseReadAdditionalBondAmountParams = {
  nodeOperatorId?: NodeOperatorId;
  keysCount?: number;
  token?: TOKENS;
};

export const useNodeOperatorNextKeysBond = (
  {
    nodeOperatorId,
    keysCount = 0,
    token = TOKENS.STETH,
  }: UseReadAdditionalBondAmountParams,
  config = STRATEGY_LAZY,
) => {
  invariant(nodeOperatorId, 'NodeOperatorId is required');

  const contract = useCSAccountingRPC();
  const result = useContractSWR({
    contract,
    method: METHOD_BY_TOKEN[token],
    params: [nodeOperatorId, keysCount],
    shouldFetch: keysCount > 0,
    config,
  });

  return { ...result, data: keysCount > 0 ? result.data : Zero };
};
