import { getIncomingRequestsCopy } from './incoming-requests-copy';

describe('getIncomingRequestsCopy', () => {
  it('returns null without invites', () => {
    expect(getIncomingRequestsCopy([])).toBeNull();
  });

  it('names the Manager Address for one invite', () => {
    expect(
      getIncomingRequestsCopy([{ nodeOperatorId: 124, role: 'MANAGER' }]),
    ).toBe(
      'Your connected address has been proposed as the Manager Address for Node Operator #124',
    );
  });

  it('names the Rewards Address for one invite', () => {
    expect(
      getIncomingRequestsCopy([{ nodeOperatorId: 7n, role: 'REWARDS' }]),
    ).toBe(
      'Your connected address has been proposed as the Rewards Address for Node Operator #7',
    );
  });

  it('uses the generic copy for several invites', () => {
    expect(
      getIncomingRequestsCopy([
        { nodeOperatorId: 1, role: 'MANAGER' },
        { nodeOperatorId: 2, role: 'REWARDS' },
      ]),
    ).toBe(
      'Your connected address has been proposed as the Manager / Rewards Address for multiple Node Operators',
    );
  });
});
