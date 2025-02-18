import { Link } from '@lidofinance/lido-ui';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { WelcomeSection } from './welcome-section-component';
import { ErrorWrapper } from 'dappnode/components/text-wrappers';
import { Note } from 'shared/components';

export const ECNoLogsPage: FC = () => {
  const { stakersUiUrl } = useDappnodeUrls();
  return (
    <Layout>
      <WelcomeSection>
        <ErrorWrapper>
          <h2>Execution Client not storing logs</h2>
        </ErrorWrapper>
        <p>Your Execution Client is not configured to store log receipts.</p>
        <p>
          Please either enable log receipt storage on your current client or
          switch to an Execution Client that supports this feature by default.
        </p>
        <Link href={stakersUiUrl}>Switch your Execution client</Link>{' '}
        <Note>
          Clients like Besu, Geth, and Nethermind store log receipts by default.
        </Note>
      </WelcomeSection>{' '}
    </Layout>
  );
};
