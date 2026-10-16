import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';

export const KEY_ICS_PROOF = ['ics-proof'];
export const KEY_IDVTC_PROOF = ['idvtc-proof'];

type ProofType = OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;

export const useTypeProof = (
  targetType: ProofType,
  address: Address | undefined,
) => {
  // ICS/IDVTC are CSM-only: resolve the CSM SDK even when a CSM_02 operator is active.
  const sdk = useSmSDK(MODULE_NAME.CSM);
  const isIcs = targetType === OPERATOR_TYPE.CSM_ICS;

  return useQuery({
    queryKey: [
      ...(isIcs ? KEY_ICS_PROOF : KEY_IDVTC_PROOF),
      { address, module: MODULE_NAME.CSM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      invariant(address);
      return (isIcs ? sdk.icsGate : sdk.idvtcGate).getProofAndConsumed(address);
    },
    enabled: !!sdk && !!address,
  });
};
