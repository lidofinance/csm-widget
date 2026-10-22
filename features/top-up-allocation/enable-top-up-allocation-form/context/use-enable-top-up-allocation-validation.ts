import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import {
  useFormValidation,
  validateNodeOperatorId,
  ValidationError,
  VALIDATION_MESSAGES,
} from 'shared/hook-form/validation';
import invariant from 'tiny-invariant';
import type {
  EnableTopUpAllocationFormInputType,
  EnableTopUpAllocationFormNetworkData,
} from './types';

export const useEnableTopUpAllocationValidation = () => {
  const cmSdk = useSmSDK(MODULE_NAME.CM);

  return useFormValidation<
    EnableTopUpAllocationFormInputType,
    EnableTopUpAllocationFormNetworkData
  >(
    'nodeOperatorId',
    async ({ nodeOperatorId }, { nodeOperatorsCount }, validate) => {
      await validate('nodeOperatorId', async () => {
        validateNodeOperatorId(
          'nodeOperatorId',
          nodeOperatorId,
          nodeOperatorsCount,
        );
        invariant(cmSdk);
        invariant(nodeOperatorId !== undefined);

        const isEnabled =
          await cmSdk.metaRegistry.isTopUpAllocationEnabled(nodeOperatorId);
        if (isEnabled)
          throw new ValidationError(
            'nodeOperatorId',
            VALIDATION_MESSAGES.topUpAllocationAlreadyEnabled,
          );
      });
    },
    [cmSdk],
  );
};
