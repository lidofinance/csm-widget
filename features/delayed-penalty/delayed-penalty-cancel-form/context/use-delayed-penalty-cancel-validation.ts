import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  useFormValidation,
  validateBigintMax,
  validateEtherAmount,
  validateNodeOperatorId,
} from 'shared/hook-form/validation';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import type {
  DelayedPenaltyCancelFormInputType,
  DelayedPenaltyCancelFormNetworkData,
} from './types';

export const useDelayedPenaltyCancelValidation = () => {
  return useFormValidation<
    DelayedPenaltyCancelFormInputType,
    DelayedPenaltyCancelFormNetworkData
  >(
    'amount',
    async (
      { amount, nodeOperatorId, maxAmount },
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

        if (amount && maxAmount)
          validateBigintMax(
            'amount',
            amount,
            maxAmount,
            `Entered amount exceeds locked bond of ${formatEther(maxAmount)} ${getTokenDisplayName(TOKENS.eth)}`,
          );
      });
    },
  );
};
