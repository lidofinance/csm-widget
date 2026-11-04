import { FC, PropsWithChildren } from 'react';
import { PausedNotice } from 'shared/form-page';
import { useSubmitKeysFormData } from './context';

export const SubmitKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { isPaused } = useSubmitKeysFormData(true);

  // pre-operator page: no active module to name, so the headline is explicit
  if (isPaused) {
    return (
      <PausedNotice headline="CSM is paused" data-testid="modulePausedNotice" />
    );
  }

  return <>{children}</>;
};
