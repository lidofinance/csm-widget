import { ROLES } from 'consts/roles';
import { useWatch } from 'react-hook-form';
import { ChangeRoleFormInputType } from '../context';

const ROLE_TITLES = {
  [ROLES.MANAGER]: 'manager',
  [ROLES.REWARDS]: 'rewards',
} as const;

export const useRole = () => {
  const role = useWatch<ChangeRoleFormInputType, 'role'>({ name: 'role' });
  return ROLE_TITLES[role];
};
