import {
  getNodeOperatorRoles,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { useDappStatus, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CurveBadge } from '../curve-badge/curve-badge';
import { DescriptorId } from '../descriptor/descriptor-id';
import { DescriptorRolesStyle } from '../descriptor/styles';
import { RoleBadge } from '../role-badge/role-badge';
import { CmRowButtonStyle, CmRowDescriptor } from './cm-styles';

type SelectRowProps = {
  shortInfo: NodeOperatorShortInfo;
  onSelect: (id: NodeOperatorId) => void;
};

export const SelectRow: FC<SelectRowProps> = ({ shortInfo, onSelect }) => {
  const { address } = useDappStatus();
  const { nodeOperatorId, curveId } = shortInfo;
  const roles = getNodeOperatorRoles(shortInfo, address);
  const { data: metadata } = useOperatorMetadata(nodeOperatorId);

  return (
    <CmRowButtonStyle
      onClick={() => onSelect(nodeOperatorId)}
      data-testid="selectModalOperatorRow"
    >
      <Stack direction="column" gap="none">
        <CmRowDescriptor>
          <DescriptorId id={nodeOperatorId} />
        </CmRowDescriptor>
        {metadata && (
          <Text
            size="xxs"
            color="secondary"
            data-testid="selectModalOperatorName"
          >
            {metadata.name}
          </Text>
        )}
      </Stack>
      <CmRowDescriptor>
        <CurveBadge curveId={curveId} inline />
        <DescriptorRolesStyle>
          {roles.map((role) => (
            <RoleBadge role={role} key={role} />
          ))}
        </DescriptorRolesStyle>
      </CmRowDescriptor>
    </CmRowButtonStyle>
  );
};
