import { PATH } from 'consts/urls';
import {
  GateSurveyAuth,
  SurveyAuthProvider,
  SurveysContactsPage,
  SurveysExperiencePage,
  SurveysHomePage,
  SurveysHowDidYouLearnCsmPage,
  SurveysSetupPage,
  SurveysSignInPage,
} from 'features/surveys';
import { getProps } from 'utils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

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
      case PATH.SURVEYS_EXPERIENCE:
        return <SurveysExperiencePage />;
      case PATH.SURVEYS_HOW_DID_YOU_LEARN_CSM:
        return <SurveysHowDidYouLearnCsmPage />;
      case PATH.SURVEYS_SETUP:
        return <SurveysSetupPage id={id} />;
      case PATH.SURVEYS_ALL:
        return <SurveysHomePage all />;

      default:
        return <SurveysHomePage />;
    }
  }, [slug]);

  return (
    <GateLoaded>
      <Gate rule="IS_SURVEYS_ACTIVE" fallback={<Navigate path={PATH.HOME} />}>
        <SurveyAuthProvider>
          <GateSurveyAuth fallback={<SurveysSignInPage />}>
            {page}
          </GateSurveyAuth>
        </SurveyAuthProvider>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
