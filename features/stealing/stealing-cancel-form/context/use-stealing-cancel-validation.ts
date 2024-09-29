import { TOKENS } from 'consts/tokens';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBignumberMax,
  validateEtherAmount,
  validateNodeOperatorId,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import type {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from './types';
import { getTokenDisplayName } from 'utils';
import { formatEther } from '@ethersproject/units';
import { FormatToken } from 'shared/formatters';

export const useStealingCancelValidation = (
  networkData: StealingCancelFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<StealingCancelFormInputType>>(
    async (values, _, options) => {
      try {
        const { amount, nodeOperatorId, maxAmount } = values;

        const { nodeOperatorsCount, etherBalance } = await dataPromise;

        invariant(etherBalance);
        invariant(nodeOperatorsCount);

        if (options.names?.includes('nodeOperatorId'))
          validateNodeOperatorId(
            'nodeOperatorId',
            nodeOperatorId,
            nodeOperatorsCount,
          );

        if (options.names?.includes('amount')) {
          validateEtherAmount('amount', amount, TOKENS.ETH);

          if (amount && maxAmount)
            validateBignumberMax(
              'amount',
              amount,
              maxAmount,
              `Entered amount exceeds locked bond of ${formatEther(maxAmount)} ${getTokenDisplayName(TOKENS.ETH)}`,
            );
          FormatToken;
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
