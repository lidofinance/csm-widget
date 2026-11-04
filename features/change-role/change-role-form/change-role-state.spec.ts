import {
  getChangeRoleSubmitLabel,
  getConfirmChangeRoleStepCopy,
  getConfirmChangeRoleSteps,
  getPendingChangeIntent,
  shouldRenderChangeRoleForm,
  shouldShowGroupingNote,
} from './change-role-state';

const CONNECTED = '0x1111111111111111111111111111111111111111';
const OTHER = '0x2222222222222222222222222222222222222222';
const NEW = '0x3333333333333333333333333333333333333333';

describe('getChangeRoleSubmitLabel', () => {
  it('labels the manager reset', () => {
    expect(getChangeRoleSubmitLabel('manager-reset', 'Manager')).toBe(
      'Reset Manager Address',
    );
  });

  it('labels a proposal', () => {
    expect(getChangeRoleSubmitLabel('propose', 'Rewards')).toBe(
      'Propose a new Rewards Address',
    );
  });

  it('labels a direct rewards change', () => {
    expect(getChangeRoleSubmitLabel('rewards-change', 'Rewards')).toBe(
      'Change Rewards Address',
    );
  });
});

describe('getConfirmChangeRoleSteps', () => {
  it('orders rewards before repropose', () => {
    expect(
      getConfirmChangeRoleSteps({ showRewards: true, showRepropose: true }),
    ).toEqual(['rewards', 'repropose']);
  });

  it('keeps only repropose', () => {
    expect(
      getConfirmChangeRoleSteps({ showRewards: false, showRepropose: true }),
    ).toEqual(['repropose']);
  });

  it('is empty without steps', () => {
    expect(
      getConfirmChangeRoleSteps({ showRewards: false, showRepropose: false }),
    ).toEqual([]);
  });
});

describe('getConfirmChangeRoleStepCopy', () => {
  it('pins the rewards proposal copy with the hint', () => {
    expect(getConfirmChangeRoleStepCopy('rewards', true)).toEqual({
      title: 'All rewards will be claimable to the proposed address',
      body: 'After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards Address. In the event of validator withdrawal, the whole bond is also returned to the new address.',
      hint: 'The change doesn’t apply immediately. To complete the address change, the owner of the new address must confirm the change.',
    });
  });

  it('drops the hint for a direct change', () => {
    const copy = getConfirmChangeRoleStepCopy('rewards', false);

    expect(copy.title).toBe('All rewards will be claimable to the new address');
    expect(copy.hint).toBeUndefined();
  });

  it('pins the repropose copy', () => {
    expect(getConfirmChangeRoleStepCopy('repropose', true)).toEqual({
      title: 'Only most recent proposed address change is valid',
      body: 'When you propose a new address for change - the previous change proposal is voided',
    });
  });
});

describe('getPendingChangeIntent', () => {
  it('revokes while proposing, even with an invite', () => {
    expect(getPendingChangeIntent({ action: 'propose', hasInvite: true })).toBe(
      'revoke',
    );
  });

  it('accepts an invite in the view state', () => {
    expect(getPendingChangeIntent({ action: 'view', hasInvite: true })).toBe(
      'accept',
    );
  });

  it('has no action otherwise', () => {
    expect(
      getPendingChangeIntent({ action: 'view', hasInvite: false }),
    ).toBeUndefined();
    expect(
      getPendingChangeIntent({ action: 'manager-reset', hasInvite: false }),
    ).toBeUndefined();
  });
});

describe('shouldRenderChangeRoleForm', () => {
  it('renders no form for a plain view', () => {
    expect(
      shouldRenderChangeRoleForm({ action: 'view', hasInvite: false }),
    ).toBe(false);
  });

  it('renders a form in the view state with an invite to accept', () => {
    expect(
      shouldRenderChangeRoleForm({ action: 'view', hasInvite: true }),
    ).toBe(true);
  });

  it('renders a form for an executable action', () => {
    expect(
      shouldRenderChangeRoleForm({ action: 'propose', hasInvite: false }),
    ).toBe(true);
  });
});

describe('shouldShowGroupingNote', () => {
  const base = {
    newAddress: NEW,
    address: CONNECTED,
    currentAddress: CONNECTED,
    otherRoleAddress: OTHER,
  } as const;

  it('shows when the connected wallet gives up its only role', () => {
    expect(shouldShowGroupingNote(base)).toBe(true);
  });

  it('hides when the connected wallet keeps the other role', () => {
    expect(
      shouldShowGroupingNote({ ...base, otherRoleAddress: CONNECTED }),
    ).toBe(false);
  });

  it('hides for an invalid or missing new address', () => {
    expect(shouldShowGroupingNote({ ...base, newAddress: '0x123' })).toBe(
      false,
    );
    expect(shouldShowGroupingNote({ ...base, newAddress: undefined })).toBe(
      false,
    );
  });

  it('hides when the new address is the connected one', () => {
    expect(shouldShowGroupingNote({ ...base, newAddress: CONNECTED })).toBe(
      false,
    );
  });

  it('hides when the connected wallet does not hold this role', () => {
    expect(shouldShowGroupingNote({ ...base, currentAddress: OTHER })).toBe(
      false,
    );
  });
});
