import { Link } from '@lidofinance/lido-ui';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { WelcomeSection } from './welcome-section-component';
import { ErrorWrapper } from 'dappnode/components/text-wrappers';

export const ECNotInstalledPage: FC = () => {
  const { stakersUiUrl } = useDappnodeUrls();

  return (
    <Layout>
      <WelcomeSection>
        <ErrorWrapper>
          <h2>Execution client is not installed</h2>
        </ErrorWrapper>
        <p>
          This UI requires an execution client synced to function properly.{' '}
          <br />
          Please select and Execution client and wait until it&apos;s synced
          before continuing.
        </p>
        <Link href={stakersUiUrl}>Set up your node</Link>
      </WelcomeSection>
    </Layout>
  );
};
