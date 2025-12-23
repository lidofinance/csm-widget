import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { StyledBlock } from './styles';
import { Stack } from 'shared/components';
import {
  ICS_ROUND,
  ICS_ROUND_START_DATE,
  ICS_ASSESSED_DATE,
} from '../shared/consts';

export const RoundBanner: FC = () => (
  <StyledBlock>
    <Stack direction="column">
      <Text size="sm" weight={700}>
        ICS Application Round #{ICS_ROUND} is ongoing
      </Text>
      <Text size="xxs">
        All applications received after {ICS_ROUND_START_DATE} will be evaluated
        in {ICS_ASSESSED_DATE}. Stay tuned for the announcement of the final
        date for Application Round #{ICS_ROUND}
      </Text>
    </Stack>
  </StyledBlock>
);
