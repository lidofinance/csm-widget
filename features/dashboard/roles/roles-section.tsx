import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Button, InlineLoader, Text } from '@lidofinance/lido-ui';
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useCustomRewardsClaimer,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import {
  Address,
  OwnerChip,
  SectionBlock,
  Stack,
  YouChip,
} from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { zeroAddress } from 'viem';
import {
  DividerStyle,
  PendingChangeStyle,
  RoleRowStyle,
  RolesGrid,
} from './styles';

const formatShare = (share: bigint) => {
  const percent = Number(share) / 100;
  return `${percent}%`;
};

export const RolesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const { HAS_MANAGER_ROLE, HAS_REWARDS_ROLE, HAS_OWNER_ROLE } = useShowFlags();

  const isClaimerSet = !!claimerAddress && claimerAddress !== zeroAddress;

  return (
    <SectionBlock
      title="Roles"
      href={PATH.SETTINGS_ROLES}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
    >
      <RolesGrid>
        <RoleRowStyle>
          <Stack gap="sm" center>
            <Text size="xs">Rewards Address</Text>
            {HAS_REWARDS_ROLE && <YouChip />}
            {!info?.extendedManagerPermissions && <OwnerChip />}
          </Stack>
          <Stack direction="column" gap="md">
            {!info ? (
              <InlineLoader />
            ) : (
              <>
                <Address address={info.rewardsAddress} showIcon />
                {info.proposedRewardsAddress && (
                  <PendingChangeStyle>
                    <AlertIcon />
                    <span>Pending change:</span>
                    <Address address={info.proposedRewardsAddress} showIcon />
                  </PendingChangeStyle>
                )}
              </>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle>
          <Stack gap="sm" center>
            <Text size="xs">Manager Address</Text>
            {HAS_MANAGER_ROLE && <YouChip />}
            {!!info?.extendedManagerPermissions && <OwnerChip />}
          </Stack>
          <Stack direction="column" gap="md">
            {!info ? (
              <InlineLoader />
            ) : (
              <>
                <Address address={info.managerAddress} showIcon />
                {info.proposedManagerAddress && (
                  <PendingChangeStyle>
                    <AlertIcon />
                    <span>Pending change:</span>
                    <Address address={info.proposedManagerAddress} showIcon />
                  </PendingChangeStyle>
                )}
              </>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle>
          <Text size="xs">Rewards claimer</Text>
          <Stack direction="column" gap="md">
            {isClaimerSet && <Address address={claimerAddress} showIcon />}
            {HAS_OWNER_ROLE && !isClaimerSet && (
              <LocalLink href={PATH.SETTINGS_CLAIMER}>
                <Button size="xs" variant="outlined">
                  Set up
                </Button>
              </LocalLink>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle>
          <Text size="xs">Rewards splitter</Text>
          <Stack direction="column" gap="md">
            {feeSplits?.map((split: FeeSplit) => (
              <Stack gap="lg" center key={split.recipient}>
                <Address address={split.recipient} showIcon />
                <Text size="xxs" color="secondary">
                  {formatShare(split.share)}
                </Text>
              </Stack>
            ))}
            {HAS_OWNER_ROLE && !feeSplits?.length && (
              <LocalLink href={PATH.SETTINGS_SPLITS}>
                <Button size="xs" variant="outlined">
                  Set up
                </Button>
              </LocalLink>
            )}
          </Stack>
        </RoleRowStyle>
      </RolesGrid>
    </SectionBlock>
  );
};
