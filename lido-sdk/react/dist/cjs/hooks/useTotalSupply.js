'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('tiny-invariant');
var warning = require('tiny-warning');
var react = require('react');
var contracts = require('@lido-sdk/contracts');
var useContractSWR = require('./useContractSWR.js');
var useSDK = require('./useSDK.js');
var useDebounceCallback = require('./useDebounceCallback.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);
var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning);

const useTotalSupply = (token, config) => {
    const { providerRpc, providerWeb3 } = useSDK.useSDK();
    invariant__default["default"](token != null, 'Token is required');
    const contractRpc = contracts.getERC20Contract(token, providerRpc);
    const contractWeb3 = providerWeb3
        ? contracts.getERC20Contract(token, providerWeb3)
        : null;
    const result = useContractSWR.useContractSWR({
        contract: contractRpc,
        method: 'totalSupply',
        config,
    });
    const updateSupplyDebounced = useDebounceCallback.useDebounceCallback(result.update, 1000);
    react.useEffect(() => {
        if (!providerWeb3 || !contractWeb3)
            return;
        try {
            const transfer = contractWeb3.filters.Transfer();
            providerWeb3.on(transfer, updateSupplyDebounced);
            return () => {
                providerWeb3.off(transfer, updateSupplyDebounced);
            };
        }
        catch (error) {
            return warning__default["default"](false, 'Cannot subscribe to events');
        }
    }, [providerWeb3, contractWeb3, updateSupplyDebounced]);
    return result;
};

exports.useTotalSupply = useTotalSupply;
