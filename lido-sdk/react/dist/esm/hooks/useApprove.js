import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useSDK } from './useSDK.js';
import { useMountedState } from './useMountedState.js';
import { useAllowance } from './useAllowance.js';
import { Zero } from '@ethersproject/constants';

const defaultWrapper = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield callback();
    return yield transaction.wait();
});
const useApprove = (amount, token, spender, owner, wrapper = defaultWrapper) => {
    const { providerWeb3, account, onError } = useSDK();
    const mergedOwner = owner !== null && owner !== void 0 ? owner : account;
    invariant(token != null, 'Token is required');
    invariant(spender != null, 'Spender is required');
    const [approving, setApproving] = useMountedState(false);
    const result = useAllowance(token, spender, mergedOwner);
    const { data: allowance = Zero, initialLoading, update: updateAllowance, } = result;
    const needsApprove = !initialLoading && !amount.isZero() && amount.gt(allowance);
    const approve = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        invariant(providerWeb3 != null, 'Web3 provider is required');
        const contractWeb3 = getERC20Contract(token, providerWeb3.getSigner());
        setApproving(true);
        try {
            yield wrapper(() => contractWeb3.approve(spender, amount));
            yield updateAllowance();
        }
        catch (error) {
            onError(error);
        }
        finally {
            setApproving(false);
        }
    }), [
        providerWeb3,
        token,
        spender,
        amount,
        wrapper,
        setApproving,
        updateAllowance,
        onError,
    ]);
    return {
        approve,
        approving,
        needsApprove,
        allowance,
        initialLoading,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get loading() {
            return result.loading;
        },
        get error() {
            return result.error;
        },
    };
};

export { useApprove };
