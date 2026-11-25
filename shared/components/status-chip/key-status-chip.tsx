import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';

export const StatusTitle: { [key in KEY_STATUS]?: string } = {
  [KEY_STATUS.NON_QUEUED]: 'Non queued',
  [KEY_STATUS.DEPOSITABLE]: 'Depositable',
  [KEY_STATUS.ACTIVATION_PENDING]: 'Activation pending',
  [KEY_STATUS.ACTIVE]: 'Active',
  [KEY_STATUS.EXITING]: 'Exiting',
  [KEY_STATUS.WITHDRAWAL_PENDING]: 'Exited (withdrawal pending)',
  [KEY_STATUS.WITHDRAWN]: 'Withdrawn',

  [KEY_STATUS.UNCHECKED]: 'Unchecked',
  [KEY_STATUS.DUPLICATED]: 'Duplicated',
  [KEY_STATUS.INVALID]: 'Invalid',

  [KEY_STATUS.UNBONDED]: 'Unbonded',
  [KEY_STATUS.TRIGGERED_EJECTION]: 'Exit initiated',
  [KEY_STATUS.EXIT_REQUESTED]: 'Exit requested',
  [KEY_STATUS.SLASHED]: 'Slashed',

  [KEY_STATUS.WITH_STRIKES]: 'Strikes',
};
