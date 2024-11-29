import { useEthereumSWR } from '@lido-sdk/react';
import { SPLITTER_CONTRACT_CODES } from 'consts/splitter';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';

export const useAccountCode = (account?: string | null) => {
  return useEthereumSWR({
    shouldFetch: !!account,
    method: 'getCode',
    params: [account, 'latest'],
    config: STRATEGY_IMMUTABLE,
  });
};

export const useIsContract = (
  account?: string | null,
): { isLoading: boolean; isContract: boolean; isSplitter?: boolean } => {
  // eth_getCode returns hex string of bytecode at address
  // for accounts it's "0x"
  // for contract it's potentially very long hex (can't be safely&quickly parsed)
  const { data: code, initialLoading: isLoading } = useEthereumSWR({
    shouldFetch: !!account,
    method: 'getCode',
    params: [account, 'latest'],
    config: STRATEGY_IMMUTABLE,
  });

  return useMemo(
    () => ({
      isLoading,
      isContract: code ? code !== '0x' : false,
      isSplitter: code ? SPLITTER_CONTRACT_CODES.includes(code) : false,
    }),
    [code, isLoading],
  );
};
