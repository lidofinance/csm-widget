import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { ChangeRoleForm } from './change-role-form';
import { ROLES } from 'consts/roles';

export const ChangeRewardRole = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ChangeRoleForm key={key} role={ROLES.REWARDS} />
      </NoSSRWrapper>
    </>
  );
};
