import { GateItemEligibility, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';

export const KEY_CURATED_GATES_PROOF = ['curated-gates-proof'];

export const useCuratedGatesEligibility = <TData = GateItemEligibility[]>(
  address: Address | undefined,
  select?: (data: GateItemEligibility[]) => TData,
) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [...KEY_CURATED_GATES_PROOF, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(address);
      const data = await sdk.curatedGates.getEligibility(address);
      return data.filter((gate) => !!gate.isEligible);
    },
    select,
    enabled: !!sdk && !!address,
  });
};
