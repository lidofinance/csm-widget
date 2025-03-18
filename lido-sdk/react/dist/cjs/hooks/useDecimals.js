'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('tiny-invariant');
var contracts = require('@lido-sdk/contracts');
var useContractSWR = require('./useContractSWR.js');
var useSDK = require('./useSDK.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const useDecimals = (token, config) => {
    const { providerRpc } = useSDK.useSDK();
    invariant__default["default"](token != null, 'Token address is required');
    const contract = contracts.getERC20Contract(token, providerRpc);
    const result = useContractSWR.useContractSWR({ contract, method: 'decimals', config });
    return result;
};

exports.useDecimals = useDecimals;
