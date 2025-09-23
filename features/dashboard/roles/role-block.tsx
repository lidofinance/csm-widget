import { FC } from 'react';
import { Address, Stack } from 'shared/components';
import { ProposedAddress } from './proposed-address';
import { Chip, OwnerChip, RoleBlockWrapper, RoleTitle } from './styles';
import { Tooltip } from '@lidofinance/lido-ui';
import { ROLES } from '@lidofinance/lido-csm-sdk';

type RoleBlockProps = {
  type: ROLES;
  address: string;
  proposedAddress?: string;
  isYou?: boolean;
  isOwner?: boolean;
};

export const RoleBlock: FC<RoleBlockProps> = ({
  type,
  isYou,
  isOwner,
  address,
  proposedAddress,
}) => {
  const title = type === ROLES.MANAGER ? 'Manager Address' : 'Rewards Address';
  const ownerTooltip =
    type === ROLES.MANAGER
      ? 'Manager has extended permissions and ultimate control. Can change the Rewards address'
      : 'Rewards address has ultimate control. Can reset the Manager address';
  return (
    <RoleBlockWrapper>
      <Stack gap="sm">
        <RoleTitle>{title}</RoleTitle>
        {isOwner && (
          <Tooltip title={ownerTooltip} placement="top">
            <OwnerChip>Owner</OwnerChip>
          </Tooltip>
        )}
        {isYou && <Chip>You</Chip>}
      </Stack>
      <Address address={address} showIcon big weight={700} size="sm" />
      <ProposedAddress address={proposedAddress} />
    </RoleBlockWrapper>
  );
};
