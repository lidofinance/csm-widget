import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { StyledBlock } from './styles';
import { Stack } from 'shared/components';
import { ICS_ASSESSED_DATE } from '../shared';

export const RoundBanner: FC = () => (
  <StyledBlock>
    <Stack direction="column">
      <Text size="sm" weight={700}>
        ICS application round is open
      </Text>
      <Text size="xxs">
        If you are applying to ICS, please submit your application by{' '}
        {ICS_ASSESSED_DATE}. All applications received by that date will be
        assessed as of {ICS_ASSESSED_DATE}. Applications submitted after{' '}
        {ICS_ASSESSED_DATE} will be considered in the next assessment round.
      </Text>
    </Stack>
  </StyledBlock>
);
