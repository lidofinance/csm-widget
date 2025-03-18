'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers = require('@ethersproject/providers');
var staticJsonRpcBatchProvider = require('./staticJsonRpcBatchProvider.js');

const createProviderGetter = (Provider) => {
    const cache = new Map();
    return (chainId, url, cacheSeed = 0, pollingInterval = null) => {
        const cacheKey = `${chainId}-${cacheSeed}-${url}`;
        let provider = cache.get(cacheKey);
        if (!provider) {
            provider = new Provider(url, chainId);
            cache.set(cacheKey, provider);
        }
        if (pollingInterval) {
            provider.pollingInterval = pollingInterval;
        }
        return provider;
    };
};
const getRpcProvider = createProviderGetter(providers.JsonRpcProvider);
const getRpcBatchProvider = createProviderGetter(providers.JsonRpcBatchProvider);
const getStaticRpcProvider = createProviderGetter(providers.StaticJsonRpcProvider);
const getStaticRpcBatchProvider = createProviderGetter(staticJsonRpcBatchProvider.StaticJsonRpcBatchProvider);

exports.getRpcBatchProvider = getRpcBatchProvider;
exports.getRpcProvider = getRpcProvider;
exports.getStaticRpcBatchProvider = getStaticRpcBatchProvider;
exports.getStaticRpcProvider = getStaticRpcProvider;
