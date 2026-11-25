import { Button, ErrorPage } from '@lidofinance/lido-app-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';

const Page404: FC = () => {
  return (
    <Layout pageName="404" dummy="semi">
      <Head>
        <title>Lido | Page Not Found</title>
      </Head>
      <ErrorPage
        code="404"
        action={
          <Button size="big" href={PATH.HOME}>
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
