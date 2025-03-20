'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('@lido-sdk/constants');
var useSDK = require('./useSDK.js');

const useTokenAddress = (token) => {
    const { chainId } = useSDK.useSDK();
    return constants.getTokenAddress(chainId, token);
};

exports.useTokenAddress = useTokenAddress;
