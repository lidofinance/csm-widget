import { FC } from 'react';
import { Stack } from '@lidofinance/lido-app-ui';
import { ClusterMembersHubSection } from './cluster-members-hub-section';
import { DkgSection } from './dkg-section';
import { IncomingRequestsBanner } from './incoming-requests-banner';
import { MetadataSection } from './metadata-section';
import { OperatorTypeHubSection } from './operator-type-hub-section';
import { RolesSection } from './roles-section';
import { TopUpsSection } from './top-ups-section';

export const SettingsHub: FC = () => (
  <Stack direction="column" gap={52}>
    <IncomingRequestsBanner />
    <RolesSection />
    <ClusterMembersHubSection />
    <OperatorTypeHubSection />
    <MetadataSection />
    <DkgSection />
    <TopUpsSection />
  </Stack>
);
