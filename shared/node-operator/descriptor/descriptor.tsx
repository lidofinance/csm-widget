import { FC } from 'react';

import { ROLES } from 'consts/roles';
import { NodeOperatorRoles } from 'types';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  roles: NodeOperatorRoles;
};

export const Descriptor: FC<DescriptorProps> = ({ roles }) => {
  return (
    <DescriptorStyle>
      <DescriptorId id={roles.id} />
      <DescriptorRolesStyle>
        <RoleBadge role={(roles.rewards && ROLES.REWARDS) || undefined} />
        <RoleBadge role={(roles.manager && ROLES.MANAGER) || undefined} />
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
