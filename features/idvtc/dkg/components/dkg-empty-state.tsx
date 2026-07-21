import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { EmptyStateBox, EmptyStateIcon } from '../styles';

import { ReactComponent as FileTextIcon } from 'assets/icons/file-text.svg';

export const DkgEmptyState: FC = () => (
  <EmptyStateBox>
    <EmptyStateIcon>
      <FileTextIcon />
    </EmptyStateIcon>
    <Text size="sm" weight={700}>
      No DKG files at the moment
    </Text>
    <Text size="xxs" color="secondary">
      Upload your first distributed key generation file
    </Text>
  </EmptyStateBox>
);
