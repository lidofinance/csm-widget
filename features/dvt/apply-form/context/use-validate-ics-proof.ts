import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { ValidationError } from 'shared/hook-form/validation';
import { Address } from 'viem';

export const useValidateIcsProof = () => {
  const { csm } = useLidoSDK();

  return useCallback(
    async (address: Address, fieldPath: string) => {
      const proof = await csm.icsGate.getProof(address);

      if (!proof) {
        throw new ValidationError(fieldPath, 'Address is not ICS-approved');
      }
    },
    [csm],
  );
};
