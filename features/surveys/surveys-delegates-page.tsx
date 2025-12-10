import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SurveyDelegates } from './survey-delegates';
import { BackButton } from './shared';

export const SurveysDelegatesPage: FC = () => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <SurveyDelegates />
    </NoSSRWrapper>
  </Layout>
);
