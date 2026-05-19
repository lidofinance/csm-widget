import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const KEY_IDVTC_PROOF = ['idvtc-proof'];

export const useIdvtcProof = (customAddress?: Address) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const sdk = useSmSDK(MODULE_NAME.CSM);

  return useQuery({
    queryKey: [...KEY_IDVTC_PROOF, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      invariant(address);
      return sdk.idvtcGate.getProofAndConsumed(address);
    },
    enabled: !!sdk && !!address,
  });
};
