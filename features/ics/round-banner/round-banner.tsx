import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { StyledBlock } from './styles';
import { Stack } from 'shared/components';
import { ICS_ROUND } from '../shared/consts';

export const RoundBanner: FC = () => (
  <StyledBlock>
    <Stack direction="column">
      <Text size="sm" weight={700}>
        ICS Application Round #{ICS_ROUND.round} is ongoing
      </Text>
      <Text size="xxs">
        All applications received after {ICS_ROUND.startDate} will be evaluated
        in {ICS_ROUND.assessedDate}.
        {!ICS_ROUND.isPreciseAssessedDate && (
          <>
            {' '}
            Stay tuned for the announcement of the final date for Application
            Round #{ICS_ROUND.round}
          </>
        )}
      </Text>
    </Stack>
  </StyledBlock>
);
