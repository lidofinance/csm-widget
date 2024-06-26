import { Loader } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { AcceptInviteFormInputType, useAcceptInviteFormData } from './context';
import { WrapperStyle } from './styles';

export const FormLoading: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<AcceptInviteFormInputType>();
  const { loading, invites } = useAcceptInviteFormData();
  const isEmpty = !invites?.length;

  if (isLoading || loading.isInvitesLoading) {
    return (
      <WrapperStyle>
        <Loader size="medium" />;
      </WrapperStyle>
    );
  }

  return (
    <>
      {isEmpty ? (
        <WrapperStyle>You don’t have any incoming requests</WrapperStyle>
      ) : (
        children
      )}
    </>
  );
};
