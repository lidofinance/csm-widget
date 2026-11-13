import { EmptyState, IconKeyRound } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StretchCard } from 'shared/components/stretch-stack/stretch-stack';
import styled from 'styled-components';

const IconStyled = styled(IconKeyRound)`
  width: 48px;
  height: 48px;
  color: var(--lido-app-ui-color-text-secondary);
`;

export const KeysEmpty: FC = () => (
  <StretchCard dataTestId={{ root: 'viewKeysBlock' }}>
    <EmptyState
      illustration={<IconStyled />}
      title="No keys at the moment"
      description="Once you add keys, they’ll appear here"
    />
  </StretchCard>
);
