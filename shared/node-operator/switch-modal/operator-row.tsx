import {
  getNodeOperatorRoles,
  MODULE_NAME,
  NodeOperatorId,
  SubOperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { STAKE_COLORS } from 'features/group/shared/stake-stats';
import {
  useDappStatus,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorMetadata,
} from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC, useMemo } from 'react';
import { Stack } from 'shared/components';
import { computeStakeData, getPercent } from 'utils';
import { CurveBadge } from '../curve-badge/curve-badge';
import { DescriptorId } from '../descriptor/descriptor-id';
import { DescriptorRolesStyle } from '../descriptor/styles';
import { RoleBadge } from '../role-badge/role-badge';
import {
  CmRowDescriptor,
  CmRowStyle,
  CompactBar,
  CompactBarSegment,
} from './cm-styles';

export type OperatorAction = 'current' | 'switch' | 'view';

type OperatorRowProps = {
  nodeOperatorId: NodeOperatorId;
  shortInfo?: ModuleNodeOperator;
  stakeSummary?: SubOperatorStakeSummary;
  action: OperatorAction;
  onSwitch: (id: NodeOperatorId, module: MODULE_NAME) => void;
};

export const OperatorRow: FC<OperatorRowProps> = ({
  nodeOperatorId,
  shortInfo,
  stakeSummary,
  action,
  onSwitch,
}) => {
  const { address } = useDappStatus();

  // Fetch curveId only for non-available operators (no shortInfo)
  const { data: fetchedCurveId } = useOperatorCurveId(
    shortInfo ? undefined : nodeOperatorId,
  );
  const curveId = shortInfo?.curveId ?? fetchedCurveId;

  // Roles only for available operators
  const roles = shortInfo ? getNodeOperatorRoles(shortInfo, address) : [];

  // Metadata (CM-specific, cached)
  const { data: metadata } = useOperatorMetadata(nodeOperatorId);

  // Operator info for stake computation
  const { data: info } = useOperatorInfo(nodeOperatorId);

  const stakeData = useMemo(
    () =>
      stakeSummary && info ? computeStakeData(stakeSummary, info) : undefined,
    [stakeSummary, info],
  );

  const totalStake = stakeData
    ? stakeData.activeStake +
      stakeData.depositableStake +
      stakeData.potentialAdditionalStake
    : 0n;

  return (
    <CmRowStyle data-testid="switchModalOperatorRow">
      <Stack direction="column" gap="none">
        <Stack gap="sm" center spaceBetween>
          <CmRowDescriptor>
            <DescriptorId id={nodeOperatorId} />
            <CurveBadge curveId={curveId} module={shortInfo?.module} inline />
            <DescriptorRolesStyle>
              {roles.map((role) => (
                <RoleBadge role={role} key={role} />
              ))}
            </DescriptorRolesStyle>
          </CmRowDescriptor>
          <ActionButton
            action={action}
            onSwitch={() =>
              shortInfo && onSwitch(nodeOperatorId, shortInfo.module)
            }
          />
        </Stack>

        {metadata && (
          <Text
            size="xxs"
            color="secondary"
            data-testid="switchModalOperatorName"
          >
            {metadata.name}
          </Text>
        )}
      </Stack>

      {stakeSummary && stakeData && totalStake > 0n && (
        <CompactBar>
          <CompactBarSegment
            $color={STAKE_COLORS.active}
            $width={getPercent(stakeData.activeStake, totalStake)}
          />
          <CompactBarSegment
            $color={STAKE_COLORS.depositable}
            $width={getPercent(stakeData.depositableStake, totalStake)}
          />
          <CompactBarSegment
            $color={STAKE_COLORS.potential}
            $width={getPercent(stakeData.potentialAdditionalStake, totalStake)}
          />
        </CompactBar>
      )}
    </CmRowStyle>
  );
};

const ActionButton: FC<{
  action: OperatorAction;
  onSwitch: () => void;
}> = ({ action, onSwitch }) => {
  switch (action) {
    case 'current':
      return (
        <Button size="xs" variant="ghost" color="secondary" disabled>
          Current
        </Button>
      );
    case 'switch':
      return (
        <Button size="xs" variant="ghost" onClick={onSwitch}>
          Switch
        </Button>
      );
    case 'view':
      return null;
  }
};
