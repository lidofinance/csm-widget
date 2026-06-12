import { FC } from 'react';

import { SurveyHowDidYouLearnCsm } from './survey-how-did-you-learn-csm';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysHowDidYouLearnCsmPage: FC = () => (
  <SurveyOperatorGate>
    <SurveyHowDidYouLearnCsm />
  </SurveyOperatorGate>
);
