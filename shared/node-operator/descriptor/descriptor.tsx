import { FC } from 'react';

import { NodeOperator } from 'types';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: NodeOperator;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator }) => {
  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.id} />
      <DescriptorRolesStyle>
        {nodeOperator.roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
