import { PATH } from 'consts/urls';
import {
  SurveysContactsPage,
  SurveysDelegatesPage,
  SurveysExperiencePage,
  SurveysHomePage,
  SurveysHowDidYouLearnCsmPage,
  SurveysSetupPage,
  SurveysSignInPage,
} from 'features/surveys';
import { getProps } from 'utilsApi';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { SiweAuthProvider, SiweAuthGate } from 'shared/siwe';

const Page = () => {
  const router = useRouter();
  const slug = router.query.slug;

  const page = useMemo(() => {
    const page = slug?.[0];
    const id = slug?.[1];
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
        return <SurveysSetupPage id={id} />;

      default:
        return <SurveysHomePage />;
    }
  }, [slug]);

  return (
    <GateLoaded>
      <Gate rule="IS_SURVEYS_ACTIVE" fallback={<Navigate path={PATH.HOME} />}>
        <SiweAuthProvider
          storageKeyPrefix="surveys-token"
          statement="Sign in to use the CSM Surveys"
        >
          <SiweAuthGate fallback={<SurveysSignInPage />}>{page}</SiweAuthGate>
        </SiweAuthProvider>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
