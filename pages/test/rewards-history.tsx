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
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';
import s from './rewards-history.module.css';

// only deployments where the SDK actually constructs — undeployed modules crash useSmSDK
const MODULES = deployedModules;

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
      <Stack gap={24} className={s.container}>
        <Card padding={16}>
          <h3 className={s.title}>{scenario.title}</h3>
          <p className={s.description}>{scenario.description}</p>
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
              {testScenarios.map((item, i) => (
                <LocalLink
                  key={i}
                  query={{ case: `${i}`, module: selectedModule }}
                >
                  {i}: {item.title}
                </LocalLink>
              ))}
            </Stack>
          </Accordion>
        </Card>
        <MockRewardsHistoryProvider
          key={`${_case}-${selectedModule}`}
          scenario={scenario.data}
          module={selectedModule}
        >
          <RewardsHistoryCard />
        </MockRewardsHistoryProvider>
      </Stack>
    </Layout>
  );
};

export default RewardsHistoryTestPage;

export const getStaticProps = getTestProps;
