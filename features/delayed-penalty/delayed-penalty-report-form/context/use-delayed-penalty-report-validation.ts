import { maxUint256 } from 'viem';
import {
  useFormValidation,
  validateLength,
  validateNodeOperatorId,
  ValidationError,
} from 'shared/hook-form/validation';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation/messages';
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
        if (penaltyType === undefined || penaltyType === null)
          throw new ValidationError('penaltyType', '');
        if (!Number.isInteger(penaltyType) || penaltyType <= 0)
          throw new ValidationError(
            'penaltyType',
            VALIDATION_MESSAGES.enterPenaltyTypeGreaterThanZero,
          );
      });

      await validate('details', () => {
        validateLength('details', details, 0, 256);
      });
    },
  );
};
