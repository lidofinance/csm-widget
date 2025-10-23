import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import type {
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData,
} from './types';

export const useRemoveKeysValidation = () => {
  return useFormValidation<RemoveKeysFormInputType, RemoveKeysFormNetworkData>(
    'selection',
    async ({ selection }, _, validate) => {
      await validate('selection', () => {
        if (selection.count === 0) {
          throw new ValidationError('selection', 'No keys selected');
        }
      });
    },
  );
};
