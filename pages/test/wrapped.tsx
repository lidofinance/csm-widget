import { Accordion, Block, Text } from '@lidofinance/lido-ui';
import { Wrapped } from 'features/wrapped';
import { MockWrappedScenarioData } from 'mock/wrapped/mock-data';
import { MockWrappedProvider } from 'mock/wrapped/mock-providers';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { getFirstParam } from 'utils';
import { getTestProps } from 'utilsApi';
import wrappedStats from 'utilsApi/wrapped-stats/stats.json';

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

const WrappedTestPage: FC = () => {
  const { query } = useRouter();
  const operatorId =
    parseInt(getFirstParam(query['operatorId']) ?? '', 10) || 0;
  const stats =
    wrappedStats[operatorId.toString() as keyof typeof wrappedStats] ||
    wrappedStats['0'];

  const scenario: MockWrappedScenarioData = {
    nodeOperatorId: operatorId,
    stats,
  };

  return (
    <Layout dummy title="Wrapped Test">
      <TestContainer>
        <TestBlock>
          <TestTitle>Operator #{operatorId}</TestTitle>
          <TestDescription>
            Performance: {stats.avgPerformance / 100}% | Percentile:{' '}
            {stats.topPerformancePercentile} | Strikes: {stats.strikesCount} |
            ICS: {stats.hasICS ? 'Yes' : 'No'}
          </TestDescription>
          <StyledAccordion
            summary={
              <Text size="xs" color="secondary">
                All Operators ({Object.keys(wrappedStats).length})
              </Text>
            }
          >
            <Stack direction="column" gap="xxs">
              {Object.keys(wrappedStats).map((id) => (
                <LocalLink key={id} query={{ operatorId: id }}>
                  Operator #{id}
                </LocalLink>
              ))}
            </Stack>
          </StyledAccordion>
        </TestBlock>
        <MockWrappedProvider key={operatorId} scenario={scenario}>
          <Wrapped />
        </MockWrappedProvider>
      </TestContainer>
    </Layout>
  );
};

export default WrappedTestPage;

export const getServerSideProps = getTestProps;
