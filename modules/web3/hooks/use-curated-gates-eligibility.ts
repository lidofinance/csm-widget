import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useActiveSmSDK } from '../web3-provider';
import { CuratedGateEligibility } from './types';
import { useDappStatus } from './use-dapp-status';

export const KEY_CURATED_GATES_PROOF = ['curated-gates-proof'];

export const useCuratedGatesEligibility = <TData = CuratedGateEligibility[]>(
  customAddress?: Address,
  select?: (data: CuratedGateEligibility[]) => TData,
) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const sdk = useActiveSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [...KEY_CURATED_GATES_PROOF, { address, module: MODULE_NAME.CM }],
    ...STRATEGY_CONSTANT,
    queryFn: async (): Promise<CuratedGateEligibility[]> => {
      invariant(sdk);
      invariant(address);
      const data = await sdk.curatedGates.getEligibility(address);
      return data
        .filter((gate) => !!gate.isEligible)
        .map((gate) => ({
          ...gate,
          curve: { curveId: gate.curveId, module: MODULE_NAME.CM },
        }));
    },
    select,
    enabled: !!sdk && !!address,
  });
};
