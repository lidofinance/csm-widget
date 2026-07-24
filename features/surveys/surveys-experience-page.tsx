import { FC } from 'react';

import { SurveyExperience } from './survey-experience';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysExperiencePage: FC = () => (
  <SurveyOperatorGate>
    <SurveyExperience />
  </SurveyOperatorGate>
);
