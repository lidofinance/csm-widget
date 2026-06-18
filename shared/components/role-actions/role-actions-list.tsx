import { ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { getRoleActions } from './role-actions';

type Props = {
  role: ROLES;
  extendedManagerPermissions: boolean;
};

export const RoleActionsList: FC<Props> = ({
  role,
  extendedManagerPermissions,
}) => {
  const { isCM } = useModule();

  return (
    <>
      The {ROLES_METADATA[role].capitalizedTitle} Address is used for:
      <ul>
        {getRoleActions(role, extendedManagerPermissions, isCM).map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </>
  );
};
