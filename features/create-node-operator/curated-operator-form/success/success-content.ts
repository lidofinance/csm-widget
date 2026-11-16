import { PATH } from 'consts/urls';

export type CuratedNextStepId = 'keys' | 'bond' | 'dashboard';

export type CuratedNextStep = {
  id: CuratedNextStepId;
  title: string;
  description: string;
  action: string;
  path: PATH;
};

const NEXT_STEPS: CuratedNextStep[] = [
  {
    id: 'keys',
    title: 'Upload validator keys',
    description: 'Upload your validator keys to begin validating',
    action: 'Add keys',
    path: PATH.KEYS_SUBMIT,
  },
  {
    id: 'bond',
    title: 'Fund your bond',
    description: 'Deposit the required ETH bond to activate',
    action: 'Deposit ETH',
    path: PATH.BOND_ADD,
  },
  {
    id: 'dashboard',
    title: 'Monitor performance',
    description: 'Track your operator metrics in the dashboard',
    action: 'Go to Dashboard',
    path: PATH.HOME,
  },
];

export const getCuratedNextSteps = (hasManagerRole: boolean) =>
  hasManagerRole ? NEXT_STEPS : NEXT_STEPS.filter(({ id }) => id !== 'keys');

export const getCustomAddressesNotice = (showCreateAnother: boolean) =>
  `To continue, connect with the address you specified as Reward/Manager Address${
    showCreateAnother
      ? ' or create a new Node Operator using the currently connected address'
      : ''
  }`;
