import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  validateEtherAmount,
  validateHex,
  validateLength,
  validateNodeOperatorId,
} from 'shared/hook-form/validation';
import type {
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from './types';

export const useStealingReportValidation = () => {
  return useFormValidation<
    StealingReportFormInputType,
    StealingReportFormNetworkData
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
        validateEtherAmount('amount', amount, TOKENS.eth);
      });

      await validate('penaltyType', () => {
        validateHex('penaltyType', penaltyType);
      });

      await validate('details', () => {
        validateLength('details', details, 0, 256);
      });
    },
  );
};
