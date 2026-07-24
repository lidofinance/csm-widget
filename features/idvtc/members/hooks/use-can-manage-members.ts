import { useShowRule } from 'shared/hooks';

// Both the Manager and the Rewards address can manage cluster members.
export const useCanManageMembers = (): boolean => {
  const check = useShowRule();
  return check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');
};
