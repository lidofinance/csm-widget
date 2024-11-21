import { ServicePage } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/layout';

const Page500: FC = () => (
  <Layout dummy={true} matomoEvent={MATOMO_CLICK_EVENTS_TYPES.page500}>
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
