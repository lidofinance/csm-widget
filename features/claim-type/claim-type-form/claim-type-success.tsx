import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import {
  BadgeMain,
  BadgeText,
  BadgeWrapper,
  StyledButton,
  StyledContainer,
} from './styles';

export const ClaimTypeSuccess: FC = () => {
  return (
    <StyledContainer>
      <BadgeWrapper>
        <BadgeMain>
          <BadgeText>ICS</BadgeText>
        </BadgeMain>
      </BadgeWrapper>
      <Stack direction="column">
        <Text size="xl" weight={700}>
          Congratulations!
        </Text>
        <Text size="xs">
          You have claimed the Identified Community Staker operator type
          <br />
          You can see the new parameters for your Node Operator by clicking the
          ICS badge on the top of the screen
        </Text>
      </Stack>
      <StyledButton fullwidth>Amazing!</StyledButton>
    </StyledContainer>
  );
};
