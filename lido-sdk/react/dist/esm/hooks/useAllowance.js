import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { useEffect } from 'react';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR.js';
import { useSDK } from './useSDK.js';
import { useDebounceCallback } from './useDebounceCallback.js';

const useAllowance = (token, spender, owner, config) => {
    const { providerRpc, providerWeb3, account } = useSDK();
    const mergedOwner = owner !== null && owner !== void 0 ? owner : account;
    invariant(token != null, 'Token is required');
    invariant(spender != null, 'Spender is required');
    const contractRpc = getERC20Contract(token, providerRpc);
    const contractWeb3 = providerWeb3
        ? getERC20Contract(token, providerWeb3)
        : null;
    const result = useContractSWR({
        shouldFetch: !!mergedOwner,
        contract: contractRpc,
        method: 'allowance',
        params: [mergedOwner, spender],
        config,
    });
    const updateAllowanceDebounced = useDebounceCallback(result.update, 1000);
    useEffect(() => {
        if (!mergedOwner || !providerWeb3 || !contractWeb3)
            return;
        try {
            const transfer = contractWeb3.filters.Transfer(mergedOwner, spender);
            const approve = contractWeb3.filters.Approval(mergedOwner, spender);
            providerWeb3.on(transfer, updateAllowanceDebounced);
            providerWeb3.on(approve, updateAllowanceDebounced);
            return () => {
                providerWeb3.off(transfer, updateAllowanceDebounced);
                providerWeb3.off(approve, updateAllowanceDebounced);
            };
        }
        catch (error) {
            return warning(false, 'Cannot subscribe to event');
        }
    }, [
        contractWeb3,
        mergedOwner,
        providerWeb3,
        updateAllowanceDebounced,
        spender,
    ]);
    return result;
};

export { useAllowance };
