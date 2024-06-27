import { useContractSWR } from '@lido-sdk/react';
import { TOKENS } from 'consts/tokens';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
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
  keysCount: number;
  token: TOKENS;
};

export const useNodeOperatorNextKeysBond = ({
  nodeOperatorId,
  keysCount,
  token,
}: UseReadAdditionalBondAmountParams) => {
  invariant(token, 'Token is required');
  invariant(keysCount !== undefined, 'KeysCount is required');
  invariant(nodeOperatorId, 'BodeOperatorId is required');

  const contract = useCSAccountingRPC();
  const result = useContractSWR({
    contract,
    method: METHOD_BY_TOKEN[token],
    params: [nodeOperatorId, keysCount],
    shouldFetch: keysCount > 0,
  });

  /**
   * add 10 wei for approve/permit request
   */
  let { data } = result;
  if (token !== TOKENS.ETH && data?.gt(0)) {
    data = data.add(ROUNDING_TRESHOLD);
  }

  return { ...result, data };
};
