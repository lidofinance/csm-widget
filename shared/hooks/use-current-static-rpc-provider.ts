import { useMemo } from 'react';
import { Config, useClient } from 'wagmi';

import invariant from 'tiny-invariant';
import { getStaticRpcBatchProvider } from 'utils/getStaticRpcBatchProvider';

export const useCurrentStaticRpcProvider = () => {
  const client = useClient<Config>();
  return useMemo(() => {
    invariant(client, 'client not defined');

    const { chain, transport } = client;

    if (transport.type === 'fallback')
      return getStaticRpcBatchProvider(
        chain.id,
        transport.transports[0].value.url,
      );
    return getStaticRpcBatchProvider(chain.id, transport.url);
  }, [client]);
};
