import { ServicePage } from '@lidofinance/lido-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/layout';

const Page500: FC = () => (
  <Layout dummy={true} pageName="500">
    <ServicePage title="500">
      <Head>
        <title>Lido | Internal Server Error</title>
      </Head>
      Internal Server Error
    </ServicePage>
  </Layout>
);

export default Page500;

export const getStaticProps: GetStaticProps = () => ({
  props: { isError: true },
});
