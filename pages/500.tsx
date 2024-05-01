import { FC } from 'react';
import Head from 'next/head';
import { ServicePage } from '@lidofinance/lido-ui';

const Page500: FC = () => (
  <ServicePage title="500">
    <Head>
      <title>Lido | Internal Server Error</title>
    </Head>
    Internal Server Error
  </ServicePage>
);

export default Page500;
