import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/components';
import { useModuleMeta } from 'shared/hooks';
import { useAddKeysFlow, useAddKeysFormData } from './context';

const PausedNotice: FC = () => {
  const meta = useModuleMeta();

  return (
    <MessageBox
      variant="warning"
      headline={`${meta?.shortName ?? 'Module'} is paused`}
      dataTestId={{ root: 'pausedNotice' }}
    >
      This means that Node Operator creation and keys upload is not possible
    </MessageBox>
  );
};

export const AddKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useAddKeysFlow();
  const { isPaused } = useAddKeysFormData(true);

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (isPaused) return <PausedNotice />;

  return <>{children}</>;
};
