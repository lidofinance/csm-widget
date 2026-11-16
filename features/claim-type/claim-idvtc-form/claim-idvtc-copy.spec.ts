import { getClaimIdvtcCopy } from './claim-idvtc-copy';

describe('getClaimIdvtcCopy', () => {
  it('keeps the e2e-pinned copy for a non-ICS operator', () => {
    expect(getClaimIdvtcCopy(false)).toEqual({
      title: 'Claim Identified DVT Cluster operator type',
      description:
        'You are eligible to claim a new operator type. Claiming the Identified DVT Cluster operator type will change some parameters for your node operator according to the section below.',
      cta: 'Claim operator type',
    });
  });

  it('offers the upgrade to an ICS operator', () => {
    expect(getClaimIdvtcCopy(true)).toEqual({
      title: 'Claim Identified DVT Cluster operator type',
      description:
        'You are eligible to claim a new operator type. Choose the option you prefer. Claiming the Identified Community Staker operator type will change some parameters for your Node Operator according to the section below.',
      cta: 'Upgrade ICS to IDVTC',
    });
  });
});
