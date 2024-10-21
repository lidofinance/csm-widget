import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { RoleBlock } from './role-block';

export const RolesSection: FC = () => {
  const isUserAddress = useAddressCompare();
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);

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
            isYou={isUserAddress(info.managerAddress)}
          />
          <RoleBlock
            title="Rewards Address"
            address={info.rewardAddress}
            proposedAddress={info.proposedRewardAddress}
            isYou={isUserAddress(info.rewardAddress)}
          />
        </Stack>
      )}
    </SectionBlock>
  );
};
