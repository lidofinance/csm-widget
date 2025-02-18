import { FC } from 'react';
import { Layout } from 'shared/layout';
import { WelcomeSection } from './welcome-section-component';
import { WarningWrapper } from 'dappnode/components/text-wrappers';
import { LoaderBanner } from 'shared/navigate/splash/loader-banner';
import { Link } from '@lidofinance/lido-ui';
import { dappnodeLidoDocsUrls } from 'dappnode/utils/dappnode-docs-urls';

export const ECScanningPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <WarningWrapper>
          <h2>Execution client scanning blocks</h2>
        </WarningWrapper>
        <p>To retrieve data, this UI scans blockchain events.</p>
        <p>
          The first login may take a few minutes, depending on your execution
          client.
        </p>
        <p>
          If you want to reduce the waiting time, use a central RPC node (e.g.,
          Infura). <br />
          Learn more in our{' '}
          <Link href={dappnodeLidoDocsUrls.changeRPC}>Documentation</Link>.
        </p>
        <LoaderBanner />
      </WelcomeSection>
    </Layout>
  );
};
