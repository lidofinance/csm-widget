'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var invariant = require('tiny-invariant');
var providers = require('@ethersproject/providers');
var react = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const SDKContext = react.createContext(null);
SDKContext.displayName = 'LidoSDKContext';
const ProviderSDK = (props) => {
    const { children, account, chainId, supportedChainIds, providerWeb3, swrConfig, } = props;
    invariant__default["default"](chainId, 'invalid chainId');
    invariant__default["default"](supportedChainIds === null || supportedChainIds === void 0 ? void 0 : supportedChainIds.length, 'Supported chains are required');
    const providerRpc = react.useMemo(() => {
        var _a;
        return (_a = props.providerRpc) !== null && _a !== void 0 ? _a : providers.getDefaultProvider(providers.getNetwork(chainId));
    }, [props.providerRpc, chainId]);
    const providerMainnetRpc = react.useMemo(() => {
        var _a;
        return (_a = props.providerMainnetRpc) !== null && _a !== void 0 ? _a : providers.getDefaultProvider('mainnet');
    }, [props.providerMainnetRpc]);
    const onError = react.useMemo(() => {
        var _a;
        return (_a = props.onError) !== null && _a !== void 0 ? _a : console.error;
    }, [props.onError]);
    const value = react.useMemo(() => ({
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
    return jsxRuntime.jsx(SDKContext.Provider, Object.assign({ value: value }, { children: children }), void 0);
};
var SDK = react.memo(ProviderSDK);

exports.SDKContext = SDKContext;
exports["default"] = SDK;
