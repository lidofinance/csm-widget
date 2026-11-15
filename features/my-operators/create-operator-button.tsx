import { Button, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const CreateOperatorButton: FC = () => (
  <Stack align="start">
    <Button
      href={PATH.CREATE}
      variant="outline"
      size="small"
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.myOperatorsCreate)
      }
      dataTestId={{ root: 'createAnotherOperator' }}
    >
      Create new NO
    </Button>
  </Stack>
);
