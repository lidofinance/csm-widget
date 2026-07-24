import { ROLES } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from 'modules/web3';
import { useShowFlags } from './use-show-rule';

export type ChangeRoleMode =
  | 'managerReset'
  | 'rewardsChange'
  | 'propose'
  | 'view';

export const useCanEditManagerRole = (): ChangeRoleMode | false => {
  const { nodeOperator } = useNodeOperator();
  const { HAS_MANAGER_ROLE, HAS_REWARDS_ROLE } = useShowFlags();

  const canManagerReset =
    nodeOperator?.extendedManagerPermissions === false &&
    HAS_REWARDS_ROLE &&
    !HAS_MANAGER_ROLE;

  const canProposeManagerChange = HAS_MANAGER_ROLE;

  return canManagerReset
    ? 'managerReset'
    : canProposeManagerChange
      ? 'propose'
      : false;
};

export const useCanEditRewardsRole = () => {
  const { nodeOperator } = useNodeOperator();
  const { HAS_MANAGER_ROLE, HAS_REWARDS_ROLE } = useShowFlags();

  const canRewardsChange =
    !!nodeOperator?.extendedManagerPermissions && HAS_MANAGER_ROLE;

  const canProposeRewardsChange = HAS_REWARDS_ROLE;

  return canRewardsChange
    ? 'rewardsChange'
    : canProposeRewardsChange
      ? 'propose'
      : false;
};

export const useChangeRoleMode = (role: ROLES): ChangeRoleMode => {
  const managerMode = useCanEditManagerRole();
  const rewardsMode = useCanEditRewardsRole();

  return (role === ROLES.MANAGER ? managerMode : rewardsMode) || 'view';
};
