import { getRoleTitle } from 'shared/node-operator';
import { useChangeRoleFormData } from '../context';

export const useRole = () => {
  const { role } = useChangeRoleFormData(true);
  return getRoleTitle(role);
};
