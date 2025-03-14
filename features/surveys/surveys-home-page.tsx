import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SurveysHome } from './surveys-home/surverys-home';

export const SurveysHomePage: FC = () => (
  <Layout title="Surveys" subtitle="Voluntary report form">
    <NoSSRWrapper>
      <SurveysHome />
    </NoSSRWrapper>
  </Layout>
);
