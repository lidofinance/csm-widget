'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('tiny-invariant');
var useLidoSWR = require('./useLidoSWR.js');
var useSDK = require('./useSDK.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const useEthereumSWR = (props) => {
    var _a;
    const { shouldFetch = true, params = [], method, config } = props;
    const providerRpcFromSdk = useSDK.useSDK().providerRpc;
    const providerRpc = (_a = props.providerRpc) !== null && _a !== void 0 ? _a : providerRpcFromSdk;
    invariant__default["default"](providerRpc != null, 'RPC Provider is not provided');
    invariant__default["default"](method != null, 'Method is required');
    return useLidoSWR.useLidoSWR(shouldFetch ? [providerRpc, method, ...params] : null, (providerRpc, method, ...params) => {
        return providerRpc[method](...params);
    }, config);
};

exports.useEthereumSWR = useEthereumSWR;
