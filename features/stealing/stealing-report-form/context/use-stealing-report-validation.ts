import { TOKENS } from 'consts/tokens';
import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateEtherAmount,
  validateHash,
  validateNodeOperatorId,
} from 'shared/hook-form/validation';
import { useAwaitNetworkData } from 'shared/hooks';
import invariant from 'tiny-invariant';
import type {
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from './types';

export const useStealingReportValidation = (
  networkData: StealingReportFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);

  return useCallback<Resolver<StealingReportFormInputType>>(
    async (values, _, options) => {
      try {
        const { amount, nodeOperatorId, blockhash } = values;

        const { nodeOperatorsCount, etherBalance } = await dataPromise;

        invariant(etherBalance);
        invariant(nodeOperatorsCount);

        if (options.names?.includes('nodeOperatorId'))
          validateNodeOperatorId(
            'nodeOperatorId',
            nodeOperatorId,
            nodeOperatorsCount,
          );

        if (options.names?.includes('amount'))
          validateEtherAmount('amount', amount, TOKENS.ETH);

        if (options.names?.includes('blockhash'))
          validateHash('blockhash', blockhash);

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'StealingReportForm',
          'amount',
        );
      }
    },
    [dataPromise],
  );
};
