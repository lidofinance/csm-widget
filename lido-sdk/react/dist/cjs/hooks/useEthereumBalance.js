'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var warning = require('tiny-warning');
var react = require('react');
var useSDK = require('./useSDK.js');
var useEthereumSWR = require('./useEthereumSWR.js');
var useDebounceCallback = require('./useDebounceCallback.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning);

const useEthereumBalance = (account, config) => {
    const { providerWeb3, account: sdkAccount } = useSDK.useSDK();
    const mergedAccount = account !== null && account !== void 0 ? account : sdkAccount;
    const result = useEthereumSWR.useEthereumSWR({
        shouldFetch: !!mergedAccount,
        method: 'getBalance',
        params: [mergedAccount, 'latest'],
        config,
    });
    const updateBalanceDebounced = useDebounceCallback.useDebounceCallback(result.update, 1000);
    react.useEffect(() => {
        if (!mergedAccount || !providerWeb3)
            return;
        try {
            providerWeb3.on('block', updateBalanceDebounced);
            return () => {
                providerWeb3.off('block', updateBalanceDebounced);
            };
        }
        catch (error) {
            return warning__default["default"](false, 'Cannot subscribe to Block event');
        }
    }, [providerWeb3, mergedAccount, updateBalanceDebounced]);
    return result;
};

exports.useEthereumBalance = useEthereumBalance;
