import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import { DepositQueueGraph } from './deposit-queue-graph';

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
          <MatomoLink href="https://docs.lido.fi/staking-modules/csm/guides/events">
            the important CSM events
          </MatomoLink>{' '}
          to stay notified about your validator being deposited to.
        </p>
        <p>
          Read more information about{' '}
          <MatomoLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-90b8ff95edc64cf7a051584820219616">
            the deposits flow
          </MatomoLink>
          .
        </p>
      </div>
    </Stack>
  </Accordion>
);
