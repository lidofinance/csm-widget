import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Address, OwnerChip, PendingChange, YouChip } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { RoleAddressColumn, RoleNameColumn, RoleRowStyle } from './styles';

type RoleRowProps = {
  title: string;
  address?: string;
  proposedAddress?: string;
  isYou?: boolean;
  isOwner?: boolean;
  canEdit?: boolean;
  path: PATH;
};

export const RoleRow: FC<RoleRowProps> = ({
  title,
  address,
  proposedAddress,
  isYou,
  isOwner,
  canEdit = false,
  path,
}) => {
  const buttonLabel = canEdit ? (!address ? 'Set up' : 'Edit') : 'View';

  return (
    <RoleRowStyle>
      <RoleNameColumn>
        <Text size="xs" weight={700}>
          {title}
        </Text>
        {isYou && <YouChip />}
        {isOwner && <OwnerChip />}
      </RoleNameColumn>

      <RoleAddressColumn>
        {address && <Address address={address} showIcon />}

        {proposedAddress && <PendingChange address={proposedAddress} />}
      </RoleAddressColumn>

      <LocalLink href={path}>
        <Button size="xs" variant="outlined">
          {buttonLabel}
        </Button>
      </LocalLink>
    </RoleRowStyle>
  );
};
