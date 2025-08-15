import {
  FeatureFlagsType,
  ICS_APPLY_FORM,
  RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED,
} from './types';

export const getFeatureFlagsDefault = (): FeatureFlagsType => {
  return {
    [RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED]: false,
    [ICS_APPLY_FORM]: false,
  };
};
