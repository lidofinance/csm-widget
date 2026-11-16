import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/form-page';
import { useMetadataFlow, useMetadataFormData } from './context';
import {
  MetadataReadOnlyCard,
  MetadataRestrictedNotice,
} from './metadata-read-only-card';

export const MetadataFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useMetadataFlow();
  const { currentName, currentDescription } = useMetadataFormData(true);

  if (flow.action === 'update') return <>{children}</>;

  return (
    <MetadataReadOnlyCard
      name={currentName}
      description={currentDescription}
      notice={
        flow.action === 'no-access' ? (
          <NoAccessNotice access={flow.access} />
        ) : (
          <MetadataRestrictedNotice />
        )
      }
    />
  );
};
