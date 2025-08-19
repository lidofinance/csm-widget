import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import { DepositQueueGraph } from './deposit-queue-graph';
import {
  SUBSCRIBE_EVENTS_LINK,
  LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW,
} from 'consts/external-links';

export const DepositQueue: FC = () => (
  <Accordion
    summary={
      <Text as="h4" size="xxs" weight={700}>
        View deposit queue
      </Text>
    }
  >
    <Stack direction="column" gap="xxl">
      <DepositQueueGraph />
      <div>
        <p>
          The time to deposit a validator is unpredictable and depends on
          factors such as total stake inflows and outflows, gas considerations,
          module shares, CSM deposit queue size, and the Node Operator&apos;s
          place in the queue.
        </p>
        <p>
          You can subscribe to{' '}
          <MatomoLink href={SUBSCRIBE_EVENTS_LINK}>
            the important CSM events
          </MatomoLink>{' '}
          to stay notified about your validator being deposited to.
        </p>
        <p>
          Read more information about{' '}
          <MatomoLink href={LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW}>
            the deposits flow
          </MatomoLink>
          .
        </p>
      </div>
    </Stack>
  </Accordion>
);
