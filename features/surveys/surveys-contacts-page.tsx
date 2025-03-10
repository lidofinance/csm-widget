import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SurveyContacts } from './survey-contacts';
import { BackButton } from './shared';

export const SurveysContactsPage: FC = () => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <SurveyContacts />
    </NoSSRWrapper>
  </Layout>
);
