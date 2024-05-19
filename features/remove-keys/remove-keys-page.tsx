import { FC } from 'react';

import { KEYS_PATH, KEYS_REMOVE_PATH } from 'consts/urls';
import { Layout, Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { RemoveKeys } from './remove-keys';

const KEYS_ROUTES: SwitchRoutes = [
  { name: 'Upload keys', path: KEYS_PATH },
  { name: 'Remove keys', path: KEYS_REMOVE_PATH },
];

export const RemoveKeysPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      subtitle="Remove keys"
      containerSize="content"
    >
      <Switch active={1} routes={KEYS_ROUTES} />
      <RemoveKeys />
    </Layout>
  );
};
