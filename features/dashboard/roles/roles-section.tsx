import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useCustomRewardsClaimer,
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorIsOwner,
} from 'modules/web3';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { isAddressEqual, zeroAddress } from 'viem';
import { RoleRow } from './role-row';
import { SplitterRow } from './splitter-row';
import { Divider } from './styles';

export const RolesSection: FC = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const { data: isOwner } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

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
    <SectionBlock
      title="Roles"
      href={PATH.ROLES}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
    >
      <Stack direction="column" gap="lg">
        <RoleRow
          title="Rewards Address"
          address={info?.rewardsAddress}
          proposedAddress={info?.proposedRewardsAddress}
          isYou={isRewardsYou}
          isOwner={!info?.extendedManagerPermissions}
        />

        <Divider />

        <RoleRow
          title="Manager Address"
          address={info?.managerAddress}
          proposedAddress={info?.proposedManagerAddress}
          isYou={isManagerYou}
          isOwner={!!info?.extendedManagerPermissions}
        />

        <Divider />

        <RoleRow
          title="Rewards claimer"
          address={isClaimerSet ? claimerAddress : undefined}
          setupPath={isOwner ? PATH.ROLES_CLAIMER : undefined}
        />

        <Divider />

        <SplitterRow
          feeSplits={feeSplits}
          setupPath={isOwner ? PATH.ROLES_SPLITS : undefined}
        />
      </Stack>
    </SectionBlock>
  );
};
