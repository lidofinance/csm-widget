'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var bignumber = require('@ethersproject/bignumber');
var constants = require('@ethersproject/constants');
var helpers = require('@lido-sdk/helpers');
var react = require('react');
var useEthereumSWR = require('./useEthereumSWR.js');
var useEthPrice = require('./useEthPrice.js');

const getTxPrice = (gasLimit, ethPrice, gasPrice) => {
    if (!gasLimit || ethPrice == null || gasPrice == null) {
        return undefined;
    }
    const txCostInWei = gasPrice.mul(bignumber.BigNumber.from(gasLimit));
    const txCostInEth = helpers.divide(txCostInWei, constants.WeiPerEther);
    return ethPrice * txCostInEth;
};
const useTxPrice = (gasLimit) => {
    const eth = useEthPrice.useEthPrice();
    const gas = useEthereumSWR.useEthereumSWR({ method: 'getGasPrice' });
    const ethPrice = eth.data;
    const gasPrice = gas.data;
    const data = react.useMemo(() => {
        return getTxPrice(gasLimit, ethPrice, gasPrice);
    }, [gasLimit, ethPrice, gasPrice]);
    const updateEth = eth.update;
    const updateGas = gas.update;
    const update = react.useCallback(() => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
        const [ethPrice, gasPrice] = yield Promise.all([updateEth(), updateGas()]);
        return getTxPrice(gasLimit, ethPrice, gasPrice);
    }), [gasLimit, updateEth, updateGas]);
    return {
        update,
        data,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get loading() {
            return eth.loading || gas.loading;
        },
        get initialLoading() {
            return eth.initialLoading || gas.initialLoading;
        },
        get error() {
            return eth.error || gas.error;
        },
    };
};

exports.useTxPrice = useTxPrice;
