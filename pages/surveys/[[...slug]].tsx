import { PATH } from 'consts/urls';
import { SurveysPage } from 'features/surveys';
import type { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const router = useRouter();
  const slug = router.query.slug as string[] | undefined;

  return (
    <GateLoaded>
      <Gate rule="IS_SURVEYS_ACTIVE" fallback={<Navigate path={PATH.HOME} />}>
        <SurveysPage slug={slug} />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getStaticProps = getProps();

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [{ params: { slug: [] } }],
  fallback: 'blocking',
});
