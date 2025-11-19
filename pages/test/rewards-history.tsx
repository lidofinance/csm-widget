import { getSecretConfig } from 'config';
import { RewardsHistory } from 'features/rewards-history';
import { MockRewardsHistoryProvider } from 'mock/rewards/mock-providers';
import { testScenarios } from 'mock/rewards/test-scenarios';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { Layout } from 'shared/layout';

const RewardsHistoryTestPage: FC = () => {
  return (
    <Layout dummy title="Rewards History Test">
      <MockRewardsHistoryProvider scenario={testScenarios[0].data}>
        <RewardsHistory />
      </MockRewardsHistoryProvider>
    </Layout>
  );
};

export default RewardsHistoryTestPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const { defaultChain } = getSecretConfig();

  if (defaultChain === 1) {
    return { notFound: true };
  }

  return { props: {} };
};
