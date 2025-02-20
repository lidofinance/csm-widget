import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SiweSignIn } from './siwe-sign-in';

export const SurveysSignInPage: FC = () => (
  <Layout title="Surveys" subtitle="Voluntary report form">
    <NoSSRWrapper>
      <SiweSignIn />
    </NoSSRWrapper>
  </Layout>
);
