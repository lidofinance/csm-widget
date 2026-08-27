import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import {
  LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW,
  SUBSCRIBE_EVENTS_LINK,
} from 'consts/external-links';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { useDepositQueueModule } from './hooks/use-deposit-queue-module';

const DescriptionTail: FC = () => (
  <>
    <p>
      You can subscribe to{' '}
      <MatomoLink
        $inline
        href={SUBSCRIBE_EVENTS_LINK}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.subscribeEventsLink}
      >
        the important CSM events
      </MatomoLink>{' '}
      to stay notified about your validator being deposited to
    </p>
    <p>
      Read more information about{' '}
      <MatomoLink
        $inline
        href={LIDO_OPERATOR_PORTAL_DEPOSITS_FLOW}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.operatorPortalDepositsFlowLink}
      >
        the deposits flow
      </MatomoLink>
    </p>
  </>
);

const Csm02DescriptionHead: FC = () => (
  <>
    <p>
      0x02 deposits happen in two stages: a 32 ETH initial deposit activates
      your key, then top-ups fill it toward 2048 ETH in the same order as the
      initial deposit
    </p>
    <p>Initial deposits always take priority over top-ups</p>
    <p>
      The time for deposits in either stage is unpredictable and depends on
      stake inflows and outflows, gas considerations, or module shares
    </p>
  </>
);

const DefaultDescriptionHead: FC = () => (
  <p>
    The time to deposit a validator is unpredictable and depends on factors such
    as total stake inflows and outflows, gas considerations, module shares, CSM
    deposit queue size, and the Node Operator&apos;s place in the queue
  </p>
);

export const Description: FC<{ module?: MODULE_NAME }> = ({ module }) => {
  const resolvedModule = useDepositQueueModule(module);
  const isCsm02 = resolvedModule === MODULE_NAME.CSM_02;

  return (
    <div>
      {isCsm02 ? <Csm02DescriptionHead /> : <DefaultDescriptionHead />}
      <DescriptionTail />
    </div>
  );
};
