import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Accordion, Block, Text } from '@lidofinance/lido-ui';
import { deployedModules } from 'consts';
import { RewardsHistory } from 'features/rewards-history';
import { MockRewardsHistoryProvider } from 'mock/rewards/mock-providers';
import { testScenarios } from 'mock/rewards/test-scenarios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Stack } from 'shared/components';
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

const TestBlock = styled(Block)`
  padding: 16px;
`;

const TestTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--lido-color-text);
`;

const TestDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--lido-color-textSecondary);
`;

const StyledAccordion = styled(Accordion)`
  margin-top: 16px;
  & > [type='button'] {
    padding: 0;
    min-height: 24px;
  }
  & > [type='button'] + div > div {
    padding: 8px 0 0;
  }
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
          <Stack gap="xs" align="center">
            <Text size="xs" color="secondary">
              Module:
            </Text>
            {MODULES.map((m) => (
              <LocalLink key={m} query={{ case: `${_case}`, module: m }}>
                {m === selectedModule ? <b>{m}</b> : m}
              </LocalLink>
            ))}
          </Stack>
          <StyledAccordion
            summary={
              <Text size="xs" color="secondary">
                All Test Cases ({testScenarios.length})
              </Text>
            }
          >
            <Stack direction="column" gap="xxs">
              {testScenarios.map((s, i) => (
                <LocalLink
                  key={i}
                  query={{ case: `${i}`, module: selectedModule }}
                >
                  {i}: {s.title}
                </LocalLink>
              ))}
            </Stack>
          </StyledAccordion>
        </TestBlock>
        <MockRewardsHistoryProvider
          key={`${_case}-${selectedModule}`}
          scenario={scenario.data}
          module={selectedModule}
        >
          <RewardsHistory />
        </MockRewardsHistoryProvider>
      </TestContainer>
    </Layout>
  );
};

export default RewardsHistoryTestPage;

export const getServerSideProps = getTestProps;
