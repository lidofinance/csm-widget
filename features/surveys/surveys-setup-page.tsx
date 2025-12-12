import { FC } from 'react';

import { BackButton } from './shared';
import { SurveySetup } from './survey-setup';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysSetupPage: FC<{ id?: string }> = ({ id }) => (
  <SurveyOperatorGate>
    <BackButton />
    <SurveySetup id={id} />
  </SurveyOperatorGate>
);
