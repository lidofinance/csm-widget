import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { RoleActionsList } from 'shared/components';
import { isAddressEqual } from 'viem';
import { RoleAddress } from '../../shared/role-address';
import { RoleCard } from '../../shared/role-card';
import { useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const CurrentAddressCard: FC = () => {
  const roleTitle = useRole();
  const { currentAddress, address, extendedManagerPermissions, role } =
    useChangeRoleFormData(true);

  const isYou = isAddressEqual(currentAddress, address);
  const isOwner = extendedManagerPermissions
    ? role === ROLES.MANAGER
    : role === ROLES.REWARDS;

  return (
    <RoleCard
      data-testid="currentRoleAddress"
      title={`Current ${roleTitle} Address`}
      tooltip={
        <RoleActionsList
          role={role}
          extendedManagerPermissions={extendedManagerPermissions}
        />
      }
    >
      <RoleAddress
        address={currentAddress}
        data-testid="currentAddress"
        tags={
          <>
            {isYou && <Tag variant="neutral">You</Tag>}
            {isOwner && <Tag variant="neutral">Owner</Tag>}
          </>
        }
      />
    </RoleCard>
  );
};
