export const DASHBOARD_KEYS_LIMIT = 20;

export const getBeaconchainDashboardLink = (
  beaconchain: string,
  keys: string[] = [],
) =>
  `${beaconchain}/dashboard?validators=${keys
    .slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',')}`;
