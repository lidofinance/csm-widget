import { FC } from 'react';

import { useNodeOperatorCurveType } from 'shared/hooks';
import { NodeOperator } from 'types';
import { CurveBadge } from '../curve-badge/curve-badge';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: NodeOperator;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator }) => {
  const { data: type } = useNodeOperatorCurveType(nodeOperator.id);

  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.id} />
      <CurveBadge type={type} />
      <DescriptorRolesStyle>
        {nodeOperator.roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
