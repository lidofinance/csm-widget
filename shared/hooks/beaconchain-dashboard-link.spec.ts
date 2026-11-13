import {
  DASHBOARD_KEYS_LIMIT,
  getBeaconchainDashboardLink,
} from './beaconchain-dashboard-link';

describe('getBeaconchainDashboardLink', () => {
  it('joins keys into the validators query', () => {
    expect(getBeaconchainDashboardLink('https://b.in', ['0x1', '0x2'])).toBe(
      'https://b.in/dashboard?validators=0x1,0x2',
    );
  });

  it('keeps only the first keys up to the limit', () => {
    const keys = Array.from(
      { length: DASHBOARD_KEYS_LIMIT + 5 },
      (_, i) => `k${i}`,
    );
    const query = getBeaconchainDashboardLink('https://b.in', keys).split(
      '=',
    )[1];

    expect(query.split(',')).toEqual(keys.slice(0, DASHBOARD_KEYS_LIMIT));
  });

  it('yields an empty query without keys', () => {
    expect(getBeaconchainDashboardLink('https://b.in')).toBe(
      'https://b.in/dashboard?validators=',
    );
  });
});
