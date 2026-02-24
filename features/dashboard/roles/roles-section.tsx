import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useCustomRewardsClaimer,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { zeroAddress } from 'viem';
import { RoleRow } from './role-row';
import { SplitterRow } from './splitter-row';
import { Divider } from './styles';

export const RolesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const { HAS_MANAGER_ROLE, HAS_REWARDS_ROLE, HAS_OWNER_ROLE } = useShowFlags();

  const isClaimerSet = !!claimerAddress && claimerAddress !== zeroAddress;

  return (
    <SectionBlock
      title="Settings"
      href={PATH.SETTINGS}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
    >
      <Stack direction="column" gap="lg">
        <RoleRow
          title="Rewards Address"
          address={info?.rewardsAddress}
          proposedAddress={info?.proposedRewardsAddress}
          isYou={HAS_REWARDS_ROLE}
          isOwner={!info?.extendedManagerPermissions}
        />

        <Divider />

        <RoleRow
          title="Manager Address"
          address={info?.managerAddress}
          proposedAddress={info?.proposedManagerAddress}
          isYou={HAS_MANAGER_ROLE}
          isOwner={!!info?.extendedManagerPermissions}
        />

        <Divider />

        <RoleRow
          title="Rewards claimer"
          address={isClaimerSet ? claimerAddress : undefined}
          setupPath={HAS_OWNER_ROLE ? PATH.SETTINGS_CLAIMER : undefined}
        />

        <Divider />

        <SplitterRow
          feeSplits={feeSplits}
          setupPath={HAS_OWNER_ROLE ? PATH.SETTINGS_SPLITS : undefined}
        />
      </Stack>
    </SectionBlock>
  );
};
