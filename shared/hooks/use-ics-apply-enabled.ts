import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import { ICS_APPLY_FORM } from 'config/feature-flags/types';
import { useSmSDK } from 'modules/web3';

export const useIcsApplyEnabled = () => {
  const featureFlags = useFeatureFlags();
  const hasCsm = !!useSmSDK(MODULE_NAME.CSM);

  return !!featureFlags?.[ICS_APPLY_FORM] && hasCsm;
};
