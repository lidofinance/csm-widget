import { FC } from 'react';
import { EmptyState } from '@lidofinance/lido-app-ui';

import FileTextIcon from 'assets/icons/file-text.svg?react';

export const DkgEmptyState: FC = () => (
  <EmptyState
    illustration={<FileTextIcon />}
    title="No DKG files at the moment"
    description="Upload your first distributed key generation file"
  />
);
