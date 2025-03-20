import { Key, Fetcher, MutatorCallback } from 'swr/dist/types';
export declare type SWRResponse<Data, Error = unknown> = {
    data?: Data;
    error?: Error;
    mutate: (data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
    update: () => Promise<Data | undefined>;
    loading: boolean;
    initialLoading: boolean;
};
export declare const useLidoSWR: <Data = unknown, Error_1 = unknown>(key: Key | null, fetcher: Fetcher<Data> | null, config?: Partial<import("swr/dist/types").PublicConfiguration<Data, Error_1, Fetcher<Data>>> | undefined) => SWRResponse<Data, Error_1>;
