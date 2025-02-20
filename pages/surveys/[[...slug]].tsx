import { PATH } from 'consts/urls';
import {
  GateSurveyAuth,
  SurveyAuthProvider,
  SurveysContactsPage,
  SurveysHomePage,
  SurveysSetupPage,
  SurveysSignInPage,
} from 'features/surveys';
import { getProps } from 'lib/getProps';
import { useRouter } from 'next/router';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const router = useRouter();
  const slug = router.query.slug;

  const page = slug?.[0];
  const id = slug?.[1];

  return (
    <GateLoaded>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <SurveyAuthProvider>
          <GateSurveyAuth fallback={<SurveysSignInPage />}>
            {page === 'contacts' ? (
              <SurveysContactsPage />
            ) : page === 'setup' ? (
              <SurveysSetupPage id={id} />
            ) : (
              <SurveysHomePage />
            )}
          </GateSurveyAuth>
        </SurveyAuthProvider>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
