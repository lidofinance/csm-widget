import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Layout } from 'shared/layout';
import { DepositQueueGraph } from 'features/view-keys/deposit-queue/deposit-queue-graph';
import { MockDepositQueueProvider } from 'tests/mock/queue/mock-providers';
import { testScenarios } from 'tests/mock/queue/test-scenarios';
import styled from 'styled-components';
import { Block, Accordion } from '@lidofinance/lido-ui';
import { getSecretConfig } from 'config';

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

const StyledAccordion = styled(Accordion)`
  margin: 16px 0 0;
  & > [type='button'] {
    padding: 0;
    min-height: 24px;
  }
  & > [type='button'] + div > div {
    padding: 4px 0 0;
  }
`;

const AccordionSummary = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--lido-color-textSecondary);
`;

const QueueDataContainer = styled.pre`
  background: var(--lido-color-backgroundSecondary);
  border-radius: 8px;
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: var(--lido-color-text);
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;

  .queue {
    margin-left: 12px;
  }

  .operator-batch {
    color: var(--lido-color-warning);
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: 600;
    border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
    background: color-mix(in srgb, currentColor 15%, transparent);
  }
`;

const highlightOperatorBatches = (
  jsonString: string,
  operatorId: number,
): string => {
  // Replace operator batches with wrapped spans
  const highlighted = jsonString.replace(
    new RegExp(`\\[${operatorId},(\\s*\\d+)\\]`, 'g'),
    '<span class="operator-batch">$&</span>',
  );
  return highlighted;
};

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
            <StyledAccordion
              summary={<AccordionSummary>Raw queue data</AccordionSummary>}
            >
              <QueueDataContainer>
                {scenario.data.depositQueueBatches ? (
                  <>
                    <div>[</div>
                    {scenario.data.depositQueueBatches.priorities.map(
                      (priority, index) => (
                        <div key={index} className="queue">
                          <div>Priority {index}:</div>
                          <div
                            className="queue"
                            dangerouslySetInnerHTML={{
                              __html: highlightOperatorBatches(
                                JSON.stringify(priority),
                                scenario.data.nodeOperatorId,
                              ),
                            }}
                          ></div>
                        </div>
                      ),
                    )}
                    <div>]</div>
                  </>
                ) : (
                  <div>undefined (fallback mode)</div>
                )}
              </QueueDataContainer>
            </StyledAccordion>
          </TestBlock>
        ))}
      </TestContainer>
    </Layout>
  );
};

export default DepositQueueGraphTestPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const { defaultChain } = getSecretConfig();

  if (defaultChain === 1) {
    return { notFound: true };
  }

  return { props: {} };
};
