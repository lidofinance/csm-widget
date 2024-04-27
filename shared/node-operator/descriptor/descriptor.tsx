import { FC } from 'react';

import { NodeOperatorRoles } from 'types';
import { RoleBadge, RoleBadgeProps } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  roles: NodeOperatorRoles;
  roleBackground?: RoleBadgeProps['background'];
};

export const Descriptor: FC<DescriptorProps> = ({ roles, roleBackground }) => {
  return (
    <DescriptorStyle>
      <DescriptorId id={roles.id} />
      <DescriptorRolesStyle>
        {roles.rewards && (
          <RoleBadge roleName="rewards" background={roleBackground} />
        )}
        {roles.manager && (
          <RoleBadge roleName="manager" background={roleBackground} />
        )}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
