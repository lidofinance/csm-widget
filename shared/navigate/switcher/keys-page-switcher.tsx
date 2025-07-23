import { PATH } from 'consts/urls';
import { CounterInvalidKeys, CounterKeysToTransfer } from 'shared/counters';
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
    path: PATH.KEYS_REMOVE,
    subpaths: [PATH.KEYS_EJECT, PATH.KEYS_EXIT],
    showRules: ['HAS_MANAGER_ROLE'],
    suffix: <CounterInvalidKeys />,
  },
  { title: 'View keys', path: PATH.KEYS_VIEW },
  {
    title: 'transfer',
    path: PATH.KEYS_TRANSFER,
    showRules: ['HAS_KEYS_TO_TRANSFER'],
    suffix: <CounterKeysToTransfer />,
  },
];

export const KeysPageSwitcher = () => <Switcher routes={KEYS_ROUTES} />;
