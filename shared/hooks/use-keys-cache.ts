import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { Hex } from 'viem';

// TODO: review
export const useKeysCache = () => {
  const {
    csm: { keysCache },
  } = useLidoSDK();

  const addCachePubkeys = useCallback(
    (publicKeys: Hex[]) => {
      keysCache.addPubkeys(publicKeys);
    },
    [keysCache],
  );

  const removeCachePubkeys = useCallback(
    (publicKeys: Hex[]) => {
      keysCache.removePubkeys(publicKeys);
    },
    [keysCache],
  );

  return {
    addCachePubkeys,
    removeCachePubkeys,
  };
};
