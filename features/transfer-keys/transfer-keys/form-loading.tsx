import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { TransferKeysFormInputType, useTransferKeysFormData } from './context';

export const FormLoading: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<TransferKeysFormInputType>();
  const { loading, keysToMigrate, info } = useTransferKeysFormData();
  const isEmpty = !keysToMigrate;
  const isUsed = info?.usedPriorityQueue;

  return (
    <WhenLoaded
      loading={isLoading || loading.isKeysToMigrateLoading}
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
    </WhenLoaded>
  );
};
