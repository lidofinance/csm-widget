import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FeatureFlagsContextType } from 'config/feature-flags/context-hook';
import { SURVEYS_SETUP_ENABLED } from 'config/feature-flags/types';
import { isSurveysApiConfigured } from 'modules/surveys-sdk';

export const isSurveysAvailable = (
  module: MODULE_NAME | undefined,
  featureFlags: FeatureFlagsContextType | null,
) =>
  isSurveysApiConfigured &&
  !!featureFlags?.[SURVEYS_SETUP_ENABLED] &&
  module === MODULE_NAME.CSM;
