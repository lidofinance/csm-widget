import { Plus } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { CreateTileStyle } from './styles';

export const CreateOperatorTile: FC = () => (
  <LocalLink
    href={PATH.CREATE}
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.myOperatorsCreate}
    data-testid="createAnotherOperator"
  >
    <CreateTileStyle>
      <Plus />
      Create another operator
    </CreateTileStyle>
  </LocalLink>
);
