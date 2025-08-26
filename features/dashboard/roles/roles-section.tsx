import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import {
  useAddressCompare,
  useNodeOperatorInfo,
  useNodeOperatorOwner,
} from 'shared/hooks';
import { RoleBlock } from './role-block';
import { ROLES } from 'consts/roles';

export const RolesSection: FC = () => {
  const isUserAddress = useAddressCompare();
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: owner } = useNodeOperatorOwner(id);

  return (
    <SectionBlock
      title="Roles"
      href={PATH.ROLES}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink}
    >
      {info && (
        <Stack wrap>
          <RoleBlock
            type={ROLES.MANAGER}
            address={info.managerAddress}
            proposedAddress={info.proposedManagerAddress}
            isYou={isUserAddress(info.managerAddress)}
            isOwner={owner?.role === ROLES.MANAGER}
          />
          <RoleBlock
            type={ROLES.REWARDS}
            address={info.rewardAddress}
            proposedAddress={info.proposedRewardAddress}
            isYou={isUserAddress(info.rewardAddress)}
            isOwner={owner?.role === ROLES.REWARDS}
          />
        </Stack>
      )}
    </SectionBlock>
  );
};
