'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var bignumber = require('@ethersproject/bignumber');
var contracts = require('@lido-sdk/contracts');
var constants = require('@lido-sdk/constants');
var helpers = require('@lido-sdk/helpers');
var useSDK = require('./useSDK.js');
var useLidoSWR = require('./useLidoSWR.js');

const useEthPrice = (config) => {
    const { providerMainnetRpc } = useSDK.useSDK();
    const address = constants.getAggregatorAddress(constants.CHAINS.Mainnet);
    const aggregatorContract = contracts.getAggregatorContract(address, providerMainnetRpc);
    return useLidoSWR.useLidoSWR(['lido-swr:eth-price', aggregatorContract], () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
        const [decimals, latestAnswer] = yield Promise.all([
            aggregatorContract.decimals(),
            aggregatorContract.latestAnswer(),
        ]);
        return helpers.divide(latestAnswer, bignumber.BigNumber.from(10).pow(decimals));
    }), config);
};

exports.useEthPrice = useEthPrice;
