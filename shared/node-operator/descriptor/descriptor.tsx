import { FC } from 'react';

import { NodeOperatorRoles } from 'types';
import { RoleBadge, RoleBadgeProps } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';
import { getShortRolesList } from '../utils';

type DescriptorProps = {
  roles: NodeOperatorRoles;
  roleBackground?: RoleBadgeProps['background'];
};

export const Descriptor: FC<DescriptorProps> = ({ roles, roleBackground }) => {
  return (
    <DescriptorStyle>
      <DescriptorId id={roles.id} />
      <DescriptorRolesStyle>
        {getShortRolesList(roles).map((role) => (
          <RoleBadge key={role} role={role} background={roleBackground} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
