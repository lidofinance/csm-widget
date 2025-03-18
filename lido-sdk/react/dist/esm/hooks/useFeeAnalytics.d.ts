import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { FeeHistory } from './useFeeHistory';
import { SWRResponse } from './useLidoSWR';
export declare type FeeAnalytics = SWRResponse<FeeHistory, Error> & {
    percentile: number;
    baseFee: BigNumber;
};
export declare const calculatePercentile: (array: BigNumber[], target: BigNumber) => number;
export declare const useFeeAnalytics: (props?: {
    shouldFetch?: boolean | undefined;
    providerRpc?: JsonRpcProvider | undefined;
    providerWeb3?: Web3Provider | undefined;
    blocks?: number | undefined;
    config?: Partial<import("swr/dist/types").PublicConfiguration<FeeHistory, Error, import("swr").Fetcher<FeeHistory>>> | undefined;
} | undefined) => FeeAnalytics;
