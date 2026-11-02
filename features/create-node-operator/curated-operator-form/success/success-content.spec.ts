import { PATH } from 'consts/urls';
import {
  getCuratedNextSteps,
  getCustomAddressesNotice,
} from './success-content';

describe('getCuratedNextSteps', () => {
  it('lists keys, bond and dashboard for a manager', () => {
    expect(
      getCuratedNextSteps(true).map(({ id, title, action, path }) => [
        id,
        title,
        action,
        path,
      ]),
    ).toEqual([
      ['keys', 'Upload validator keys', 'Add keys', PATH.KEYS_SUBMIT],
      ['bond', 'Fund your bond', 'Deposit ETH', PATH.BOND_ADD],
      ['dashboard', 'Monitor performance', 'Go to Dashboard', PATH.HOME],
    ]);
  });

  it('drops the keys row without the manager role', () => {
    expect(getCuratedNextSteps(false).map(({ id }) => id)).toEqual([
      'bond',
      'dashboard',
    ]);
  });
});

describe('getCustomAddressesNotice', () => {
  it('offers another operator only when one can be created', () => {
    expect(getCustomAddressesNotice(false)).toBe(
      'To continue, connect with the address you specified as Reward/Manager Address',
    );
    expect(getCustomAddressesNotice(true)).toBe(
      'To continue, connect with the address you specified as Reward/Manager Address or create a new Node Operator using the currently connected address',
    );
  });
});
