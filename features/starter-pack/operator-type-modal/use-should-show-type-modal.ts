import { useFeatureFlags } from 'config/feature-flags';
import { ICS_APPLY_FORM } from 'config/feature-flags/types';
import { useIcsProof } from 'modules/web3';

export const useShouldShowTypeModal = () => {
  const { data: proof } = useIcsProof();
  const featureFlags = useFeatureFlags();

  const hasClaimableProof = Boolean(proof?.proof && !proof.isConsumed);
  const isIcsEnabled = Boolean(featureFlags?.[ICS_APPLY_FORM]);

  return !hasClaimableProof && isIcsEnabled;
};
