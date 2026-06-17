import {
  useFormValidation,
  validateLength,
  ValidationError,
} from 'shared/hook-form/validation';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation/messages';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';

export const useMetadataValidation = () => {
  return useFormValidation<MetadataFormInputType, MetadataFormNetworkData>(
    'name',
    async (
      { name, description },
      { currentName, currentDescription, ownerEditsRestricted },
      validate,
    ) => {
      await validate('name', () => {
        validateLength('name', name, 1, 64);
      });

      await validate('description', () => {
        validateLength('description', description, 1, 1024);
      });

      await validate('name', () => {
        if (name === currentName && description === currentDescription) {
          throw new ValidationError(
            'name',
            VALIDATION_MESSAGES.noChangesDetected,
          );
        }
      });

      await validate('name', () => {
        if (ownerEditsRestricted) {
          throw new ValidationError(
            'name',
            VALIDATION_MESSAGES.editsRestricted,
          );
        }
      });
    },
  );
};
