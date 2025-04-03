import { FC } from 'react';
import { Address, Warning } from 'shared/components';
import { RoleBlockProposed } from './styles';

type Props = { address?: string };

export const ProposedAddress: FC<Props> = ({ address }) => {
  if (!address) return null;

  return (
    <RoleBlockProposed>
      <Warning text="Pending change:" />
      <Address address={address} size="xxs" />
    </RoleBlockProposed>
  );
};
