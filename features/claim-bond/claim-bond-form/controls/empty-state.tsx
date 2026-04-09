import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import styled from 'styled-components';

import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';

export const EmptyState: FC = () => (
  <Wrapper direction="column" center gap="sm">
    <GreyIcon />
    <Text size="sm" weight={700}>
      Nothing to claim at the moment
    </Text>
    <Text size="xxs" color="secondary">
      Once rewards and excess bond increase, you&apos;ll be able to claim them
      there
    </Text>
  </Wrapper>
);

const Wrapper = styled(Stack)`
  padding: ${({ theme }) => theme.spaceMap.xxl}px 0;
  align-items: center;
  text-align: center;
`;

const GreyIcon = styled(RewardsIcon)`
  width: 52px;
  height: 52px;
  opacity: 0.3;
  filter: grayscale(1);
`;
