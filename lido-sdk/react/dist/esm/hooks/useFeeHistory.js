import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import { useCallback, useEffect } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { hexValue } from '@ethersproject/bytes';
import { useSDK } from './useSDK.js';
import { useLidoSWR } from './useLidoSWR.js';
import { useDebounceCallback } from './useDebounceCallback.js';

const MAX_BLOCKS_PER_REQUEST = 1024;
const DEFAULT_HISTORY_BLOCKS = MAX_BLOCKS_PER_REQUEST;
const DEFAULT_CACHE_DATA = Object.freeze({
    oldestBlock: -1,
    baseFeePerGas: Object.freeze([]),
    gasUsedRatio: Object.freeze([]),
});
const historyCache = new Map();
const getBlockNumber = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedNumber = provider.blockNumber;
    return cachedNumber === -1 ? yield provider.getBlockNumber() : cachedNumber;
});
const getChunksArguments = (fromBlock, toBlock, chunkSize = MAX_BLOCKS_PER_REQUEST) => {
    invariant(fromBlock <= toBlock, 'fromBlock should be less than or equal to toBlock');
    invariant(chunkSize > 0, 'chunkSize should be greater than 0');
    const totalBlocks = toBlock - fromBlock + 1;
    const totalChunks = Math.ceil(totalBlocks / chunkSize);
    return Array.from({ length: totalChunks }, (_value, index) => {
        const newestBlock = toBlock - chunkSize * index;
        const blocks = Math.min(1 + newestBlock - fromBlock, chunkSize);
        return [blocks, hexValue(BigNumber.from(newestBlock)), []];
    }).reverse();
};
const combineHistory = (...histories) => {
    histories.forEach((currentHistory, index) => {
        if (index === 0)
            return;
        const previousHistory = histories[index - 1];
        invariant(currentHistory.oldestBlock ===
            previousHistory.oldestBlock + previousHistory.baseFeePerGas.length - 1, 'Histories cannot be merged');
    }, []);
    const lastHistory = histories[histories.length - 1];
    const lastHistoryFees = lastHistory.baseFeePerGas;
    const lastFeePerGas = lastHistoryFees[lastHistoryFees.length - 1];
    const oldestBlock = histories[0].oldestBlock;
    const baseFeePerGas = histories
        .flatMap(({ baseFeePerGas }) => baseFeePerGas.slice(0, -1))
        .concat(lastFeePerGas);
    const gasUsedRatio = histories.flatMap(({ gasUsedRatio }) => gasUsedRatio);
    return {
        oldestBlock,
        baseFeePerGas,
        gasUsedRatio,
    };
};
const trimHistory = (history, blocks) => {
    invariant(blocks > 0, 'blocks number should be greater than 0');
    const currentBlocks = history.gasUsedRatio.length;
    const trimmedBlocks = Math.max(0, currentBlocks - blocks);
    const oldestBlock = history.oldestBlock + trimmedBlocks;
    const baseFeePerGas = history.baseFeePerGas.slice(-(blocks + 1));
    const gasUsedRatio = history.gasUsedRatio.slice(-blocks);
    return {
        oldestBlock,
        baseFeePerGas,
        gasUsedRatio,
    };
};
const getFeeHistory = (provider, fromBlock, toBlock, chunkSize) => __awaiter(void 0, void 0, void 0, function* () {
    const chunksArgs = getChunksArguments(fromBlock, toBlock, chunkSize);
    const histories = yield Promise.all(chunksArgs.map((args) => {
        return provider.send('eth_feeHistory', args);
    }));
    const convertedHistories = histories.map((history) => (Object.assign(Object.assign({}, history), { oldestBlock: BigNumber.from(history.oldestBlock).toNumber(), baseFeePerGas: history.baseFeePerGas.map((fee) => BigNumber.from(fee)) })));
    return combineHistory(...convertedHistories);
});
const useFeeHistory = (props) => {
    var _a, _b;
    const { shouldFetch = true, blocks = DEFAULT_HISTORY_BLOCKS, config, } = props || {};
    const providerRpcFromSdk = useSDK().providerRpc;
    const providerRpc = (_a = props === null || props === void 0 ? void 0 : props.providerRpc) !== null && _a !== void 0 ? _a : providerRpcFromSdk;
    const providerWeb3FromSdk = useSDK().providerWeb3;
    const providerWeb3 = (_b = props === null || props === void 0 ? void 0 : props.providerWeb3) !== null && _b !== void 0 ? _b : providerWeb3FromSdk;
    const { chainId } = useSDK();
    invariant(providerRpc != null, 'RPC Provider is not provided');
    invariant(blocks > 0, 'blocks number should be greater than 0');
    const result = useLidoSWR(shouldFetch ? [providerRpc, chainId, blocks] : null, (providerRpc, chainId, blocks) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const currentBlock = yield getBlockNumber(providerRpc);
        const cachedHistory = (_c = historyCache.get(chainId)) !== null && _c !== void 0 ? _c : DEFAULT_CACHE_DATA;
        const oldestCachedBlock = cachedHistory.oldestBlock;
        const blocksInCache = cachedHistory.gasUsedRatio.length;
        const newestCachedBlock = blocksInCache
            ? oldestCachedBlock + blocksInCache - 1
            : -1;
        const firstRequiredBlock = currentBlock - blocks + 1;
        if (blocksInCache && newestCachedBlock >= currentBlock) {
            return cachedHistory;
        }
        const fromBlock = Math.max(newestCachedBlock + 1, firstRequiredBlock);
        const toBlock = currentBlock;
        const newHistory = yield getFeeHistory(providerRpc, fromBlock, toBlock);
        const shouldCombine = blocksInCache
            ? newestCachedBlock < newHistory.oldestBlock
            : false;
        const combinedHistory = shouldCombine
            ? combineHistory(cachedHistory, newHistory)
            : newHistory;
        const trimmedHistory = trimHistory(combinedHistory, blocks);
        historyCache.set(chainId, trimmedHistory);
        return trimmedHistory;
    }), config);
    const updateHistory = useDebounceCallback(result.update);
    const subscribeToUpdates = useCallback(() => {
        const provider = providerWeb3 || providerRpc;
        try {
            provider.on('block', updateHistory);
            return () => {
                provider.off('block', updateHistory);
            };
        }
        catch (error) {
            return warning(false, 'Cannot subscribe to Block event');
        }
    }, [providerRpc, providerWeb3, updateHistory]);
    useEffect(subscribeToUpdates, [subscribeToUpdates]);
    return result;
};

export { combineHistory, getBlockNumber, getChunksArguments, getFeeHistory, historyCache, trimHistory, useFeeHistory };
