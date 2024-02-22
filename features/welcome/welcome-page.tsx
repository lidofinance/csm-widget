import { Banner } from './banner';
import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/components';
import { useAccount } from 'wagmi';
import { Submitter } from './submitter';

export const WelcomePage: FC = () => {
  const { isConnected } = useAccount();

  return (
    <Layout
      title="Community Staking Module"
      subtitle="Your way to solo staking"
    >
      <Head>
        <title>CSM | Lido</title>
      </Head>
      {isConnected ? <Submitter /> : <Banner />}
    </Layout>
  );
};
