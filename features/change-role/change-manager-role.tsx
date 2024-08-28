import { ROLES } from 'consts/roles';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ChangeRoleForm } from './change-role-form';
import { Faq } from 'shared/components';

export const ChangeManagerRole = () => {
  const key = useWeb3Key();

  return (
    <>
      <NoSSRWrapper>
        <ChangeRoleForm key={key} role={ROLES.MANAGER} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
