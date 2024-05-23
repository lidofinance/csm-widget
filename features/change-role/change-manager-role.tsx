import { ROLES } from 'consts/roles';
import { useNodeOperatorRoles } from 'providers/node-operator-provider';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ChangeRoleForm } from './change-role-form';
import { ResetRoleForm } from './reset-role-form';

export const ChangeManagerRole = () => {
  const key = useWeb3Key();

  const { manager, rewards } = useNodeOperatorRoles();
  const isResetFlow = rewards && !manager;

  return (
    <>
      <NoSSRWrapper>
        {isResetFlow ? (
          <ResetRoleForm key={key} />
        ) : (
          <ChangeRoleForm key={key} role={ROLES.MANAGER} />
        )}
      </NoSSRWrapper>
    </>
  );
};
