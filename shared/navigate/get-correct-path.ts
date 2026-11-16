import { PATH } from 'consts/urls';
import { ShowFlags } from 'shared/hooks';

export const getCorrectPath = (path: PATH, flags: ShowFlags): PATH => {
  const hasRole = flags.HAS_MANAGER_ROLE || flags.HAS_REWARDS_ROLE;
  const canClaim = flags.HAS_ANY_ROLE;

  switch (path) {
    // Settings pages — non-operators → inbox
    case PATH.SETTINGS:
    case PATH.SETTINGS_REWARDS_ADDRESS:
    case PATH.SETTINGS_MANAGER_ADDRESS:
    case PATH.SETTINGS_CLAIMER:
    case PATH.SETTINGS_SPLITS:
      return hasRole ? path : PATH.SETTINGS_INBOX;
    case PATH.SETTINGS_GENERAL:
    case PATH.SETTINGS_METADATA:
      return flags.IS_CM ? path : PATH.SETTINGS;

    // Create
    case PATH.CREATE: {
      if (hasRole && !flags.CAN_CREATE) return PATH.KEYS;
      if (flags.HAS_APPLY_OPTIONS) return path;
      const csmCreatable =
        flags.CAN_CREATE_0X01 ||
        flags.CAN_CREATE_ICS ||
        flags.CAN_CREATE_IDVTC ||
        flags.CAN_CREATE_0X02;
      // CM-only wallets have no Acknowledgement; curated-operator-success relies on this collapse
      return flags.CAN_CREATE_CM && !csmCreatable ? PATH.CREATE_CM : path;
    }

    // Keys
    case PATH.KEYS:
      return hasRole ? path : PATH.CREATE;
    case PATH.KEYS_SUBMIT:
      return flags.HAS_MANAGER_ROLE ? path : PATH.KEYS;
    case PATH.KEYS_DELETE:
      return hasRole ? path : PATH.CREATE;

    // Bond — a claimer-only wallet is kept inside the claim page
    case PATH.BOND:
      return hasRole ? path : canClaim ? PATH.BOND_CLAIM : PATH.HOME;
    case PATH.BOND_CLAIM:
      return canClaim ? path : PATH.HOME;
    case PATH.BOND_ADD:
    case PATH.BOND_UNLOCK:
      return hasRole ? path : canClaim ? PATH.BOND_CLAIM : PATH.HOME;

    // Type/ICS — flag-based
    case PATH.TYPE:
      if (!flags.ICS_APPLY_ENABLED) {
        return flags.CAN_CLAIM_ICS && hasRole
          ? PATH.TYPE_ICS_CLAIM
          : flags.CAN_CLAIM_IDVTC && hasRole
            ? PATH.TYPE_IDVTC_CLAIM
            : PATH.HOME;
      }
      return path;
    case PATH.TYPE_ICS_CLAIM:
      return flags.CAN_CLAIM_ICS
        ? path
        : flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_ICS_SYSTEM
          : PATH.HOME;
    case PATH.TYPE_IDVTC_CLAIM:
      return flags.CAN_CLAIM_IDVTC
        ? path
        : flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_IDVTC_DESCRIPTION
          : PATH.HOME;

    default:
      return path;
  }
};
