import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, StackWrap } from 'shared/components';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { RoleBlock } from './role-block';

export const RolesSection: FC = () => {
  const isUserAddress = useAddressCompare();
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);

  return (
    <SectionBlock title="Roles" href={PATH.ROLES}>
      {info && (
        <StackWrap gap="md">
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
        </StackWrap>
      )}
    </SectionBlock>
  );
};
