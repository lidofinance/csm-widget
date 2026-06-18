import { FC } from 'react';

import {
  getNodeOperatorRoles,
  MODULE_NAME,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { getModuleOperatorType } from 'consts';
import { useDappStatus, useSmSDK } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { ModuleBadge } from '../module-badge/module-badge';
import { RoleBadge } from '../role-badge/role-badge';
import { DescriptorId } from './descriptor-id';
import { DescriptorRolesStyle, DescriptorStyle } from './styles';

type DescriptorProps = {
  nodeOperator: NodeOperatorShortInfo & { module?: MODULE_NAME };
  hideType?: boolean;
};

export const Descriptor: FC<DescriptorProps> = ({ nodeOperator, hideType }) => {
  const sm = useSmSDK();
  const type = getModuleOperatorType(sm.core.moduleName, nodeOperator.curveId);
  const { address } = useDappStatus();
  const roles = getNodeOperatorRoles(nodeOperator, address);

  return (
    <DescriptorStyle>
      <DescriptorId id={nodeOperator.nodeOperatorId} />
      <ModuleBadge module={nodeOperator.module} />
      {!hideType && <CurveBadge type={type} />}
      <DescriptorRolesStyle>
        {roles.map((role) => (
          <RoleBadge role={role} key={role} />
        ))}
      </DescriptorRolesStyle>
    </DescriptorStyle>
  );
};
