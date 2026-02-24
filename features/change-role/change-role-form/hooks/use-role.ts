import { ROLES_METADATA } from 'consts';
import { useChangeRoleFormData } from '../context';

export const useRole = () => {
  const { role } = useChangeRoleFormData(true);
  return ROLES_METADATA[role].title;
};
