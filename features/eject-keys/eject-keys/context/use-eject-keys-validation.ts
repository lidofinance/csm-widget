import {
  useFormValidation,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';

export const useEjectKeysValidation = () => {
  return useFormValidation<EjectKeysFormInputType, EjectKeysFormNetworkData>(
    'selection',
    async ({ selection }, _, validate) => {
      await validate('selection', () => {
        if (selection?.length === 0) {
          throw new ValidationError(
            'selection',
            VALIDATION_MESSAGES.noKeysSelected,
          );
        }
      });
    },
  );
};
