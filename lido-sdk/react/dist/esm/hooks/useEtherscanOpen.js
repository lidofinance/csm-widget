import { getEtherscanLink, openWindow } from '@lido-sdk/helpers';
import { useCallback } from 'react';
import { useSDK } from './useSDK.js';

const useEtherscanOpen = (hash, entity) => {
    const { chainId } = useSDK();
    return useCallback(() => {
        const link = getEtherscanLink(chainId, hash, entity);
        openWindow(link);
    }, [chainId, entity, hash]);
};

export { useEtherscanOpen };
