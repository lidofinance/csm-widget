import { Accordion, Block, Text } from '@lidofinance/lido-ui';
import { MockMembersProvider } from 'mock/idvtc-members/mock-providers';
import { testScenarios } from 'mock/idvtc-members/scenarios';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';

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

const IdvtcMembersTestPage: FC = () => {
  const { query } = useRouter();
  const _case = parseInt(getFirstParam(query['case']) ?? '', 10) || 0;
  const scenario = testScenarios[_case] ?? testScenarios[0];

  return (
    <Layout dummy title="IDVTC Members Test">
      <TestContainer>
        <TestBlock>
          <TestTitle>
            [{scenario.group}] {scenario.title}
          </TestTitle>
          <TestDescription>{scenario.description}</TestDescription>
          <StyledAccordion
            summary={
              <Text size="xs" color="secondary">
                All cases ({testScenarios.length})
              </Text>
            }
          >
            <Stack direction="column" gap="xxs">
              {testScenarios.map((s, i) => (
                <LocalLink key={i} query={{ case: `${i}` }}>
                  {i}: [{s.group}] {s.title}
                </LocalLink>
              ))}
            </Stack>
          </StyledAccordion>
        </TestBlock>

        <MockMembersProvider key={_case}>
          {scenario.render()}
        </MockMembersProvider>
      </TestContainer>
    </Layout>
  );
};

export default IdvtcMembersTestPage;

export const getServerSideProps = getTestProps;
