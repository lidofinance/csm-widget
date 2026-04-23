import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';

export const KEY_ICS_PROOF = ['ics-proof'];

// TODO: throw error or silently skip?
export const useIcsProof = (address: Address | undefined) => {
  const sdk = useSmSDK(MODULE_NAME.CSM);

  return useQuery({
    queryKey: [...KEY_ICS_PROOF, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      invariant(address);
      return sdk.icsGate.getProofAndConsumed(address);
    },
    enabled: !!sdk && !!address,
  });
};
