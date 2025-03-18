import { CHAINS } from '@lido-sdk/constants';
import { JsonRpcProvider, JsonRpcBatchProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { StaticJsonRpcBatchProvider } from './staticJsonRpcBatchProvider';
export declare const getRpcProvider: (chainId: CHAINS, url: string, cacheSeed?: number, pollingInterval?: number | null) => JsonRpcProvider;
export declare const getRpcBatchProvider: (chainId: CHAINS, url: string, cacheSeed?: number, pollingInterval?: number | null) => JsonRpcBatchProvider;
export declare const getStaticRpcProvider: (chainId: CHAINS, url: string, cacheSeed?: number, pollingInterval?: number | null) => StaticJsonRpcProvider;
export declare const getStaticRpcBatchProvider: (chainId: CHAINS, url: string, cacheSeed?: number, pollingInterval?: number | null) => StaticJsonRpcBatchProvider;
