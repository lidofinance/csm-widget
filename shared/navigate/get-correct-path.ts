import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { ShowFlags } from 'shared/hooks';

export const getCorrectPath = (
  path: PATH,
  role: ROLE_CODE,
  flags: ShowFlags,
): PATH => {
  const isNone = role === ROLE_CODE.NONE;
  const hasRole = !isNone;

  switch (path) {
    // Role pages — non-operators → inbox
    case PATH.ROLES:
    case PATH.ROLES_REWARDS_ADDRESS:
    case PATH.ROLES_MANAGER_ADDRESS:
    case PATH.ROLES_CLAIMER:
    case PATH.ROLES_SPLITS:
      return isNone ? PATH.ROLES_INBOX : path;

    // Create — operators already have keys
    case PATH.CREATE:
      return hasRole ? PATH.KEYS_VIEW : path;

    // Keys
    case PATH.KEYS:
      return isNone ? PATH.CREATE : PATH.KEYS_VIEW;
    case PATH.KEYS_SUBMIT:
      return role === ROLE_CODE.REWARDS ? PATH.KEYS_VIEW : path;
    case PATH.KEYS_REMOVE:
      return role === ROLE_CODE.REWARDS ? PATH.KEYS_EXIT : path;
    case PATH.KEYS_EJECT:
    case PATH.KEYS_EXIT:
      return isNone ? PATH.CREATE : path;
    case PATH.KEYS_VIEW:
      return isNone ? PATH.HOME : path;

    // Bond
    case PATH.BOND:
      return isNone ? PATH.HOME : PATH.BOND_CLAIM;
    case PATH.BOND_CLAIM:
    case PATH.BOND_ADD:
    case PATH.BOND_UNLOCK:
      return isNone ? PATH.HOME : path;

    // Type/ICS — flag-based
    case PATH.TYPE:
      if (flags['CAN_CLAIM_ICS']) return hasRole ? PATH.TYPE_CLAIM : path;
      if (flags['ICS_APPLY_ENABLED']) return PATH.TYPE_ICS_APPLY;
      return PATH.TYPE_PARAMETERS;
    case PATH.TYPE_CLAIM:
      return isNone
        ? flags['ICS_APPLY_ENABLED']
          ? PATH.TYPE_ICS_SYSTEM
          : PATH.TYPE_PARAMETERS
        : path;

    default:
      return path;
  }
};
