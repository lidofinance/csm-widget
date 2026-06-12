import { FC } from 'react';

import { SurveySetup } from './survey-setup';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysSetupPage: FC<{ id?: string }> = ({ id }) => (
  <SurveyOperatorGate>
    <SurveySetup id={id} />
  </SurveyOperatorGate>
);
