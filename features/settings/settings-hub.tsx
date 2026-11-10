import { Stack } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { ClusterMembersHubSection } from './cluster-members-hub-section';
import { DkgSection } from './dkg-section';
import { IncomingRequestsBanner } from './incoming-requests-banner';
import { MetadataSection } from './metadata-section';
import { OperatorTypeHubSection } from './operator-type-hub-section';
import { RolesSection } from './roles-section';
import { TopUpsSection } from './top-ups-section';

export const SettingsHub: FC = () => {
  const faq = useFaq('ROLES');

  return (
    <Stack direction="column" gap={52}>
      <IncomingRequestsBanner />
      <RolesSection />
      <ClusterMembersHubSection />
      <OperatorTypeHubSection />
      <MetadataSection />
      <DkgSection />
      <TopUpsSection />
      <Faq items={faq} />
    </Stack>
  );
};
