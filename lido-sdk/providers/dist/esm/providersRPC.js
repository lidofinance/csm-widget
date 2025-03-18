import { JsonRpcProvider, JsonRpcBatchProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { StaticJsonRpcBatchProvider } from './staticJsonRpcBatchProvider.js';

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
const getRpcProvider = createProviderGetter(JsonRpcProvider);
const getRpcBatchProvider = createProviderGetter(JsonRpcBatchProvider);
const getStaticRpcProvider = createProviderGetter(StaticJsonRpcProvider);
const getStaticRpcBatchProvider = createProviderGetter(StaticJsonRpcBatchProvider);

export { getRpcBatchProvider, getRpcProvider, getStaticRpcBatchProvider, getStaticRpcProvider };
