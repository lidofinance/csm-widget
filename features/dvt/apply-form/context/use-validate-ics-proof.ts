import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { ValidationError } from 'shared/hook-form/validation';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useValidateIcsProof = () => {
  const sdk = useSmSDK(MODULE_NAME.CSM);

  return useCallback(
    async (address: Address, fieldPath: string) => {
      invariant(sdk, 'CSM SDK is required for ICS proof validation');
      const proof = await sdk.icsGate.getProof(address);

      if (!proof) {
        throw new ValidationError(fieldPath, 'Address is not ICS-approved');
      }
    },
    [sdk],
  );
};
