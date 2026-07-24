import { FC } from 'react';

import { SurveyContacts } from './survey-contacts';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysContactsPage: FC = () => (
  <SurveyOperatorGate>
    <SurveyContacts />
  </SurveyOperatorGate>
);
