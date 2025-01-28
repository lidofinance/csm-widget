import { FC } from 'react';
import { Address, Warning } from 'shared/components';
import { RoleBlockProposed } from './styles';
import { Text } from '@lidofinance/lido-ui';

type Props = { address?: string };

export const ProposedAddress: FC<Props> = ({ address }) => {
  if (!address) return null;

  return (
    <RoleBlockProposed>
      <Warning text="Pending change:" />
      <Text size="xxs">
        <Address address={address} />
      </Text>
    </RoleBlockProposed>
  );
};
