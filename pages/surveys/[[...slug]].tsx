import { PATH } from 'consts/urls';
import { SurveysPage } from 'features/surveys';
import { useRouter } from 'next/router';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const router = useRouter();
  const slug = router.query.slug as string[] | undefined;

  return (
    <PageGate path={PATH.SURVEYS}>
      <SurveysPage slug={slug} />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps();
