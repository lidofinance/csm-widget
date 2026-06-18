import { ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { getRoleActions } from './role-actions';

type Props = {
  role: ROLES;
  extendedManagerPermissions: boolean;
  // Pre-operator screens (create/invite flows) must override with the static
  // deploy module, since there is no active operator to derive it from.
  isCM?: boolean;
};

export const RoleActionsList: FC<Props> = ({
  role,
  extendedManagerPermissions,
  isCM: isCMOverride,
}) => {
  const { isCM: activeIsCM } = useModule();
  const isCM = isCMOverride ?? activeIsCM;

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
