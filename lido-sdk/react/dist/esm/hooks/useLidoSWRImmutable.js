import { useLidoSWR } from './useLidoSWR.js';

const useLidoSWRImmutable = (key, fetcher, config) => {
    return useLidoSWR(key, fetcher, Object.assign({ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }, config));
};

export { useLidoSWRImmutable };
