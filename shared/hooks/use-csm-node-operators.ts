import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorsFetcherFromEvents } from './use-node-operators-fetcher-from-events';
import { useAccount } from './use-account';

export const useCsmNodeOperators = () => {
  const { chainId, address } = useAccount();
  const fetcher = useNodeOperatorsFetcherFromEvents(address, chainId);

  return useLidoSWR(
    ['no-list', address, chainId],
    address && chainId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
