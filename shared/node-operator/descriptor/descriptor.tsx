import { FC } from 'react';

import {
  getNodeOperatorRoles,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { getModuleOperatorType } from 'consts';
import { useDappStatus } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: NodeOperatorShortInfo;
  hideType?: boolean;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator, hideType }) => {
  const type = getModuleOperatorType(nodeOperator.curveId);
  const { address } = useDappStatus();
  const roles = getNodeOperatorRoles(nodeOperator, address);

  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.nodeOperatorId} />
      {!hideType && <CurveBadge type={type} />}
      <DescriptorRolesStyle>
        {roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
