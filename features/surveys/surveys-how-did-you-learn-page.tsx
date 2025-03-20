import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { BackButton } from './shared';
import { SurveyHowDidYouLearnCsm } from './survey-how-did-you-learn-csm';

export const SurveysHowDidYouLearnCsmPage: FC = () => (
  <Layout>
    <BackButton />
    <NoSSRWrapper>
      <SurveyHowDidYouLearnCsm />
    </NoSSRWrapper>
  </Layout>
);
