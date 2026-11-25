import { Accordion, Card, Stack } from '@lidofinance/lido-app-ui';
import { DepositQueueGraph } from 'features/view-keys/deposit-queue/deposit-queue-graph';
import { MockDepositQueueProvider } from 'mock/queue/mock-providers';
import { testScenarios } from 'mock/queue/test-scenarios';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { getTestProps } from 'utilsApi';
import s from './queue.module.css';

const highlightOperatorBatches = (
  jsonString: string,
  operatorId: number,
): string => {
  // Replace operator batches with wrapped spans
  const highlighted = jsonString.replace(
    new RegExp(`\\[${operatorId},(\\s*\\d+)\\]`, 'g'),
    `<span class="${s.operatorBatch}">$&</span>`,
  );
  return highlighted;
};

const DepositQueueGraphTestPage: FC = () => {
  return (
    <Layout dummy title="Deposit Queue Graph Test">
      <Stack gap={32} className={s.container}>
        {testScenarios.map((scenario, index) => (
          <Card key={index} padding={24}>
            <h3 className={s.title}>{scenario.title}</h3>
            <p className={s.description}>{scenario.description}</p>
            <MockDepositQueueProvider scenario={scenario.data}>
              <DepositQueueGraph />
            </MockDepositQueueProvider>
            <Accordion
              border={false}
              title={<span className={s.accordionSummary}>Raw queue data</span>}
            >
              <pre className={s.queueData}>
                {scenario.data.depositQueueBatches ? (
                  <>
                    <div>[</div>
                    {scenario.data.depositQueueBatches.priorities.map(
                      (priority, index) => (
                        <div key={index} className={s.queue}>
                          <div>Priority {index}:</div>
                          <div
                            className={s.queue}
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
              </pre>
            </Accordion>
          </Card>
        ))}
      </Stack>
    </Layout>
  );
};

export default DepositQueueGraphTestPage;

export const getStaticProps = getTestProps;
