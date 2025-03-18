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

const useAllowance = (token, spender, owner, config) => {
    const { providerRpc, providerWeb3, account } = useSDK.useSDK();
    const mergedOwner = owner !== null && owner !== void 0 ? owner : account;
    invariant__default["default"](token != null, 'Token is required');
    invariant__default["default"](spender != null, 'Spender is required');
    const contractRpc = contracts.getERC20Contract(token, providerRpc);
    const contractWeb3 = providerWeb3
        ? contracts.getERC20Contract(token, providerWeb3)
        : null;
    const result = useContractSWR.useContractSWR({
        shouldFetch: !!mergedOwner,
        contract: contractRpc,
        method: 'allowance',
        params: [mergedOwner, spender],
        config,
    });
    const updateAllowanceDebounced = useDebounceCallback.useDebounceCallback(result.update, 1000);
    react.useEffect(() => {
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
            return warning__default["default"](false, 'Cannot subscribe to event');
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

exports.useAllowance = useAllowance;
