import { PATH } from 'consts/urls';
import { Text } from '@lidofinance/lido-ui';
import {
  useCustomRewardsClaimer,
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorIsOwner,
} from 'modules/web3';
import { FC } from 'react';
import { FormBlock, Stack } from 'shared/components';
import { isAddressEqual, zeroAddress } from 'viem';
import { RoleRow } from './role-row';
import { SplitterRow } from './splitter-row';
import { Divider } from './styles';

export const RolesList: FC = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const { data: isOwner } = useOperatorIsOwner({ address, nodeOperatorId });

  const isRewardsYou =
    !!address &&
    !!info?.rewardsAddress &&
    isAddressEqual(info.rewardsAddress, address);
  const isManagerYou =
    !!address &&
    !!info?.managerAddress &&
    isAddressEqual(info.managerAddress, address);

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
          isYou={isRewardsYou}
          isOwner={!info?.extendedManagerPermissions}
          path={PATH.ROLES_REWARDS_ADDRESS}
        />

        <Divider />

        <RoleRow
          title="Manager Address"
          address={info?.managerAddress}
          proposedAddress={info?.proposedManagerAddress}
          isYou={isManagerYou}
          isOwner={!!info?.extendedManagerPermissions}
          path={PATH.ROLES_MANAGER_ADDRESS}
        />

        <Divider />

        <RoleRow
          title="Rewards claimer"
          address={isClaimerSet ? claimerAddress : undefined}
          path={isOwner ? PATH.ROLES_CLAIMER : undefined}
        />

        <Divider />

        <SplitterRow
          feeSplits={feeSplits}
          path={isOwner ? PATH.ROLES_SPLITS : undefined}
        />
      </Stack>
    </FormBlock>
  );
};
