import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { useModuleMeta } from 'shared/hooks/use-module-meta';

export type PausedNoticeProps = {
  headline?: ReactNode;
  children?: ReactNode;
  'data-testid'?: string;
};

export const PausedNotice: FC<PausedNoticeProps> = ({
  headline,
  children = 'This means that Node Operator creation and keys upload is not possible',
  'data-testid': testId = 'pausedNotice',
}) => {
  const meta = useModuleMeta();

  return (
    <MessageBox
      variant="warning"
      headline={headline ?? `${meta?.shortName ?? 'Module'} is paused`}
      dataTestId={{ root: testId }}
    >
      {children}
    </MessageBox>
  );
};
