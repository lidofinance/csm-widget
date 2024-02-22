import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/components';

export const DashboardPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Dashboard">
      <Head>
        <title>CSM | Lido</title>
      </Head>
      <div>dashboard</div>
    </Layout>
  );
};
