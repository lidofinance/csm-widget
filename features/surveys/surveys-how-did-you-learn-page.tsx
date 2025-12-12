import { FC } from 'react';

import { BackButton } from './shared';
import { SurveyHowDidYouLearnCsm } from './survey-how-did-you-learn-csm';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysHowDidYouLearnCsmPage: FC = () => (
  <SurveyOperatorGate>
    <BackButton />
    <SurveyHowDidYouLearnCsm />
  </SurveyOperatorGate>
);
