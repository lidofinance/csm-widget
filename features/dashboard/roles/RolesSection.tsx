import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock } from 'shared/components';
import { useAccount, useNodeOperatorInfo } from 'shared/hooks';
import { Wrapper } from './styles';
import { RoleBlock } from './RoleBlock';
import { ROLES_PATH } from 'consts/urls';

export const RolesSection: FC = () => {
  const { address } = useAccount();
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
            isYou={address === info.managerAddress}
          />
          <RoleBlock
            title="Reward address"
            address={info.rewardAddress}
            proposedAddress={info.proposedRewardAddress}
            isYou={address === info.rewardAddress}
          />
        </Wrapper>
      )}
    </SectionBlock>
  );
};
