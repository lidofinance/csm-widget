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
    'gateIndex',
    async (
      { gateIndex, rewardAddress, managerAddress, name, description },
      { availableGates },
      validate,
    ) => {
      await validate('gateIndex', () => {
        if (gateIndex === undefined) {
          throw new ValidationError('gateIndex', 'Please select Operator Type');
        }

        const selectedGate = availableGates.find(
          (gate) => gate.gateIndex === gateIndex,
        );

        if (!selectedGate) {
          throw new ValidationError(
            'gateIndex',
            'Invalid Operator Type selected',
          );
        }

        if (selectedGate.isPaused) {
          throw new ValidationError(
            'gateIndex',
            'This Operator Type is currently paused',
          );
        }

        if (selectedGate.isConsumed) {
          throw new ValidationError(
            'gateIndex',
            'You have already used this Operator Type',
          );
        }

        if (!selectedGate.proof) {
          throw new ValidationError(
            'gateIndex',
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
        validateLength('description', description, 1, 64);
      });
    },
  );
};
