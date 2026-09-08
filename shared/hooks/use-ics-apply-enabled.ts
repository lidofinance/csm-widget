import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import { ICS_APPLY_FORM } from 'config/feature-flags/types';
import { useModule } from 'modules/web3';

export const useIcsApplyEnabled = () => {
  const featureFlags = useFeatureFlags();
  const { module } = useModule();

  return !!featureFlags?.[ICS_APPLY_FORM] && module === MODULE_NAME.CSM;
};
