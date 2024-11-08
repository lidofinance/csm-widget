import { useEthereumSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';

const SPLITTER_CONTRACT_CODES = [
  '0x36602c57343d527f9e4ac34f21c619cefc926c8bd93b54bf5a39c7ab2127a895af1cc0691d7e3dff593da1005b3d3d3d3d363d3d37363d736291497d1206618fc810900d2e7e9af6aa1f1b995af43d3d93803e605757fd5bf3',
];

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
