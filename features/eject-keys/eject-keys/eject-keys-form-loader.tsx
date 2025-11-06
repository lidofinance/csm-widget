import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useEjectKeysFormData } from './context';

export const EjectKeysFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { keys } = useEjectKeysFormData();
  const isEmpty = !keys?.length;

  return (
    <FormLoader
      empty={isEmpty && <>No keys available to eject</>}
      emptyNote="Only deposited keys that are eligible for triggerable withdrawals can be ejected. Keys must be deposited and meet withdrawal requirements to appear here."
    >
      {children}
    </FormLoader>
  );
};
