import { FC } from 'react';

import { getNodeOperatorRoles } from '@lidofinance/lido-csm-sdk';
import { ModuleNodeOperator, useDappStatus } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: ModuleNodeOperator;
  hideType?: boolean;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator, hideType }) => {
  const { address } = useDappStatus();
  const roles = getNodeOperatorRoles(nodeOperator, address);

  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.nodeOperatorId} />
      {!hideType && <CurveBadge curve={nodeOperator} />}
      <DescriptorRolesStyle>
        {roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
