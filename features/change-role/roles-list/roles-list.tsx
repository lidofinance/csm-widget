import { Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import {
  useCustomRewardsClaimer,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import { FormBlock, Stack } from 'shared/components';
import { useShowFlags } from 'shared/hooks/use-show-rule';
import { zeroAddress } from 'viem';
import { RoleRow } from './role-row';
import { SplitterRow } from './splitter-row';
import { Divider } from './styles';

export const RolesList: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const {
    HAS_MANAGER_ROLE,
    HAS_REWARDS_ROLE,
    HAS_OWNER_ROLE,
    CAN_EDIT_SPLITS,
  } = useShowFlags();

  const isClaimerSet = !!claimerAddress && claimerAddress !== zeroAddress;

  return (
    <FormBlock $gap="xl">
      <Text size="md" weight={700} as="h4">
        Roles
      </Text>

      <Stack direction="column" gap="lg">
        <RoleRow
          title="Rewards Address"
          address={info?.rewardsAddress}
          proposedAddress={info?.proposedRewardsAddress}
          isYou={HAS_REWARDS_ROLE}
          isOwner={!info?.extendedManagerPermissions}
          path={PATH.SETTINGS_REWARDS_ADDRESS}
        />

        <Divider />

        <RoleRow
          title="Manager Address"
          address={info?.managerAddress}
          proposedAddress={info?.proposedManagerAddress}
          isYou={HAS_MANAGER_ROLE}
          isOwner={!!info?.extendedManagerPermissions}
          path={PATH.SETTINGS_MANAGER_ADDRESS}
        />

        <Divider />

        <RoleRow
          title="Rewards claimer"
          address={isClaimerSet ? claimerAddress : undefined}
          path={HAS_OWNER_ROLE ? PATH.SETTINGS_CLAIMER : undefined}
        />

        <Divider />

        <SplitterRow
          feeSplits={feeSplits}
          path={PATH.SETTINGS_SPLITS}
          canEdit={CAN_EDIT_SPLITS}
        />
      </Stack>
    </FormBlock>
  );
};
