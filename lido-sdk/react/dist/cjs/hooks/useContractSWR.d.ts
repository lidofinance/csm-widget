import { BaseContract } from '@ethersproject/contracts';
import { SWRResponse } from './useLidoSWR';
import { FilterAsyncMethods, UnpackedPromise } from './types';
import { SWRConfiguration } from 'swr';
export declare const useContractSWR: <C extends BaseContract, M extends FilterAsyncMethods<C>, R extends UnpackedPromise<ReturnType<C[M]>>, F extends boolean>(props: {
    contract: C;
    method: M;
    shouldFetch?: F | undefined;
    params?: (F extends false ? unknown[] : Parameters<C[M]>) | undefined;
    config?: Partial<import("swr/dist/types").PublicConfiguration<R, Error, import("swr").Fetcher<R>>> | undefined;
}) => SWRResponse<R, Error>;
