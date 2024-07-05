import { ROLES } from 'consts/roles';
import { useChangeRoleFormData } from '../context';

const ROLE_TITLES = {
  [ROLES.MANAGER]: 'manager',
  [ROLES.REWARDS]: 'rewards',
} as const;

export const useRole = () => {
  const { role } = useChangeRoleFormData();
  return ROLE_TITLES[role];
};
