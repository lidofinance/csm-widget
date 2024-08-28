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
      empty={isEmpty && <>No keys available to remove</>}
      emptyNote="Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL)."
    >
      {children}
    </WhenLoaded>
  );
};
