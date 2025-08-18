import { FC } from 'react';
import { Layout } from 'shared/layout';
import { DepositQueueGraph } from 'features/view-keys/deposit-queue/deposit-queue-graph';
import { MockDepositQueueProvider } from 'tests/mock/queue/mock-providers';
import { testScenarios } from 'tests/mock/queue/test-scenarios';
import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

const TestBlock = styled(Block)`
  padding: 24px;
`;

const TestTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--lido-color-text);
`;

const TestDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--lido-color-textSecondary);
`;

const DepositQueueGraphTestPage: FC = () => {
  return (
    <Layout dummy title="Deposit Queue Graph Test">
      <TestContainer>
        {testScenarios.map((scenario, index) => (
          <TestBlock key={index}>
            <TestTitle>{scenario.title}</TestTitle>
            <TestDescription>{scenario.description}</TestDescription>
            <MockDepositQueueProvider scenario={scenario.data}>
              <DepositQueueGraph />
            </MockDepositQueueProvider>
          </TestBlock>
        ))}
      </TestContainer>
    </Layout>
  );
};

export default DepositQueueGraphTestPage;
