import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { useSubmitKeysFormData } from './context';

export const SubmitKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { isPaused } = useSubmitKeysFormData(true);

  if (isPaused) {
    return (
      <MessageBox
        variant="warning"
        headline="CSM is paused"
        data-testid="modulePausedNotice"
      >
        This means that Node Operator creation and keys upload is not possible
      </MessageBox>
    );
  }

  return <>{children}</>;
};
