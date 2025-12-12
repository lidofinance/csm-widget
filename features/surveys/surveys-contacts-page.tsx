import { FC } from 'react';

import { BackButton } from './shared';
import { SurveyContacts } from './survey-contacts';
import { SurveyOperatorGate } from './surveys-provider';

export const SurveysContactsPage: FC = () => (
  <SurveyOperatorGate>
    <BackButton />
    <SurveyContacts />
  </SurveyOperatorGate>
);
