import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Button, InlineLoader, Text } from '@lidofinance/lido-ui';
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
  PendingChange,
  SectionBlock,
  Stack,
  YouChip,
} from 'shared/components';
import {
  useCanEditClaimer,
  useCanEditSplits,
  useShowFlags,
} from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { zeroAddress } from 'viem';
import { DividerStyle, RoleRowStyle, RolesGrid } from './styles';

const formatShare = (share: bigint) => {
  const percent = Number(share) / 100;
  return `${percent}%`;
};

export const RolesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: claimerAddress } = useCustomRewardsClaimer(nodeOperatorId);
  const { data: feeSplits } = useFeeSplits(nodeOperatorId);
  const { HAS_MANAGER_ROLE, HAS_REWARDS_ROLE } = useShowFlags();
  const canEditClaimer = useCanEditClaimer();
  const canEditSplits = useCanEditSplits();

  const isClaimerSet = !!claimerAddress && claimerAddress !== zeroAddress;

  return (
    <SectionBlock
      title="Roles"
      href={PATH.SETTINGS_ROLES}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
      data-testid="rolesSection"
    >
      <RolesGrid>
        <RoleRowStyle data-testid="rewardsAddressRow">
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
                  <PendingChange address={info.proposedRewardsAddress} />
                )}
              </>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle data-testid="managerAddressRow">
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
                  <PendingChange address={info.proposedManagerAddress} />
                )}
              </>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle data-testid="claimerAddressRow">
          <Text size="xs">Rewards claimer</Text>
          <Stack direction="column" gap="md">
            {isClaimerSet && <Address address={claimerAddress} showIcon />}
            {!isClaimerSet && canEditClaimer && (
              <LocalLink href={PATH.SETTINGS_CLAIMER}>
                <Button size="xs" variant="outlined">
                  Set up
                </Button>
              </LocalLink>
            )}
          </Stack>
        </RoleRowStyle>

        <DividerStyle />

        <RoleRowStyle data-testid="feeSplitsRow">
          <Text size="xs">Rewards splitter</Text>
          <Stack direction="column" gap="md">
            {feeSplits?.map((split: FeeSplit) => (
              <Stack gap="lg" center key={split.recipient}>
                <Address address={split.recipient} showIcon />
                <Text size="xxs" color="secondary" data-testid="splitShare">
                  {formatShare(split.share)}
                </Text>
              </Stack>
            ))}
            {!feeSplits?.length && canEditSplits && (
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
