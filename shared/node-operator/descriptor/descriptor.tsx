import { FC } from 'react';

import { NodeOperator } from '@lidofinance/lido-csm-sdk';
import { useOperatorType } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: NodeOperator;
  hideType?: boolean;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator, hideType }) => {
  const { data: type } = useOperatorType(nodeOperator.id);

  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.id} />
      {!hideType && <CurveBadge type={type} />}
      <DescriptorRolesStyle>
        {nodeOperator.roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
