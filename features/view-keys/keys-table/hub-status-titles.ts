import type { KEY_STATUS } from '@lidofinance/lido-csm-sdk';

export const HUB_STATUS_TITLES: Partial<Record<KEY_STATUS, string>> = {
  ACTIVATION_PENDING: 'Pending activation',
  INVALID: 'Invalid signature',
  WITHDRAWAL_PENDING: 'Exited',
};
