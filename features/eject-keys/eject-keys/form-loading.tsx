import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { EjectKeysFormInputType, useEjectKeysFormData } from './context';

export const FormLoading: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<EjectKeysFormInputType>();
  const { loading, keys } = useEjectKeysFormData();
  const isEmpty = !keys?.length;

  return (
    <WhenLoaded
      loading={isLoading || loading.isKeysLoading}
      empty={isEmpty && <>No keys available to eject</>}
      emptyNote="Only deposited keys that are eligible for triggerable withdrawals can be ejected. Keys must be deposited and meet withdrawal requirements to appear here."
    >
      {children}
    </WhenLoaded>
  );
};
