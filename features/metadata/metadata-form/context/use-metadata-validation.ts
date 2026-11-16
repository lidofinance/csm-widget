import {
  useFormValidation,
  validateLength,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';

export const METADATA_NAME_MAX_LENGTH = 64;
export const METADATA_DESCRIPTION_MAX_LENGTH = 1024;

export const useMetadataValidation = () => {
  return useFormValidation<MetadataFormInputType, MetadataFormNetworkData>(
    'name',
    async (
      { name, description },
      { currentName, currentDescription, ownerEditsRestricted },
      validate,
    ) => {
      await validate('name', () => {
        validateLength('name', name, 1, METADATA_NAME_MAX_LENGTH);
      });

      await validate('description', () => {
        validateLength(
          'description',
          description,
          1,
          METADATA_DESCRIPTION_MAX_LENGTH,
        );
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
