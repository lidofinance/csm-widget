import { ROLES } from '@lidofinance/lido-csm-sdk/common';
import { Faq } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ChangeRoleForm } from './change-role-form';

export const ChangeRewardRole = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ChangeRoleForm key={key} role={ROLES.REWARDS} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
