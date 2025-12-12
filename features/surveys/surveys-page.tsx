import { PATH } from 'consts/urls';
import { FC, useMemo } from 'react';
import { SiweAuthGate, SiweAuthProvider } from 'shared/siwe';
import { SurveysContactsPage } from './surveys-contacts-page';
import { SurveysDelegatesPage } from './surveys-delegates-page';
import { SurveysExperiencePage } from './surveys-experience-page';
import { SurveysHowDidYouLearnCsmPage } from './surveys-how-did-you-learn-page';
import { SurveysSetupPage } from './surveys-setup-page';
import { SurveysDelegatorPage } from './surveys-delegator-page';
import { SurveysHomePage } from './surveys-home-page';
import { SurveyProvider } from './surveys-provider';
import { SurveysSignInPage } from './surveys-signin-page';
import { Layout } from 'shared/layout';
import { NoSSRWrapper } from 'shared/components';
import { useDappStatus } from 'modules/web3';
import { Fallback } from 'shared/wallet';

export const SurveysPage: FC<{ slug?: string[] }> = ({ slug = [] }) => {
  const { isSupportedChain, isWalletConnected } = useDappStatus();
  const isWrongChain = isWalletConnected && !isSupportedChain;

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
    <Layout title="Surveys" subtitle="Voluntary report form">
      <NoSSRWrapper>
        {isWrongChain && <Fallback />}
        <SiweAuthProvider
          storageKeyPrefix="surveys-token"
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
