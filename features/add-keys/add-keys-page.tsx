import { FC } from 'react';

import { Layout, Switch } from 'shared/components';
import { AddKeys } from './add-keys';
import { SwitchRoutes } from 'shared/components/switch/types';
import { KEYS_PATH, KEYS_REMOVE_PATH } from 'consts/urls';

const KEYS_ROUTES: SwitchRoutes = [
  { name: 'Upload keys', path: KEYS_PATH },
  { name: 'Remove keys', path: KEYS_REMOVE_PATH },
];

export const AddKeysPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Upload more keys">
      <Switch active={0} routes={KEYS_ROUTES} />
      <AddKeys />
    </Layout>
  );
};
