import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import type {
  OperatorInfoFormInputType,
  OperatorInfoFormNetworkData,
} from './types';

export const useOperatorInfoValidation = () => {
  return useFormValidation<
    OperatorInfoFormInputType,
    OperatorInfoFormNetworkData
  >(
    'name',
    async (
      { name, description },
      { currentName, currentDescription, ownerEditsRestricted },
      validate,
    ) => {
      await validate('name', () => {
        if (!name.trim()) {
          throw new ValidationError('name', 'Name is required');
        }
      });

      await validate('name', () => {
        if (name === currentName && description === currentDescription) {
          throw new ValidationError('name', 'No changes detected');
        }
      });

      await validate('name', () => {
        if (ownerEditsRestricted) {
          throw new ValidationError('name', 'Edits are restricted');
        }
      });
    },
  );
};
