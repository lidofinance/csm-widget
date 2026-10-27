import { Button, ErrorPage } from '@lidofinance/lido-app-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';

const Page500: FC = () => {
  const router = useRouter();

  return (
    <Layout pageName="500" dummy="semi">
      <Head>
        <title>Lido | Internal Server Error</title>
      </Head>
      <ErrorPage
        code="500"
        action={
          <Button size="big" onClick={() => router.push(PATH.HOME)}>
            Back to dashboard
          </Button>
        }
      />
    </Layout>
  );
};

export default Page500;

export const getStaticProps: GetStaticProps = () => ({
  props: { isError: true },
});
