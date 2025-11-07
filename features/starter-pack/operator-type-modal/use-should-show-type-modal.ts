import { useFeatureFlags } from 'config/feature-flags';
import { ICS_APPLY_FORM } from 'config/feature-flags/types';
import { useDappStatus, useIcsProof } from 'modules/web3';

export const useShouldShowTypeModal = () => {
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof(address);
  const featureFlags = useFeatureFlags();

  const hasClaimableProof = Boolean(proof?.proof && !proof.isConsumed);
  const isIcsEnabled = Boolean(featureFlags?.[ICS_APPLY_FORM]);

  return !hasClaimableProof && isIcsEnabled;
};
