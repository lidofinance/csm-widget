import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { StyledBlock } from './styles';
import { Stack } from 'shared/components';

export const RoundBanner: FC = () => (
  <StyledBlock>
    <Stack direction="column">
      <Text size="sm" weight={700}>
        ICS Application Round #2 is open
      </Text>
      <Text size="xxs">
        All applications received after October 1 will be evaluated in December.
        Stay tuned for the announcement of the final date for Application Round
        #2.
      </Text>
    </Stack>
  </StyledBlock>
);
