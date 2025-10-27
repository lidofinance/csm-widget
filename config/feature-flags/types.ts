export const RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED =
  'rpcSettingsPageOnInfraIsEnabled';
export const USE_WALLET_RPC = 'useWalletRpc';
export const ICS_APPLY_FORM = 'icsApplyForm';
export const SURVEYS_SETUP_ENABLED = 'surveysSetupEnabled';

export type FeatureFlagsType = {
  [RPC_SETTINGS_PAGE_ON_INFRA_IS_ENABLED]: boolean;
  [USE_WALLET_RPC]: boolean;
  [ICS_APPLY_FORM]: boolean;
  [SURVEYS_SETUP_ENABLED]: boolean;
};
