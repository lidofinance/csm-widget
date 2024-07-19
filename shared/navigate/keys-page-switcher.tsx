import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const KEYS_ROUTES: SwitchRoutes = [
  {
    title: 'Submit',
    path: PATH.KEYS_SUBMIT,
    roles: [ROLE_CODE.MANAGER, ROLE_CODE.BOTH],
  },
  {
    title: 'Remove',
    path: PATH.KEYS_REMOVE,
    roles: [ROLE_CODE.MANAGER, ROLE_CODE.BOTH],
  },
  { title: 'View keys', path: PATH.KEYS_VIEW },
];

export const KeysPageSwitcher = () => <Switch routes={KEYS_ROUTES} />;
