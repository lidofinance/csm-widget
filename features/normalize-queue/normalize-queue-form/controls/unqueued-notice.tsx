import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useNormalizeQueueFlow } from '../context';
import { getNormalizeQueueView } from '../normalize-queue-state';

export const UnqueuedNotice: FC = () => {
  const { canNormalize, notice } = getNormalizeQueueView(
    useNormalizeQueueFlow().action,
  );

  return (
    <MessageBox icon={canNormalize} dataTestId={{ root: 'unqueuedNotice' }}>
      {notice}
    </MessageBox>
  );
};
