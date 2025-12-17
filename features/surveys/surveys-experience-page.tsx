import { FC } from 'react';

import { BackButton } from './shared';
import { SurveyExperience } from './survey-experience';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysExperiencePage: FC = () => (
  <SurveyOperatorGate>
    <BackButton />
    <SurveyExperience />
  </SurveyOperatorGate>
);
