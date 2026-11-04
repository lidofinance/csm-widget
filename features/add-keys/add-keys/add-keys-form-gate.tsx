import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice, PausedNotice } from 'shared/form-page';
import { useAddKeysFlow, useAddKeysFormData } from './context';

export const AddKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useAddKeysFlow();
  const { isPaused } = useAddKeysFormData(true);

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (isPaused) return <PausedNotice />;

  return <>{children}</>;
};
