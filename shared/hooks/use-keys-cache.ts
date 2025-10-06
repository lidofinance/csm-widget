import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';

export const useKeysCache = () => {
  const {
    csm: { keysCache },
  } = useLidoSDK();

  const addCachePubkeys = useCallback(
    (publicKeys: string[]) => {
      keysCache.addPubkeys(publicKeys);
    },
    [keysCache],
  );

  const removeCachePubkeys = useCallback(
    (publicKeys: string[]) => {
      keysCache.removePubkeys(publicKeys);
    },
    [keysCache],
  );

  return {
    addCachePubkeys,
    removeCachePubkeys,
  };
};
