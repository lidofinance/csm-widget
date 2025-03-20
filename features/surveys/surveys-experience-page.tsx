import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { BackButton } from './shared';
import { SurveyExperience } from './survey-experience';

export const SurveysExperiencePage: FC = () => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <SurveyExperience />
    </NoSSRWrapper>
  </Layout>
);
