'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helpers = require('@lido-sdk/helpers');
var react = require('react');
var useSDK = require('./useSDK.js');

const useEtherscanOpen = (hash, entity) => {
    const { chainId } = useSDK.useSDK();
    return react.useCallback(() => {
        const link = helpers.getEtherscanLink(chainId, hash, entity);
        helpers.openWindow(link);
    }, [chainId, entity, hash]);
};

exports.useEtherscanOpen = useEtherscanOpen;
