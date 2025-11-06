import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import type { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';

export const useEjectKeysValidation = () => {
  return useFormValidation<EjectKeysFormInputType, EjectKeysFormNetworkData>(
    'selection',
    async ({ selection }, _, validate) => {
      await validate('selection', () => {
        if (selection?.length === 0) {
          throw new ValidationError('selection', 'No keys selected');
        }
      });
    },
  );
};
