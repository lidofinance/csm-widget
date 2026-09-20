import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

// Resolves whether an address is ICS-approved (has an ICS gate proof). Shared
// by the IDVTC apply-form validation and the cluster-member rotation flow so
// both gate new members on the same rule.
export const useCheckIcsProof = () => {
  const sdk = useSmSDK(MODULE_NAME.CSM);

  return useCallback(
    async (address: Address): Promise<boolean> => {
      invariant(sdk, 'CSM SDK is required for ICS proof validation');
      const proof = await sdk.icsGate.getProof(address);
      return !!proof;
    },
    [sdk],
  );
};
