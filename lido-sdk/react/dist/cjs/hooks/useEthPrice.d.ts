import { SWRResponse } from './useLidoSWR';
declare type useEthPriceResult = number;
export declare const useEthPrice: (config?: Partial<import("swr/dist/types").PublicConfiguration<number, unknown, import("swr").Fetcher<number>>> | undefined) => SWRResponse<useEthPriceResult>;
export {};
