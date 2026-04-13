import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import styled from 'styled-components';

import { ReactComponent as RewardsIcon } from 'assets/balance/empty.svg';

export const EmptyState: FC = () => (
  <Wrapper direction="column" center gap="sm">
    <RewardsIcon />
    <Text size="sm" weight={700}>
      Nothing to claim at the moment
    </Text>
    <Text size="xxs" color="secondary">
      Once rewards and excess bond increase,
      <br />
      you&apos;ll be able to claim them there
    </Text>
  </Wrapper>
);

const Wrapper = styled(Stack)`
  padding: ${({ theme }) => theme.spaceMap.xxl}px 0;
  text-align: center;

  svg {
    color: var(--lido-color-textSecondary);
    opacity: 0.8;
  }
`;
