import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { FC } from 'react';
import { Address } from 'shared/components/address';
import { PendingChangeStyle } from './style';

type PendingChangeProps = {
  address: string;
};

export const PendingChange: FC<PendingChangeProps> = ({ address }) => (
  <PendingChangeStyle>
    <AlertIcon />
    <span>Pending change:</span>
    <Address address={address} showIcon symbols={4} />
  </PendingChangeStyle>
);
