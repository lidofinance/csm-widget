import { FC } from 'react';

import { BackButton } from './shared';
import { SurveyDelegates } from './survey-delegates';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysDelegatesPage: FC = () => (
  <SurveyOperatorGate>
    <BackButton />
    <SurveyDelegates />
  </SurveyOperatorGate>
);
