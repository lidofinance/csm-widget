import { Address, Tag } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import {
  useCustomRewardsClaimer,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import {
  HubList,
  HubRow,
  HubRowEmptyValue,
  HubSection,
} from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { zeroAddress } from 'viem';
import { formatSplittersValue } from './format-splitters-value';

const PendingTag: FC = () => <Tag variant="warning">Pending change</Tag>;

const AddressValue: FC<{ address?: string }> = ({ address }) =>
  address ? (
    <Address address={address} symbols={6} identicon={24} />
  ) : (
    <HubRowEmptyValue />
  );

export const RolesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo({ nodeOperatorId });
  const { data: claimerAddress } = useCustomRewardsClaimer({ nodeOperatorId });
  const { data: feeSplits } = useFeeSplits({ nodeOperatorId });
  const { IS_CM, IS_CSM_FAMILY } = useShowFlags();

  const isClaimerSet = !!claimerAddress && claimerAddress !== zeroAddress;
  const splittersValue = formatSplittersValue(feeSplits, IS_CSM_FAMILY);

  return (
    <HubSection
      title="Roles"
      subtitle={
        IS_CM
          ? 'Manage the addresses that control your operator and receive rewards'
          : undefined
      }
      dataTestId="settingsRolesSection"
    >
      <HubList>
        <HubRow
          title="Rewards Address"
          tag={info?.proposedRewardsAddress ? <PendingTag /> : undefined}
          value={<AddressValue address={info?.rewardsAddress} />}
          href={PATH.SETTINGS_REWARDS_ADDRESS}
          dataTestId="rewardsAddressRow"
        />
        <HubRow
          title="Manager Address"
          tag={info?.proposedManagerAddress ? <PendingTag /> : undefined}
          value={<AddressValue address={info?.managerAddress} />}
          href={PATH.SETTINGS_MANAGER_ADDRESS}
          dataTestId="managerAddressRow"
        />
        <HubRow
          title="Rewards claimer"
          value={
            <AddressValue address={isClaimerSet ? claimerAddress : undefined} />
          }
          href={PATH.SETTINGS_CLAIMER}
          dataTestId="claimerAddressRow"
        />
        <HubRow
          title="Rewards splitters"
          value={splittersValue ?? <HubRowEmptyValue />}
          href={PATH.SETTINGS_SPLITS}
          dataTestId="feeSplitsRow"
        />
      </HubList>
    </HubSection>
  );
};
