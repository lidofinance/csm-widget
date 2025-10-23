import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  validateEtherAmount,
  validateHash,
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
      { amount, nodeOperatorId, blockhash },
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

      await validate('blockhash', () => {
        validateHash('blockhash', blockhash);
      });
    },
  );
};
