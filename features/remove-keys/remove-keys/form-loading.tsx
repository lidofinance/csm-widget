import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { RemoveKeysFormInputType, useRemoveKeysFormData } from './context';

export const FormLoading: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<RemoveKeysFormInputType>();
  const { loading, keys } = useRemoveKeysFormData();
  const isEmpty = !keys?.length;

  return (
    <WhenLoaded
      loading={isLoading || loading.isKeysLoading}
      empty={isEmpty && 'You don’t have any keys to remove'}
    >
      {children}
    </WhenLoaded>
  );
};
