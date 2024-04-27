import Head from 'next/head';
import { useNodeOperator } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Layout } from 'shared/components';

export const DashboardPage: FC = () => {
  const { active: no } = useNodeOperator();

  if (!no) return <>fail</>;

  const roles = [(no.manager && 'M') || [], (no.rewards && 'R') || []].flat();

  return (
    <Layout title="Community Staking Module" subtitle="Dashboard">
      <Head>
        <title>CSM | Lido</title>
      </Head>
      <div>
        NO #{no.id.toString()} [{roles.join('')}]
      </div>
      <div></div>
    </Layout>
  );
};
