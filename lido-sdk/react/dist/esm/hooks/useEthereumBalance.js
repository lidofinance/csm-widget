import warning from 'tiny-warning';
import { useEffect } from 'react';
import { useSDK } from './useSDK.js';
import { useEthereumSWR } from './useEthereumSWR.js';
import { useDebounceCallback } from './useDebounceCallback.js';

const useEthereumBalance = (account, config) => {
    const { providerWeb3, account: sdkAccount } = useSDK();
    const mergedAccount = account !== null && account !== void 0 ? account : sdkAccount;
    const result = useEthereumSWR({
        shouldFetch: !!mergedAccount,
        method: 'getBalance',
        params: [mergedAccount, 'latest'],
        config,
    });
    const updateBalanceDebounced = useDebounceCallback(result.update, 1000);
    useEffect(() => {
        if (!mergedAccount || !providerWeb3)
            return;
        try {
            providerWeb3.on('block', updateBalanceDebounced);
            return () => {
                providerWeb3.off('block', updateBalanceDebounced);
            };
        }
        catch (error) {
            return warning(false, 'Cannot subscribe to Block event');
        }
    }, [providerWeb3, mergedAccount, updateBalanceDebounced]);
    return result;
};

export { useEthereumBalance };
