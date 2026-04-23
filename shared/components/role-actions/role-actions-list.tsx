import { ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import { FC } from 'react';
import { getRoleActions } from './role-actions';

type Props = {
  role: ROLES;
  extendedManagerPermissions: boolean;
};

export const RoleActionsList: FC<Props> = ({
  role,
  extendedManagerPermissions,
}) => (
  <>
    The {ROLES_METADATA[role].capitalizedTitle} Address is used for:
    <ul>
      {getRoleActions(role, extendedManagerPermissions).map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  </>
);
