import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { ContactsSurvey } from './contacts-survey';
import { BackButton } from './shared';

export const SurveysContactsPage: FC = () => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <ContactsSurvey />
    </NoSSRWrapper>
  </Layout>
);
