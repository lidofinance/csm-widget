import { Button, Text } from '@lidofinance/lido-ui';
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Address, OwnerChip, YouChip } from 'shared/components';
import { useNavigate } from 'shared/navigate';
import {
  PendingChangeStyle,
  RoleAddressColumn,
  RoleNameColumn,
  RoleRowStyle,
} from './styles';

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
        {isOwner && <OwnerChip />}
        {isYou && <YouChip />}
      </RoleNameColumn>

      <RoleAddressColumn>
        {address && <Address address={address} showIcon />}

        {proposedAddress && (
          <PendingChangeStyle>
            <AlertIcon />
            <span>Pending change:</span>
            <Address address={proposedAddress} showIcon />
          </PendingChangeStyle>
        )}
      </RoleAddressColumn>

      {path && (
        <Button size="xs" variant="outlined" onClick={onEdit}>
          {address ? 'Edit' : 'Set up'}
        </Button>
      )}
    </RoleRowStyle>
  );
};
