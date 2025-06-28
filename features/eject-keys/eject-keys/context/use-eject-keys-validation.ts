import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import type { EjectKeysFormInputType } from './types';

export const useEjectKeysValidation = () => {
  return useCallback<Resolver<EjectKeysFormInputType>>(async (values) => {
    try {
      const { selection } = values;

      if (selection.count === 0) {
        throw new ValidationError('selection', 'No keys selected');
      }

      return {
        values,
        errors: {},
      };
    } catch (error) {
      return handleResolverValidationError(error, 'EjectKeysForm', 'selection');
    }
  }, []);
};
