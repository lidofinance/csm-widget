import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ResetRoleForm } from './reset-role-form';

export const ResetManagerRole = () => {
  const key = useWeb3Key();

  return (
    <>
      <NoSSRWrapper>
        <ResetRoleForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
