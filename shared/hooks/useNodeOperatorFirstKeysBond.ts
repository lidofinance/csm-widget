import { useContractSWR } from '@lido-sdk/react';
import { TOKENS } from 'consts/tokens';
import { useCSAccountingRPC } from 'shared/hooks';
import invariant from 'tiny-invariant';

const METHOD_BY_TOKEN = {
  [TOKENS.ETH]: 'getBondAmountByKeysCount(uint256)',
  [TOKENS.STETH]: 'getBondAmountByKeysCount(uint256)',
  [TOKENS.WSTETH]: 'getBondAmountByKeysCountWstETH(uint256)',
} as const;

type UseReadBondAmountParams = { keysCount: number; token: TOKENS };

export const useNodeOperatorFirstKeysBond = ({
  keysCount,
  token,
}: UseReadBondAmountParams) => {
  invariant(token !== undefined, 'Token is required');
  invariant(keysCount !== undefined, 'KeysCount is required');

  const contract = useCSAccountingRPC();
  const result = useContractSWR({
    contract,
    method: METHOD_BY_TOKEN[token],
    params: [keysCount],
    shouldFetch: keysCount > 0,
  });

  /**
   * add 10 wei for approve/permit request
   */
  let { data } = result;
  if (token !== TOKENS.ETH && data?.gt(0)) {
    data = data.add(10);
  }

  return { ...result, data };
};
