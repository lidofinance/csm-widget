import {
  useFormValidation,
  validateAddress,
  validateLength,
  ValidationError,
} from 'shared/hook-form/validation';
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
          throw new ValidationError('gateName', 'Please select Operator Type');
        }

        const selectedGate = availableGates.find(
          (gate) => gate.gateName === gateName,
        );

        if (!selectedGate) {
          throw new ValidationError(
            'gateName',
            'Invalid Operator Type selected',
          );
        }

        if (selectedGate.isPaused) {
          throw new ValidationError(
            'gateName',
            'This Operator Type is currently paused',
          );
        }

        if (selectedGate.isConsumed) {
          throw new ValidationError(
            'gateName',
            'You have already used this Operator Type',
          );
        }

        if (!selectedGate.proof) {
          throw new ValidationError(
            'gateName',
            'You are not eligible for this Operator Type',
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
