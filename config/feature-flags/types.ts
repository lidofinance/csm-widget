export const ICS_APPLY_FORM = 'icsApplyForm';
export const SURVEYS_SETUP_ENABLED = 'surveysSetupEnabled';
export const DISABLE_DEPOSIT_DATA_VALIDATION = 'disableDepositDataValidation';

export type FeatureFlagsType = {
  [ICS_APPLY_FORM]: boolean;
  [SURVEYS_SETUP_ENABLED]: boolean;
  [DISABLE_DEPOSIT_DATA_VALIDATION]: boolean;
};
