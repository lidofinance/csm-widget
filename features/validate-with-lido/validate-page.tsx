import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { Layout } from 'shared/layout';
import { BannerOperatorCustomAddresses } from 'features/create-node-operator/banner-operator-custom-addresses';
import { ConnectedHero, DisconnectedHero } from './hero';
import { InvitesRedirect } from './invites-redirect';
import { ModulesSection } from './modules/modules-section';

export const ValidatePage: FC = () => {
  const { isAccountActive: isConnected } = useDappStatus();

  return (
    <Layout
      wide
      title="Validate with Lido"
      pageName={isConnected ? 'StarterPack' : 'Welcome'}
    >
      <Stack direction="column" gap={40} align="stretch">
        {isConnected ? (
          <>
            <InvitesRedirect />
            <BannerOperatorCustomAddresses />
            <ConnectedHero />
          </>
        ) : (
          <DisconnectedHero />
        )}
        <ModulesSection />
      </Stack>
    </Layout>
  );
};
