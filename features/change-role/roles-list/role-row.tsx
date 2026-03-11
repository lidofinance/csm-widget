import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Address, OwnerChip, PendingChange, YouChip } from 'shared/components';
import { useNavigate } from 'shared/navigate';
import { RoleAddressColumn, RoleNameColumn, RoleRowStyle } from './styles';

type RoleRowProps = {
  title: string;
  address?: string;
  proposedAddress?: string;
  isYou?: boolean;
  isOwner?: boolean;
  path?: PATH;
};

export const RoleRow: FC<RoleRowProps> = ({
  title,
  address,
  proposedAddress,
  isYou,
  isOwner,
  path,
}) => {
  const navigate = useNavigate();
  const onEdit = useCallback(() => path && navigate(path), [navigate, path]);

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

      {path && (
        <Button size="xs" variant="outlined" onClick={onEdit}>
          {address ? 'Edit' : 'Set up'}
        </Button>
      )}
    </RoleRowStyle>
  );
};
