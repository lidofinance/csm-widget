import { Tag, TagVariant } from '@lidofinance/lido-app-ui';
import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { StatusTitle } from 'shared/components/status-chip/key-status-chip';

const VARIANTS: Partial<Record<KEY_STATUS, TagVariant>> = {
  [KEY_STATUS.NON_QUEUED]: 'warning',
  [KEY_STATUS.DEPOSITABLE]: 'default',
  [KEY_STATUS.ACTIVATION_PENDING]: 'default',
  [KEY_STATUS.ACTIVE]: 'success',
  [KEY_STATUS.EXITING]: 'neutral',
  [KEY_STATUS.WITHDRAWAL_PENDING]: 'neutral',
  [KEY_STATUS.WITHDRAWN]: 'neutral',
  [KEY_STATUS.UNCHECKED]: 'warning',
  [KEY_STATUS.DUPLICATED]: 'error',
  [KEY_STATUS.INVALID]: 'error',
  [KEY_STATUS.UNBONDED]: 'error',
  [KEY_STATUS.TRIGGERED_EJECTION]: 'neutral',
  [KEY_STATUS.EXIT_REQUESTED]: 'warning',
  [KEY_STATUS.SLASHED]: 'neutral',
};

export const getKeyStatusTagVariant = (
  status: KEY_STATUS,
): TagVariant | undefined => VARIANTS[status];

export type KeyStatusTagProps = { status: KEY_STATUS };

/** app-ui `Tag` for a key status; renders nothing for statuses the legacy chip hides. */
export const KeyStatusTag: FC<KeyStatusTagProps> = ({ status }) => {
  const variant = getKeyStatusTagVariant(status);
  if (!variant) return null;

  return <Tag variant={variant}>{StatusTitle[status]}</Tag>;
};
