import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBigintMax,
  validateEtherAmount,
  validateNodeOperatorId,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { getTokenDisplayName } from 'utils';
import { formatEther } from 'viem';
import type {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from './types';

export const useStealingCancelValidation = (
  networkData: StealingCancelFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<StealingCancelFormInputType>>(
    async (values, _, options) => {
      try {
        const { amount, nodeOperatorId, maxAmount } = values;

        const { nodeOperatorsCount, ethBalance } = await dataPromise;

        invariant(ethBalance);
        invariant(nodeOperatorsCount);

        if (options.names?.includes('nodeOperatorId'))
          validateNodeOperatorId(
            'nodeOperatorId',
            nodeOperatorId,
            nodeOperatorsCount,
          );

        if (options.names?.includes('amount')) {
          validateEtherAmount('amount', amount, TOKENS.eth);

          if (amount && maxAmount)
            validateBigintMax(
              'amount',
              amount,
              maxAmount,
              `Entered amount exceeds locked bond of ${formatEther(maxAmount)} ${getTokenDisplayName(TOKENS.eth)}`,
            );
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'StealingCancelForm',
          'amount',
        );
      }
    },
    [dataPromise],
  );
};
