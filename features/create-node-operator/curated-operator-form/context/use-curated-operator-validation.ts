import {
  useFormValidation,
  validateAddress,
  validateLength,
  ValidationError,
} from 'shared/hook-form/validation';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation/messages';
import type {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from './types';

export const useCuratedOperatorValidation = () => {
  return useFormValidation<
    CuratedOperatorFormInputType,
    CuratedOperatorFormNetworkData
  >(
    'gateName',
    async (
      { gateName, rewardAddress, managerAddress, name, description },
      { availableGates },
      validate,
    ) => {
      await validate('gateName', () => {
        if (gateName === undefined) {
          throw new ValidationError(
            'gateName',
            VALIDATION_MESSAGES.selectOperatorType,
          );
        }

        const selectedGate = availableGates.find(
          (gate) => gate.gateName === gateName,
        );

        if (!selectedGate) {
          throw new ValidationError(
            'gateName',
            VALIDATION_MESSAGES.invalidOperatorType,
          );
        }

        if (selectedGate.isPaused) {
          throw new ValidationError(
            'gateName',
            VALIDATION_MESSAGES.operatorTypePaused,
          );
        }

        if (selectedGate.isConsumed) {
          throw new ValidationError(
            'gateName',
            VALIDATION_MESSAGES.operatorTypeAlreadyUsed,
          );
        }

        if (!selectedGate.proof) {
          throw new ValidationError(
            'gateName',
            VALIDATION_MESSAGES.notEligibleForOperatorType,
          );
        }
      });

      await validate('rewardAddress', () => {
        validateAddress('rewardAddress', rewardAddress);
      });

      await validate('managerAddress', () => {
        validateAddress('managerAddress', managerAddress);
      });

      await validate('name', () => {
        validateLength('name', name, 1, 64);
      });

      await validate('description', () => {
        validateLength('description', description, 1, 1024);
      });
    },
  );
};
