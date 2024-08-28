import { FC } from 'react';
import { Stack } from 'shared/components';
import { AddressBadge } from 'shared/wallet';
import { ProposedAddress } from './proposed-address';
import { Chip, RoleBlockWrapper, RoleTitle } from './styles';

type RoleBlockProps = {
  title: string;
  address: string;
  proposedAddress?: string;
  isYou?: boolean;
};

export const RoleBlock: FC<RoleBlockProps> = ({
  title,
  isYou,
  address,
  proposedAddress,
}) => {
  return (
    <RoleBlockWrapper>
      <Stack gap="sm">
        <RoleTitle>{title}</RoleTitle>
        {isYou && <Chip>You</Chip>}
      </Stack>
      <AddressBadge address={address} />
      <ProposedAddress address={proposedAddress} />
    </RoleBlockWrapper>
  );
};
