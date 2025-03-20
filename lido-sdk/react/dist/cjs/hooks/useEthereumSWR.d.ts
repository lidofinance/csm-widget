import { BaseProvider } from '@ethersproject/providers';
import { SWRResponse } from './useLidoSWR';
import { FilterAsyncMethods, UnpackedPromise } from './types';
import { SWRConfiguration } from 'swr';
export declare const useEthereumSWR: <P extends BaseProvider, M extends FilterAsyncMethods<P>, R extends UnpackedPromise<ReturnType<P[M]>>, F extends boolean>(props: {
    method: M;
    shouldFetch?: F | undefined;
    providerRpc?: P | undefined;
    params?: (F extends false ? unknown[] : Parameters<P[M]>) | undefined;
    config?: Partial<import("swr/dist/types").PublicConfiguration<R, Error, import("swr").Fetcher<R>>> | undefined;
}) => SWRResponse<R, Error>;
