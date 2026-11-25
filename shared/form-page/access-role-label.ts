import { AccessLevel } from '@lidofinance/lido-csm-sdk';

/** Role that may perform the action, or `null` when no role applies (anyone / protocol role). */
export const getAccessRoleLabel = (
  level: AccessLevel,
  extendedManagerPermissions?: boolean,
): string | null => {
  switch (level) {
    case AccessLevel.MANAGER:
      return 'Manager';
    case AccessLevel.REWARDS:
      return 'Rewards';
    case AccessLevel.OWNER:
      return extendedManagerPermissions ? 'Manager' : 'Rewards';
    case AccessLevel.PROPOSED_MANAGER:
      return 'Proposed Manager';
    case AccessLevel.PROPOSED_REWARDS:
      return 'Proposed Rewards';
    case AccessLevel.CLAIMER:
      return 'Manager, Rewards, or Claimer';
    default:
      return null;
  }
};
