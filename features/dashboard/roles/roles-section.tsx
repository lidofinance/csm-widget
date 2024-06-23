import { ROLES_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock } from 'shared/components';
import { useAddressCompare, useNodeOperatorInfo } from 'shared/hooks';
import { RoleBlock } from './role-block';
import { Wrapper } from './styles';

export const RolesSection: FC = () => {
  const isYou = useAddressCompare();
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);

  return (
    <SectionBlock title="Roles" href={ROLES_PATH}>
      {info && (
        <Wrapper>
          <RoleBlock
            title="Manager address"
            address={info.managerAddress}
            proposedAddress={info.proposedManagerAddress}
            isYou={isYou(info.managerAddress)}
          />
          <RoleBlock
            title="Rewards address"
            address={info.rewardAddress}
            proposedAddress={info.proposedRewardAddress}
            isYou={isYou(info.rewardAddress)}
          />
        </Wrapper>
      )}
    </SectionBlock>
  );
};
