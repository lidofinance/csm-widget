import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Accordion, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { StretchCard } from 'shared/components';
import { Description } from './description';
import { DepositQueueGraph } from './deposit-queue-graph';

type Props = { module?: MODULE_NAME; notice?: ReactNode };

export const DepositQueue: FC<Props> = ({ module, notice }) => {
  const hasNotice = !!notice;
  const [expanded, setExpanded] = useState(false);
  const autoOpened = useRef(false);

  useEffect(() => {
    if (hasNotice && !autoOpened.current) {
      autoOpened.current = true;
      setExpanded(true);
    }
  }, [hasNotice]);

  return (
    <StretchCard dataTestId={{ root: 'depositQueue' }}>
      <Accordion
        title="View deposit queue"
        border={false}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <Stack direction="column" gap={24}>
          {notice}
          <DepositQueueGraph module={module} />
          <Description module={module} />
        </Stack>
      </Accordion>
    </StretchCard>
  );
};
