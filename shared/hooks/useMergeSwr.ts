import { SWRResponse } from '@lido-sdk/react';
import { useMemo } from 'react';

export const useMergeSwr = <T, E = Error>(
  swrResponses: SWRResponse<any, E>[],
  data: T | undefined,
): SWRResponse<T, E> =>
  useMemo(
    () => ({
      get data() {
        return data;
      },

      get loading() {
        return swrResponses.some((r) => r.loading);
      },

      get initialLoading() {
        return swrResponses.some((r) => r.initialLoading);
      },

      get error() {
        return swrResponses.find((r) => r.error)?.error;
      },

      async update() {
        const list = swrResponses.map((r) => r.update());
        await Promise.allSettled(list);
        return this.data;
      },

      async mutate() {
        throw new Error('mutate is not supported here');
      },
    }),
    [data, swrResponses],
  );
