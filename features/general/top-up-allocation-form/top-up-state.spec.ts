import { getTopUpCopy } from './top-up-state';

describe('getTopUpCopy', () => {
  it('describes enabled top-ups', () => {
    expect(getTopUpCopy(true)).toEqual({
      status: 'Top-up are currently enabled',
      description:
        'Your Node Operator is eligible for receiving top-up deposits',
    });
  });

  it('describes disabled top-ups and who can enable them', () => {
    expect(getTopUpCopy(false)).toEqual({
      status: 'Top-up are currently disabled',
      description:
        'Your Node Operator is not eligible for receiving top-up deposits. Only the CMC can enable top-ups.',
    });
  });
});
