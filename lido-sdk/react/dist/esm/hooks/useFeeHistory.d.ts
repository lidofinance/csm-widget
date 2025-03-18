import { CHAINS } from '@lido-sdk/constants';
import { BaseProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare type SourceFeeHistory = {
    oldestBlock: number;
    baseFeePerGas: readonly string[];
    gasUsedRatio: readonly number[];
};
export declare type FeeHistory = {
    oldestBlock: number;
    baseFeePerGas: readonly BigNumber[];
    gasUsedRatio: readonly number[];
};
export declare const historyCache: Map<CHAINS, FeeHistory>;
export declare const getBlockNumber: (provider: BaseProvider) => Promise<number>;
export declare const getChunksArguments: <T extends [number, string, number[]]>(fromBlock: number, toBlock: number, chunkSize?: number) => T[];
export declare const combineHistory: (...histories: FeeHistory[]) => FeeHistory;
export declare const trimHistory: (history: FeeHistory, blocks: number) => FeeHistory;
export declare const getFeeHistory: (provider: JsonRpcProvider, fromBlock: number, toBlock: number, chunkSize?: number | undefined) => Promise<FeeHistory>;
export declare const useFeeHistory: <P extends JsonRpcProvider, W extends Web3Provider>(props?: {
    shouldFetch?: boolean | undefined;
    providerRpc?: P | undefined;
    providerWeb3?: W | undefined;
    blocks?: number | undefined;
    config?: Partial<import("swr/dist/types").PublicConfiguration<FeeHistory, Error, import("swr").Fetcher<FeeHistory>>> | undefined;
} | undefined) => SWRResponse<FeeHistory, Error>;
