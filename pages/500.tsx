import { ServicePage } from '@lidofinance/lido-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';

const Page500: FC = () => (
  <ServicePage title="500">
    <Head>
      <title>Lido | Internal Server Error</title>
    </Head>
    Internal Server Error
  </ServicePage>
);

export default Page500;

export const getStaticProps: GetStaticProps = () => {
  return { props: { isError: true } };
};
