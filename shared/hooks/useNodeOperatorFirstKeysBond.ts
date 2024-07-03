import { Zero } from '@ethersproject/constants';
import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useCSAccountingRPC } from 'shared/hooks';
import { addExtraWei } from 'utils';

const METHOD_BY_TOKEN = {
  [TOKENS.ETH]: 'getBondAmountByKeysCount(uint256,uint256)',
  [TOKENS.STETH]: 'getBondAmountByKeysCount(uint256,uint256)',
  [TOKENS.WSTETH]: 'getBondAmountByKeysCountWstETH(uint256,uint256)',
} as const;

type UseReadBondAmountParams = {
  keysCount?: number;
  token?: TOKENS;
  curveId?: BigNumber;
};

export const useNodeOperatorFirstKeysBond = (
  { keysCount = 0, token = TOKENS.STETH, curveId }: UseReadBondAmountParams,
  config = STRATEGY_IMMUTABLE,
) => {
  const result = useContractSWR({
    contract: useCSAccountingRPC(),
    method: METHOD_BY_TOKEN[token],
    params: [keysCount, curveId],
    shouldFetch: keysCount > 0 && curveId !== undefined,
    config,
  });

  const amount = addExtraWei(result.data, token);

  return { ...result, data: keysCount > 0 ? amount : Zero };
};
