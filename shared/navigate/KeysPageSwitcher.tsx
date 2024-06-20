import {
  KEYS_REMOVE_PATH,
  KEYS_SUBMIT_PATH,
  KEYS_VIEW_PATH,
} from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const KEYS_ROUTES: SwitchRoutes = [
  { title: 'Submit', path: KEYS_SUBMIT_PATH, roles: { manager: true } },
  { title: 'Remove', path: KEYS_REMOVE_PATH, roles: { manager: true } },
  { title: 'View keys', path: KEYS_VIEW_PATH },
];

export const KeysPageSwitcher = () => <Switch routes={KEYS_ROUTES} />;
