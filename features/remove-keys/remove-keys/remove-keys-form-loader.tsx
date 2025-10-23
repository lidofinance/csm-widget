import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useRemoveKeysFormData } from './context';

export const RemoveKeysFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const data = useRemoveKeysFormData();
  const isEmpty = !data.keys?.length;

  return (
    <FormLoader
      empty={isEmpty && <>No keys available to remove</>}
      emptyNote="Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL)."
    >
      {children}
    </FormLoader>
  );
};
