import { isModuleCM, isModuleCSM } from 'consts';
import { PATH } from 'consts/urls';
import { ShowFlags } from 'shared/hooks';

export const getCorrectPath = (path: PATH, flags: ShowFlags): PATH => {
  const hasRole = flags.HAS_MANAGER_ROLE || flags.HAS_REWARDS_ROLE;

  switch (path) {
    // Settings pages — non-operators → inbox
    case PATH.SETTINGS:
      return hasRole ? PATH.SETTINGS_ROLES : PATH.SETTINGS_INBOX;
    case PATH.SETTINGS_ROLES:
    case PATH.SETTINGS_REWARDS_ADDRESS:
    case PATH.SETTINGS_MANAGER_ADDRESS:
    case PATH.SETTINGS_CLAIMER:
    case PATH.SETTINGS_SPLITS:
      return hasRole ? path : PATH.SETTINGS_INBOX;
    case PATH.SETTINGS_METADATA:
      return isModuleCM ? path : PATH.SETTINGS;

    // Create
    case PATH.CREATE: {
      if (isModuleCSM && hasRole && !flags.CAN_CREATE) return PATH.KEYS_VIEW;
      // an apply card turns a single creatable type into a real choice
      if (flags.HAS_APPLY_OPTIONS) return path;
      const candidates: (PATH | false)[] = [
        flags.CAN_CREATE_0X01 && PATH.CREATE_0x01,
        flags.CAN_CREATE_ICS && PATH.CREATE_ICS,
        flags.CAN_CREATE_IDVTC && PATH.CREATE_IDVTC,
        flags.CAN_CREATE_0X02 && PATH.CREATE_0x02,
      ];
      const creatable = candidates.filter((p): p is PATH => !!p);
      return creatable.length === 1 ? creatable[0] : path;
    }

    // Keys
    case PATH.KEYS:
      return hasRole
        ? flags.HAS_KEYS || !flags.HAS_MANAGER_ROLE
          ? PATH.KEYS_VIEW
          : PATH.KEYS_SUBMIT
        : PATH.CREATE;
    case PATH.KEYS_SUBMIT:
      return flags.HAS_MANAGER_ROLE ? path : PATH.KEYS_VIEW;
    case PATH.KEYS_REMOVE:
      return flags.HAS_MANAGER_ROLE ? path : PATH.KEYS_EXIT;
    case PATH.KEYS_EJECT:
    case PATH.KEYS_EXIT:
      return hasRole ? path : PATH.CREATE;
    case PATH.KEYS_VIEW:
      return hasRole ? path : PATH.HOME;

    // Bond
    case PATH.BOND:
      return hasRole ? PATH.BOND_CLAIM : PATH.HOME;
    case PATH.BOND_CLAIM:
    case PATH.BOND_ADD:
    case PATH.BOND_UNLOCK:
      return hasRole ? path : PATH.HOME;

    // Type/ICS — flag-based
    case PATH.TYPE:
      if (!flags.ICS_APPLY_ENABLED) {
        return flags.CAN_CLAIM_ICS && hasRole
          ? PATH.TYPE_ICS_CLAIM
          : flags.CAN_CLAIM_IDVTC && hasRole
            ? PATH.TYPE_IDVTC_CLAIM
            : PATH.TYPE_PARAMETERS;
      }
      return path;
    case PATH.TYPE_ICS_CLAIM:
      return hasRole
        ? path
        : flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_ICS_SYSTEM
          : PATH.TYPE_PARAMETERS;
    case PATH.TYPE_IDVTC_CLAIM:
      return hasRole
        ? path
        : flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_IDVTC_DESCRIPTION
          : PATH.TYPE_PARAMETERS;
    case PATH.TYPE_ICS_PARAMETERS:
    case PATH.TYPE_IDVTC_PARAMETERS:
      return flags.ICS_APPLY_ENABLED ? path : PATH.TYPE_PARAMETERS;

    default:
      return path;
  }
};
