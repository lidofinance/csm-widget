import { BaseContract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
import { FilterAsyncMethods } from './types';
import { SWRConfiguration } from 'swr';
export declare const useContractEstimateGasSWR: <C extends BaseContract, M extends FilterAsyncMethods<C["estimateGas"]>, F extends boolean>(props: {
    contract?: C | undefined;
    method: M;
    shouldFetch?: F | undefined;
    params?: (F extends false ? unknown[] : Parameters<C["estimateGas"][M]>) | undefined;
    config?: Partial<import("swr/dist/types").PublicConfiguration<BigNumber, Error, import("swr").Fetcher<BigNumber>>> | undefined;
}) => SWRResponse<BigNumber, Error>;
