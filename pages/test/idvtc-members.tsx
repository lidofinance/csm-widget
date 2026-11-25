import { MockMembersProvider } from 'mock/idvtc-members/mock-providers';
import { testScenarios } from 'mock/idvtc-members/scenarios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Accordion, Card, Description, Stack } from '@lidofinance/lido-app-ui';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';
import s from './idvtc-members.module.css';

const IdvtcMembersTestPage: FC = () => {
  const { query } = useRouter();
  const _case = parseInt(getFirstParam(query['case']) ?? '', 10) || 0;
  const scenario = testScenarios[_case] ?? testScenarios[0];

  return (
    <Layout dummy title="IDVTC Members Test">
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

        <MockMembersProvider key={_case}>
          {scenario.render()}
        </MockMembersProvider>
      </Stack>
    </Layout>
  );
};

export default IdvtcMembersTestPage;

export const getStaticProps = getTestProps;
