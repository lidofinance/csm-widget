import { useCallback } from 'react';
import useSWRSource from 'swr';
import { useSDK } from './useSDK.js';

const LIDO_SWR_DEFAULT_CONFIG = {
    errorRetryInterval: 10000,
    focusThrottleInterval: 10000,
};
const useLidoSWR = (key, fetcher, config) => {
    const { swrConfig } = useSDK();
    const result = useSWRSource(key, fetcher, Object.assign(Object.assign(Object.assign({}, LIDO_SWR_DEFAULT_CONFIG), swrConfig), config));
    const mutate = result.mutate;
    const update = useCallback(() => {
        return mutate(undefined, true);
    }, [mutate]);
    return {
        mutate,
        update,
        /*
         * support dependency collection
         * https://swr.vercel.app/advanced/performance#dependency-collection
         */
        get data() {
            return result.data;
        },
        get loading() {
            return result.isValidating;
        },
        get initialLoading() {
            return result.data == null && result.isValidating;
        },
        get error() {
            return result.error;
        },
    };
};

export { useLidoSWR };
