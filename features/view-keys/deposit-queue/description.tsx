import { Stack, Typography } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import {
  LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW,
  SUBSCRIBE_EVENTS_LINK,
} from 'consts/external-links';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink } from 'shared/components';
import { useDepositQueueModule } from './hooks/use-deposit-queue-module';

const SubscribeLink: FC<PropsWithChildren> = ({ children }) => (
  <MatomoLink
    $inline
    href={SUBSCRIBE_EVENTS_LINK}
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.subscribeEventsLink}
  >
    {children}
  </MatomoLink>
);

const DepositsFlowLink: FC<PropsWithChildren> = ({ children }) => (
  <MatomoLink
    $inline
    href={LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW}
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.operatorPortalDepositsFlowLink}
  >
    {children}
  </MatomoLink>
);

const Paragraph: FC<PropsWithChildren> = ({ children }) => (
  <Typography variant="body" color="secondary">
    {children}
  </Typography>
);

const Csm02Description: FC = () => (
  <Stack direction="column" gap={12}>
    <Paragraph>
      Queued stake shows how much stake is already waiting to be deposited
      before the next keys can receive their initial 32 ETH deposit
    </Paragraph>
    <Paragraph>
      Once active, validators move to the top-up queue, where they may continue
      receiving deposits toward 2,048 ETH
    </Paragraph>
    <Paragraph>
      Deposit timing in either stage is not guaranteed and depends on stake
      inflows and outflows, gas conditions, and module limits
    </Paragraph>
    <Paragraph>
      Subscribe to <SubscribeLink>important CSM events</SubscribeLink> to stay
      notified about related deposits
    </Paragraph>
    <Paragraph>
      Read more about <DepositsFlowLink>the deposits flow</DepositsFlowLink>
    </Paragraph>
  </Stack>
);

const DefaultDescription: FC = () => (
  <Stack direction="column" gap={12}>
    <Paragraph>
      The time to deposit a validator is unpredictable and depends on factors
      such as total stake inflows and outflows, gas considerations, module
      shares, CSM deposit queue size, and the Node Operator&apos;s place in the
      queue
    </Paragraph>
    <Paragraph>
      You can subscribe to{' '}
      <SubscribeLink>the important CSM events</SubscribeLink> to stay notified
      about your validator being deposited to
    </Paragraph>
    <Paragraph>
      Read more information about{' '}
      <DepositsFlowLink>the deposits flow</DepositsFlowLink>
    </Paragraph>
  </Stack>
);

export const Description: FC<{ module?: MODULE_NAME }> = ({ module }) => {
  const resolvedModule = useDepositQueueModule(module);
  const isCsm02 = resolvedModule === MODULE_NAME.CSM_02;

  return isCsm02 ? <Csm02Description /> : <DefaultDescription />;
};
