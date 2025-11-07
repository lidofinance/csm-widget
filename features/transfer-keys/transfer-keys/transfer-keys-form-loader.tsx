import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useTransferKeysFormData } from './context';

export const TransferKeysFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const data = useTransferKeysFormData();
  const isEmpty = !data.keysToMigrate;
  const isUsed = data.info?.usedPriorityQueue;

  return (
    <FormLoader
      empty={
        (isEmpty &&
          (isUsed ? (
            <>
              You have transferred all the keys or the transferring limit is
              reached
            </>
          ) : (
            <>You have no keys to transfer</>
          ))) ||
        null
      }
    >
      {children}
    </FormLoader>
  );
};
