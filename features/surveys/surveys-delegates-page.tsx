import { FC } from 'react';

import { SurveyDelegates } from './survey-delegates';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysDelegatesPage: FC = () => (
  <SurveyOperatorGate>
    <SurveyDelegates />
  </SurveyOperatorGate>
);
