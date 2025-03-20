import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare const useTokenBalance: (token: string, account?: string | undefined, config?: Partial<import("swr/dist/types").PublicConfiguration<BigNumber, any, import("swr").Fetcher<BigNumber>>> | undefined) => SWRResponse<BigNumber>;
