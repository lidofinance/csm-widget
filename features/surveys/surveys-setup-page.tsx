import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { BackButton } from './shared';
import { SurveySetup } from './survey-setup';

export const SurveysSetupPage: FC<{ id?: string }> = ({ id }) => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <SurveySetup id={id} />
    </NoSSRWrapper>
  </Layout>
);
