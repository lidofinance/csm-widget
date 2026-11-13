import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { RewardsHistoryCard } from 'features/bond-rewards';
import { MockRewardsHistoryProvider } from 'mock/rewards/mock-providers';
import { testScenarios } from 'mock/rewards/test-scenarios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Accordion, Card, Description, Stack } from '@lidofinance/lido-app-ui';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';

// only deployments where the SDK actually constructs — undeployed modules crash useSmSDK
const MODULES = deployedModules;

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const TestBlock = styled(Card)`
  padding: 16px;
`;

const TestTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--lido-app-ui-color-text-default);
`;

const TestDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--lido-app-ui-color-text-secondary);
`;

const RewardsHistoryTestPage: FC = () => {
  const { query } = useRouter();
  const _case = parseInt(getFirstParam(query['case']) ?? '', 10) || 0;
  const scenario = testScenarios[_case];
  const moduleParam = getFirstParam(query['module']);
  const selectedModule = MODULES.includes(moduleParam as MODULE_NAME)
    ? (moduleParam as MODULE_NAME)
    : MODULES[0];

  return (
    <Layout dummy title="Rewards History Test">
      <TestContainer>
        <TestBlock>
          <TestTitle>{scenario.title}</TestTitle>
          <TestDescription>{scenario.description}</TestDescription>
          <Stack direction="row" gap={4} align="center">
            <Description color="secondary">Module:</Description>
            {MODULES.map((m) => (
              <LocalLink key={m} query={{ case: `${_case}`, module: m }}>
                {m === selectedModule ? <b>{m}</b> : m}
              </LocalLink>
            ))}
          </Stack>
          <Accordion
            border={false}
            title={
              <Description color="secondary">
                All Test Cases ({testScenarios.length})
              </Description>
            }
          >
            <Stack direction="column" gap={2}>
              {testScenarios.map((s, i) => (
                <LocalLink
                  key={i}
                  query={{ case: `${i}`, module: selectedModule }}
                >
                  {i}: {s.title}
                </LocalLink>
              ))}
            </Stack>
          </Accordion>
        </TestBlock>
        <MockRewardsHistoryProvider
          key={`${_case}-${selectedModule}`}
          scenario={scenario.data}
          module={selectedModule}
        >
          <RewardsHistoryCard />
        </MockRewardsHistoryProvider>
      </TestContainer>
    </Layout>
  );
};

export default RewardsHistoryTestPage;

export const getStaticProps = getTestProps;
