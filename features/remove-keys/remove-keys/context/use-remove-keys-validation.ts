import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import type { RemoveKeysFormInputType } from './types';

export const useRemoveKeysValidation = () => {
  return useCallback<Resolver<RemoveKeysFormInputType>>(async (values) => {
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
      return handleResolverValidationError(
        error,
        'RemoveKeysForm',
        'selection',
      );
    }
  }, []);
};
