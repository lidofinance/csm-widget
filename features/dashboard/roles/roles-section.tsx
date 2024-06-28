import { ROLES_PATH } from 'consts/urls';
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
    <SectionBlock title="Roles" href={ROLES_PATH}>
      {info && (
        <Stack gap="md">
          <RoleBlock
            title="Manager address"
            address={info.managerAddress}
            proposedAddress={info.proposedManagerAddress}
            isYou={isUserAddress(info.managerAddress)}
          />
          <RoleBlock
            title="Rewards address"
            address={info.rewardAddress}
            proposedAddress={info.proposedRewardAddress}
            isYou={isUserAddress(info.rewardAddress)}
          />
        </Stack>
      )}
    </SectionBlock>
  );
};
