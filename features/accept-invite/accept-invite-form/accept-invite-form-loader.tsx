import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useAcceptInviteFormData } from './context';

export const AcceptInviteFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const data = useAcceptInviteFormData();
  const isEmpty = !data.invites?.length;

  return (
    <FormLoader empty={isEmpty && `You don't have any incoming requests`}>
      {children}
    </FormLoader>
  );
};
