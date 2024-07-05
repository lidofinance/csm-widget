import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { Faq } from 'shared/components';
import { ViewRoleSection } from './view-role-section';

export const ViewRewardRole = () => {
  const key = useWeb3Key();
  return (
    <>
      <ViewRoleSection key={key} />
      <Faq />
    </>
  );
};
