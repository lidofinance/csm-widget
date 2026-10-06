import { maxUint256, size } from 'viem';
import {
  useFormValidation,
  validateLength,
  validateHex,
  validateNodeOperatorId,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import type {
  DelayedPenaltyReportFormInputType,
  DelayedPenaltyReportFormNetworkData,
} from './types';

export const useDelayedPenaltyReportValidation = () => {
  return useFormValidation<
    DelayedPenaltyReportFormInputType,
    DelayedPenaltyReportFormNetworkData
  >(
    'amount',
    async (
      { amount, nodeOperatorId, penaltyType, details },
      { nodeOperatorsCount },
      validate,
    ) => {
      await validate('nodeOperatorId', () => {
        validateNodeOperatorId(
          'nodeOperatorId',
          nodeOperatorId,
          nodeOperatorsCount,
        );
      });

      await validate('amount', () => {
        if (amount === undefined) throw new ValidationError('amount', '');
        if (amount <= 0n)
          throw new ValidationError(
            'amount',
            VALIDATION_MESSAGES.enterAmountGreaterThanZero,
          );
        if (amount > maxUint256)
          throw new ValidationError(
            'amount',
            VALIDATION_MESSAGES.amountNotValid,
          );
      });

      await validate('penaltyType', () => {
        validateHex('penaltyType', penaltyType);
        if (penaltyType === '0x') throw new ValidationError('penaltyType', '');
        if (size(penaltyType) > 32)
          throw new ValidationError(
            'penaltyType',
            VALIDATION_MESSAGES.penaltyTypeTooLong,
          );
        if (BigInt(penaltyType) === 0n)
          throw new ValidationError(
            'penaltyType',
            VALIDATION_MESSAGES.penaltyTypeNotZero,
          );
      });

      await validate('details', () => {
        validateLength('details', details, 0, 256);
      });
    },
  );
};
