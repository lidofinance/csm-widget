import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useLidoSDK } from '../web3-provider';

export const KEY_ICS_PROOF = ['ics-proof'];

export const useIcsProof = (address: Address | undefined) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_ICS_PROOF, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      return csm.icsGate.getProofAndConsumed(address);
    },
    enabled: !!address,
  });
};
