import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { EmptyState, EmptyStateIcon } from '../styles';

import { ReactComponent as FileTextIcon } from 'assets/icons/file-text.svg';

export const DkgEmptyState: FC = () => (
  <EmptyState>
    <EmptyStateIcon>
      <FileTextIcon />
    </EmptyStateIcon>
    <Text size="sm" weight={700}>
      No DKG files at the moment
    </Text>
    <Text size="xxs" color="secondary">
      Upload your first distributed key generation file
    </Text>
  </EmptyState>
);
