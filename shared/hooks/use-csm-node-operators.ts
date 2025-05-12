import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorsFetcherFromEvents } from './use-node-operators-fetcher-from-events';
import { useAccount } from './use-account';

export const useCsmNodeOperators = () => {
  const { address } = useAccount();
  const fetcher = useNodeOperatorsFetcherFromEvents(address);

  return useLidoSWR(
    ['no-list', address],
    address ? fetcher : null,
    STRATEGY_LAZY,
  );
};
