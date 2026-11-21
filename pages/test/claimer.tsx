import { Stack } from '@lidofinance/lido-app-ui';
import { Dashboard } from 'features/dashboard/dashboard';
import { ClaimerDebugPanel } from 'mock/claimer/claimer-debug-panel';
import { MockClaimBondProvider } from 'mock/claim-bond/mock-providers';
import { testScenarios } from 'mock/claim-bond/scenarios';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { getTestProps } from 'utilsApi';
import s from './claimer.module.css';

// Connected mock account is the operator's custom rewards claimer only.
// Expect: header without Settings, balance + claim cards only; no Roles / "You" chip,
// HAS_CLAIMER_ROLE=true, IS_NODE_OPERATOR=false.
const ClaimerTestPage: FC = () => (
  <Layout dummy title="Claimer Shell Test">
    <Stack gap={24} className={s.container}>
      <Stack direction="column" gap={24}>
        <MockClaimBondProvider scenario={testScenarios[0].data}>
          <ClaimerDebugPanel />
          <Dashboard />
        </MockClaimBondProvider>
      </Stack>
    </Stack>
  </Layout>
);

export default ClaimerTestPage;

export const getStaticProps = getTestProps;
