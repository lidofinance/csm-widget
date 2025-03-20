import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare const useTotalSupply: (token: string, config?: Partial<import("swr/dist/types").PublicConfiguration<BigNumber, any, import("swr").Fetcher<BigNumber>>> | undefined) => SWRResponse<BigNumber>;
