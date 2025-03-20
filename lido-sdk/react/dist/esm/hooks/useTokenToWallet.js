import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useCallback } from 'react';
import { useSDK } from './useSDK.js';
import { useMountedState } from './useMountedState.js';

const useTokenToWallet = (address, image) => {
    const [loading, setLoading] = useMountedState(false);
    const { providerRpc, providerWeb3, onError } = useSDK();
    const handleAdd = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        const provider = providerWeb3 === null || providerWeb3 === void 0 ? void 0 : providerWeb3.provider;
        if (!(provider === null || provider === void 0 ? void 0 : provider.request))
            return false;
        try {
            setLoading(true);
            const contract = getERC20Contract(address, providerRpc);
            const [symbol, decimals] = yield Promise.all([
                contract.symbol(),
                contract.decimals(),
            ]);
            const result = yield provider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address,
                        symbol,
                        decimals,
                        image,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                },
            });
            return !!result;
        }
        catch (error) {
            onError(error);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [address, image, providerWeb3, providerRpc, setLoading, onError]);
    const canAdd = !!(providerWeb3 === null || providerWeb3 === void 0 ? void 0 : providerWeb3.provider.isMetaMask);
    const addToken = canAdd ? handleAdd : undefined;
    return {
        addToken,
        loading,
    };
};

export { useTokenToWallet };
