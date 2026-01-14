import { PATH } from 'consts/urls';
import { FC, useMemo } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { SiweAuthGate, SiweAuthProvider } from 'shared/siwe';
import { SurveysContactsPage } from './surveys-contacts-page';
import { SurveysDelegatesPage } from './surveys-delegates-page';
import { SurveysDelegatorPage } from './surveys-delegator-page';
import { SurveysExperiencePage } from './surveys-experience-page';
import { SurveysHomePage } from './surveys-home-page';
import { SurveysHowDidYouLearnCsmPage } from './surveys-how-did-you-learn-page';
import { SurveyProvider } from './surveys-provider';
import { SurveysSetupPage } from './surveys-setup-page';
import { SurveysSignInPage } from './surveys-signin-page';

export const SurveysPage: FC<{ slug?: string[] }> = ({ slug = [] }) => {
  const page = useMemo(() => {
    const [page, id1, id2] = slug;
    const path = `/surveys/${page}`;

    switch (path) {
      case PATH.SURVEYS_CONTACTS:
        return <SurveysContactsPage />;
      case PATH.SURVEYS_DELEGATES:
        return <SurveysDelegatesPage />;
      case PATH.SURVEYS_EXPERIENCE:
        return <SurveysExperiencePage />;
      case PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM:
        return <SurveysHowDidYouLearnCsmPage />;
      case PATH.SURVEYS_SETUP:
        return <SurveysSetupPage id={id1} />;
      case PATH.SURVEYS_DELEGATOR:
        return <SurveysDelegatorPage operatorId={id1} setupId={id2} />;

      default:
        return <SurveysHomePage />;
    }
  }, [slug]);

  return (
    <Layout title="Surveys" subtitle="Voluntary report form" pageName="Surveys">
      <NoSSRWrapper>
        <SiweAuthProvider
          contextName="surveys"
          statement="Sign in to use the CSM Surveys"
        >
          <SiweAuthGate fallback={<SurveysSignInPage />}>
            <SurveyProvider>{page}</SurveyProvider>
          </SiweAuthGate>
        </SiweAuthProvider>
      </NoSSRWrapper>
    </Layout>
  );
};
