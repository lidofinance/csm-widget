import { jsx } from 'react/jsx-runtime';
import invariant from 'tiny-invariant';
import { getDefaultProvider, getNetwork } from '@ethersproject/providers';
import { memo, createContext, useMemo } from 'react';

const SDKContext = createContext(null);
SDKContext.displayName = 'LidoSDKContext';
const ProviderSDK = (props) => {
    const { children, account, chainId, supportedChainIds, providerWeb3, swrConfig, } = props;
    invariant(chainId, 'invalid chainId');
    invariant(supportedChainIds === null || supportedChainIds === void 0 ? void 0 : supportedChainIds.length, 'Supported chains are required');
    const providerRpc = useMemo(() => {
        var _a;
        return (_a = props.providerRpc) !== null && _a !== void 0 ? _a : getDefaultProvider(getNetwork(chainId));
    }, [props.providerRpc, chainId]);
    const providerMainnetRpc = useMemo(() => {
        var _a;
        return (_a = props.providerMainnetRpc) !== null && _a !== void 0 ? _a : getDefaultProvider('mainnet');
    }, [props.providerMainnetRpc]);
    const onError = useMemo(() => {
        var _a;
        return (_a = props.onError) !== null && _a !== void 0 ? _a : console.error;
    }, [props.onError]);
    const value = useMemo(() => ({
        account,
        chainId,
        supportedChainIds,
        providerMainnetRpc,
        providerRpc,
        providerWeb3,
        swrConfig,
        onError,
    }), [
        account,
        chainId,
        supportedChainIds,
        providerMainnetRpc,
        providerRpc,
        providerWeb3,
        swrConfig,
        onError,
    ]);
    return jsx(SDKContext.Provider, Object.assign({ value: value }, { children: children }), void 0);
};
var SDK = memo(ProviderSDK);

export { SDKContext, SDK as default };
