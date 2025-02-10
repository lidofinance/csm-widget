import { FC } from 'react';

import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SurveysHome } from './surveys-home/surverys-home';
import { useSiwe } from './shared/use-siwe';
import { SiweSignIn } from './siwe-sign-in';

export const SurveysHomePage: FC = () => {
  const { isSignedIn } = useSiwe();

  return (
    <Layout title="Surveys" subtitle="Voluntary report form">
      <NoSSRWrapper>
        {isSignedIn ? <SurveysHome /> : <SiweSignIn />}
      </NoSSRWrapper>
    </Layout>
  );
};
