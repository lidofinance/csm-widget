import { getTokenAddress } from '@lido-sdk/constants';
import { useSDK } from './useSDK.js';

const useTokenAddress = (token) => {
    const { chainId } = useSDK();
    return getTokenAddress(chainId, token);
};

export { useTokenAddress };
