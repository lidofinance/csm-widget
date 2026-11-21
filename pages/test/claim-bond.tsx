import { ClaimBondDebugPanel } from 'mock/claim-bond/debug-panel';
import { MockClaimBondProvider } from 'mock/claim-bond/mock-providers';
import { testScenarios } from 'mock/claim-bond/scenarios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Accordion, Card, Description, Stack } from '@lidofinance/lido-app-ui';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';
import s from './claim-bond.module.css';

const ClaimBondTestPage: FC = () => {
  const { query } = useRouter();
  const _case = parseInt(getFirstParam(query['case']) ?? '', 10) || 0;
  const scenario = testScenarios[_case] ?? testScenarios[0];

  return (
    <Layout dummy title="Claim Bond Test">
      <Stack gap={24} className={s.container}>
        <Card padding={16}>
          <h3 className={s.title}>
            [{scenario.group}] {scenario.title}
          </h3>
          <p className={s.description}>{scenario.description}</p>
          <Accordion
            border={false}
            title={
              <Description color="secondary">
                All cases ({testScenarios.length})
              </Description>
            }
          >
            <Stack direction="column" gap={2}>
              {testScenarios.map((sc, i) => (
                <LocalLink key={i} query={{ case: `${i}` }}>
                  {i}: [{sc.group}] {sc.title}
                </LocalLink>
              ))}
            </Stack>
          </Accordion>
        </Card>

        <MockClaimBondProvider key={_case} scenario={scenario.data}>
          <ClaimBondDebugPanel
            expectOptions={scenario.expectOptions}
            expectEmpty={scenario.expectEmpty}
          />
        </MockClaimBondProvider>
      </Stack>
    </Layout>
  );
};

export default ClaimBondTestPage;

export const getStaticProps = getTestProps;
