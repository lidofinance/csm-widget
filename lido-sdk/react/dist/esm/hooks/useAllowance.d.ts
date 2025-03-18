import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare const useAllowance: (token: string, spender: string, owner?: string | undefined, config?: Partial<import("swr/dist/types").PublicConfiguration<BigNumber, any, import("swr").Fetcher<BigNumber>>> | undefined) => SWRResponse<BigNumber>;
