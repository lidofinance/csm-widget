import { FC } from 'react';
import { Layout } from 'shared/layout';
import { WelcomeSection } from './welcome-section-component';
import { WarningWrapper } from 'dappnode/components/text-wrappers';
import { LoaderBanner } from 'shared/navigate/splash/loader-banner';

export const ECSyncingPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <WarningWrapper>
          <h2>Execution client is syncing</h2>
        </WarningWrapper>
        <p>
          This UI requires an execution client synced to function properly.{' '}
          <br />
          Please, Wait until it&apos;s synced before continuing.
        </p>
        <LoaderBanner />
      </WelcomeSection>
    </Layout>
  );
};
