import { FC } from 'react';
import { StatusStyle, Variants } from './style';
import { KeyStatus } from 'types';

type Props = {
  status?: KeyStatus;
};

const variants: Partial<Record<KeyStatus, Variants>> = {
  depositable: 'default',
  active: 'success',
  exited: 'secondary',
  duplicated: 'error',
  stuck: 'error',
  invalid: 'error',
  unvetted: 'error',
  unbonded: 'warning',
};

export const StatusChip: FC<Props> = ({ status }) =>
  status && <StatusStyle $variant={variants[status]}>{status}</StatusStyle>;
