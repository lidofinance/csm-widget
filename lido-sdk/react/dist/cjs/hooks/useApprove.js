'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var invariant = require('tiny-invariant');
var react = require('react');
var contracts = require('@lido-sdk/contracts');
var useSDK = require('./useSDK.js');
var useMountedState = require('./useMountedState.js');
var useAllowance = require('./useAllowance.js');
var constants = require('@ethersproject/constants');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const defaultWrapper = (callback) => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield callback();
    return yield transaction.wait();
});
const useApprove = (amount, token, spender, owner, wrapper = defaultWrapper) => {
    const { providerWeb3, account, onError } = useSDK.useSDK();
    const mergedOwner = owner !== null && owner !== void 0 ? owner : account;
    invariant__default["default"](token != null, 'Token is required');
    invariant__default["default"](spender != null, 'Spender is required');
    const [approving, setApproving] = useMountedState.useMountedState(false);
    const result = useAllowance.useAllowance(token, spender, mergedOwner);
    const { data: allowance = constants.Zero, initialLoading, update: updateAllowance, } = result;
    const needsApprove = !initialLoading && !amount.isZero() && amount.gt(allowance);
    const approve = react.useCallback(() => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
        invariant__default["default"](providerWeb3 != null, 'Web3 provider is required');
        const contractWeb3 = contracts.getERC20Contract(token, providerWeb3.getSigner());
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

exports.useApprove = useApprove;
