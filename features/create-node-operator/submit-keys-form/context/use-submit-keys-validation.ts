import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  validateBondAmount,
  validateDepositData,
} from 'shared/hook-form/validation';
import { useAccount, useAwaitNetworkData } from 'shared/hooks';
import type {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from './types';

export const useSubmitKeysValidation = (
  networkData: SubmitKeysFormNetworkData,
) => {
  const dataPromise = useAwaitNetworkData(networkData);
  const { chainId } = useAccount();

  return useCallback<Resolver<SubmitKeysFormInputType>>(
    async (values, _, options) => {
      try {
        const { token, bondAmount, depositData } = values;

        const { stethBalance, wstethBalance, etherBalance, maxStakeEther } =
          await dataPromise;

        if (options.names?.includes('bondAmount'))
          validateBondAmount({
            token,
            bondAmount,
            maxStakeEther,
            etherBalance,
            stethBalance,
            wstethBalance,
          });

        if (options.names?.includes('depositData'))
          validateDepositData({ depositData, chainId });

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(error, 'AddKeysForm', 'token');
      }
    },
    [chainId, dataPromise],
  );
};
