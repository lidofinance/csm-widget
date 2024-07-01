import { useContractSWR } from '@lido-sdk/react';
import { TOKENS } from 'consts/tokens';
import { ROUNDING_TRESHOLD } from 'consts/treshhold';
import { BigNumber } from 'ethers';
import { useCSAccountingRPC } from 'shared/hooks';
import invariant from 'tiny-invariant';

const METHOD_BY_TOKEN = {
  [TOKENS.ETH]: 'getBondAmountByKeysCount(uint256,uint256)',
  [TOKENS.STETH]: 'getBondAmountByKeysCount(uint256,uint256)',
  [TOKENS.WSTETH]: 'getBondAmountByKeysCountWstETH(uint256,uint256)',
} as const;

type UseReadBondAmountParams = {
  keysCount: number;
  token: TOKENS;
  curveId?: BigNumber;
};

export const useNodeOperatorFirstKeysBond = ({
  keysCount,
  token,
  curveId,
}: UseReadBondAmountParams) => {
  invariant(token !== undefined, 'Token is required');
  invariant(keysCount !== undefined, 'KeysCount is required');

  const result = useContractSWR({
    contract: useCSAccountingRPC(),
    method: METHOD_BY_TOKEN[token],
    params: [keysCount, curveId],
    shouldFetch: keysCount > 0 && curveId !== undefined,
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
