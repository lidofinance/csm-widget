import { FC, PropsWithChildren } from 'react';
import { WhenLoaded } from 'shared/components';
import { useRemoveKeysFormData } from './context';

export const FormLoading: FC<PropsWithChildren> = ({ children }) => {
  const { loading, keys } = useRemoveKeysFormData();
  const isEmpty = !keys?.length;

  return (
    <WhenLoaded
      loading={loading.isKeysLoading}
      empty={isEmpty && 'You don’t have any keys to remove'}
    >
      {children}
    </WhenLoaded>
  );
};
