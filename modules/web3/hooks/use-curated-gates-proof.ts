import { useQuery } from '@tanstack/react-query';
import { MODULE, STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';

export const KEY_CURATED_GATES_PROOF = ['curated-gates-proof'];

// TODO: transform to list with { index, paused, curveId }
export const useCuratedGatesProof = (address: Address | undefined) => {
  const sdk = useSmSDK(MODULE.CM);

  return useQuery({
    queryKey: [...KEY_CURATED_GATES_PROOF, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      invariant(address);
      return sdk.curatedGates.getProofAndConsumed(address);
    },
    enabled: !!sdk && !!address,
  });
};
