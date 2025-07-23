import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import invariant from 'tiny-invariant';
import { isAddressEqual } from 'viem';
import { RoleBlock } from './role-block';

export const RolesSection: FC = () => {
  const { address } = useDappStatus();
  const id = useNodeOperatorId();
  const { data: info } = useOperatorInfo(id);

  invariant(address, 'address should be defined');

  return (
    <SectionBlock
      title="Roles"
      href={PATH.ROLES}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
    >
      {info && (
        <Stack wrap>
          <RoleBlock
            title="Manager Address"
            address={info.managerAddress}
            proposedAddress={info.proposedManagerAddress}
            isYou={isAddressEqual(info.managerAddress, address)}
          />
          <RoleBlock
            title="Rewards Address"
            address={info.rewardsAddress}
            proposedAddress={info.proposedRewardsAddress}
            isYou={isAddressEqual(info.rewardsAddress, address)}
          />
        </Stack>
      )}
    </SectionBlock>
  );
};
