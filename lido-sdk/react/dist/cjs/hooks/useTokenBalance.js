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

const useTokenBalance = (token, account, config) => {
    const { providerRpc, providerWeb3, account: sdkAccount } = useSDK.useSDK();
    const mergedAccount = account !== null && account !== void 0 ? account : sdkAccount;
    invariant__default["default"](token != null, 'Token is required');
    const contractRpc = contracts.getERC20Contract(token, providerRpc);
    const contractWeb3 = providerWeb3
        ? contracts.getERC20Contract(token, providerWeb3)
        : null;
    const result = useContractSWR.useContractSWR({
        shouldFetch: !!mergedAccount,
        contract: contractRpc,
        method: 'balanceOf',
        params: [mergedAccount],
        config,
    });
    const updateBalanceDebounced = useDebounceCallback.useDebounceCallback(result.update, 1000);
    react.useEffect(() => {
        if (!mergedAccount || !providerWeb3 || !contractWeb3)
            return;
        try {
            const fromMe = contractWeb3.filters.Transfer(mergedAccount, null);
            const toMe = contractWeb3.filters.Transfer(null, mergedAccount);
            providerWeb3.on(fromMe, updateBalanceDebounced);
            providerWeb3.on(toMe, updateBalanceDebounced);
            return () => {
                providerWeb3.off(fromMe, updateBalanceDebounced);
                providerWeb3.off(toMe, updateBalanceDebounced);
            };
        }
        catch (error) {
            return warning__default["default"](false, 'Cannot subscribe to events');
        }
    }, [providerWeb3, contractWeb3, mergedAccount, updateBalanceDebounced]);
    return result;
};

exports.useTokenBalance = useTokenBalance;
