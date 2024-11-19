import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { CounterInvalidKeys } from 'shared/counters';

const KEYS_ROUTES: SwitchRoutes = [
  {
    title: 'Submit',
    path: PATH.KEYS_SUBMIT,
    showRules: ['HAS_MANAGER'],
  },
  {
    title: 'Remove',
    path: PATH.KEYS_REMOVE,
    showRules: ['HAS_MANAGER'],
    suffix: <CounterInvalidKeys />,
  },
  { title: 'View keys', path: PATH.KEYS_VIEW },
];

export const KeysPageSwitcher = () => <Switch routes={KEYS_ROUTES} />;
