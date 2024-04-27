import { useContractSWR } from '@lido-sdk/react';
import { TOKENS } from 'shared/hook-form/controls/token-select-hook-form';
import { useCSAccountingRPC } from 'shared/hooks';
import invariant from 'tiny-invariant';

const METHOD_BY_TOKEN = {
  [TOKENS.ETH]: 'getBondAmountByKeysCount(uint256)',
  [TOKENS.STETH]: 'getBondAmountByKeysCount(uint256)',
  [TOKENS.WSTETH]: 'getBondAmountByKeysCountWstETH(uint256)',
} as const;

type UseReadBondAmountParams = { keysCount: number; token: TOKENS };

export const useReadBondAmount = ({
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

  return result;
};
