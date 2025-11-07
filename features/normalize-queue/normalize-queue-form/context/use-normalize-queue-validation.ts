import { useFormValidation } from 'shared/hook-form/validation';
import invariant from 'tiny-invariant';
import type {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from './types';

export const useNormalizeQueueValidation = () => {
  return useFormValidation<
    NormalizeQueueFormInputType,
    NormalizeQueueFormNetworkData
  >('keysCount', async (_, { ethBalance }, validate) => {
    await validate('keysCount', () => {
      invariant(ethBalance !== undefined, 'Insufficient ETH balance');
    });
  });
};
