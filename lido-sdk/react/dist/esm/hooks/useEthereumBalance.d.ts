import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare const useEthereumBalance: (account?: string | undefined, config?: Partial<import("swr/dist/types").PublicConfiguration<BigNumber, Error, import("swr").Fetcher<BigNumber>>> | undefined) => SWRResponse<BigNumber>;
