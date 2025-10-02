import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import { handleResolverValidationError } from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import type {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from './types';

export const useNormalizeQueueValidation = (
  networkData: NormalizeQueueFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<NormalizeQueueFormInputType>>(
    async (values) => {
      try {
        const { ethBalance } = await dataPromise;

        invariant(ethBalance !== undefined, 'Insufficient ETH balance');

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'NormalizeQueueForm',
          'keysCount',
        );
      }
    },
    [dataPromise],
  );
};
