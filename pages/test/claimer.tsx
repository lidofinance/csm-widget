import { Block } from '@lidofinance/lido-ui';
import { Dashboard } from 'features/dashboard/dashboard';
import { ClaimerDebugPanel } from 'mock/claimer/claimer-debug-panel';
import { MockClaimBondProvider } from 'mock/claim-bond/mock-providers';
import { testScenarios } from 'mock/claim-bond/scenarios';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import styled from 'styled-components';
import { getTestProps } from 'utilsApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

// Connected mock account is the operator's custom rewards claimer only.
// Expect: full dashboard (Keys + Bond + Roles, no Surveys CTA), "You" chip on
// the claimer row, Roles header link present, HAS_CLAIMER_ROLE=true,
// IS_NODE_OPERATOR=false.
const ClaimerTestPage: FC = () => (
  <Layout dummy title="Claimer Shell Test">
    <Container>
      <Block>
        <Stack direction="column" gap="md">
          <MockClaimBondProvider scenario={testScenarios[0].data}>
            <ClaimerDebugPanel />
            <Dashboard />
          </MockClaimBondProvider>
        </Stack>
      </Block>
    </Container>
  </Layout>
);

export default ClaimerTestPage;

export const getServerSideProps = getTestProps;
