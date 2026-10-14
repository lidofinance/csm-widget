import { Button, ErrorPage } from '@lidofinance/lido-app-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';

const Page404: FC = () => {
  const router = useRouter();

  return (
    <Layout pageName="404">
      <Head>
        <title>Lido | Page Not Found</title>
      </Head>
      <ErrorPage
        variant="404"
        action={
          <Button size="big" onClick={() => router.push(PATH.HOME)}>
            Back to dashboard
          </Button>
        }
      />
    </Layout>
  );
};

export default Page404;

export const getStaticProps: GetStaticProps = () => ({
  props: { isError: true },
});
