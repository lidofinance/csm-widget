import { FC } from 'react';
import { StatusStyle, Variants } from './style';
import { KEY_STATUS } from 'consts/key-status';

// DAPPNODE
import { INFRA_STATUS } from 'dappnode/status/types';

type Props = {
  status?: KEY_STATUS | INFRA_STATUS;
};

const variants: Record<KEY_STATUS | INFRA_STATUS, Variants> = {
  [KEY_STATUS.NON_QUEUED]: 'warning',
  [KEY_STATUS.DEPOSITABLE]: 'default',
  [KEY_STATUS.ACTIVATION_PENDING]: 'default',
  [KEY_STATUS.ACTIVE]: 'success',
  [KEY_STATUS.EXITING]: 'secondary',
  [KEY_STATUS.WITHDRAWAL_PENDING]: 'secondary',
  [KEY_STATUS.WITHDRAWN]: 'secondary',

  [KEY_STATUS.UNCHECKED]: 'warning',
  [KEY_STATUS.DUPLICATED]: 'error',
  [KEY_STATUS.INVALID]: 'error',

  [KEY_STATUS.UNBONDED]: 'error',
  [KEY_STATUS.EXIT_REQUESTED]: 'warning',
  [KEY_STATUS.STUCK]: 'error',
  [KEY_STATUS.SLASHED]: 'secondary',

  //DAPPNODE
  [INFRA_STATUS.SYNCED]: 'success',
  [INFRA_STATUS.SYNCING]: 'warning',
  [INFRA_STATUS.NOT_ALLOWED]: 'error',
  [INFRA_STATUS.NOT_INSTALLED]: 'error',
  [INFRA_STATUS.INSTALLED]: 'success',
};

export const StatusTitle: Record<KEY_STATUS | INFRA_STATUS, string> = {
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
  [KEY_STATUS.EXIT_REQUESTED]: 'Exit requested',
  [KEY_STATUS.STUCK]: 'Stuck',
  [KEY_STATUS.SLASHED]: 'Slashed',

  //DAPPNODE
  [INFRA_STATUS.SYNCED]: 'Synced',
  [INFRA_STATUS.SYNCING]: 'Syncing',
  [INFRA_STATUS.NOT_ALLOWED]: 'Not allowed',
  [INFRA_STATUS.NOT_INSTALLED]: 'Not installed',
  [INFRA_STATUS.INSTALLED]: 'Installed',
};

export const StatusChip: FC<Props> = ({ status }) => (
  <>
    {status && (
      <StatusStyle $variant={variants[status]}>
        {StatusTitle[status]}
      </StatusStyle>
    )}
  </>
);
