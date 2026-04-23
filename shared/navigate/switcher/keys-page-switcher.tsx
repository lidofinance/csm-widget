import { PATH } from 'consts/urls';
import { CounterInvalidKeys } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const KEYS_ROUTES: SwitcherRoutes = [
  {
    title: 'Submit',
    path: PATH.KEYS_SUBMIT,
    showRules: ['HAS_MANAGER_ROLE'],
  },
  {
    title: 'Delete',
    path: PATH.KEYS_EXIT,
    subpaths: [PATH.KEYS_EJECT, PATH.KEYS_REMOVE],
    suffix: <CounterInvalidKeys />,
  },
  { title: 'View keys', path: PATH.KEYS_VIEW },
];

export const KeysPageSwitcher = () => <Switcher routes={KEYS_ROUTES} />;
