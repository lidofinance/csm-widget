import { Card, EmptyState, IconKeyRound } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import s from './keys-empty.module.css';

export const KeysEmpty: FC = () => (
  <Card align="stretch" dataTestId={{ root: 'viewKeysBlock' }}>
    <EmptyState
      illustration={<IconKeyRound className={s.icon} />}
      title="No keys at the moment"
      description="Once you add keys, they’ll appear here"
    />
  </Card>
);
