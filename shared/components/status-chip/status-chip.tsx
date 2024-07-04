import { FC } from 'react';
import { StatusStyle } from './style';
import { KeyStatus } from 'types';

type Props = {
  status: KeyStatus;
};

export const StatusChip: FC<Props> = ({ status }) => (
  <StatusStyle>{status}</StatusStyle>
);
