import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { isCsmFamilyModule } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  SHARE_LIMIT_STATUS,
  useHasPriorityQueueSpots,
  useShareLimit,
  useShareLimitStatus,
} from 'modules/web3';
import { FC } from 'react';
import { Banner } from 'shared/components';
import { useCurrentCurveModule } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';

type Props = { activeLeft: string; queue: string };

const ReachedBanner: FC = () => (
  <Banner
    variant="wary-dangerous"
    title="CSM has reached its stake share limit"
  >
    You can still upload keys, but they are very unlikely to receive deposits in
    the near future (possibly for months).
    <br />
    <LocalLink
      anchor="#what-is-the-csm-stake-share-limit"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
    >
      Read more in the FAQ section
    </LocalLink>
  </Banner>
);

const ExhaustedBanner: FC<Props> = ({ activeLeft, queue }) => (
  <Banner
    variant="wary-dangerous"
    title="CSM has exhausted its limit for new keys"
  >
    Currently, <b>{activeLeft}</b> more keys can be activated in CSM before it
    hits its stake share limit. Since there are already <b>{queue}</b> keys in
    the queue, this means that newly uploaded keys may not receive deposits in
    the near future. You can still upload keys, but in case CSM reaches the
    limit before your keys get deposited to, the deposit time for your keys can
    be months or longer. Please note that the exact number of validators that
    can be active for CSM is constantly changing due to protocol dynamics.
    <br />
    <LocalLink
      anchor="#what-is-the-csm-stake-share-limit"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
    >
      Read more in the FAQ section
    </LocalLink>
  </Banner>
);

const TopUpsExceedBanner: FC = () => (
  <Banner variant="wary-dangerous" title="Top ups exceed the stake share limit">
    Your keys will still be queued for initial activation, but they are unlikely
    to be filled up to 2048 ETH in the near future
    <br />
    <LocalLink
      anchor="#what-is-the-csm-stake-share-limit"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
    >
      Read more in the FAQ section
    </LocalLink>
  </Banner>
);

const ApproachingBanner: FC<Props> = ({ activeLeft, queue }) => (
  <Banner variant="wary" title="CSM is approaching its stake share limit">
    Currently, <b>{activeLeft}</b> more keys can be activated in CSM before it
    hits its stake share limit. Since there are already <b>{queue}</b> keys in
    the queue, this means that newly uploaded keys may not receive deposits in
    the near future. You can still upload keys, but in case CSM reaches the
    limit before your keys get deposited to, the deposit time for your keys can
    be months or longer. Please note that the exact number of validators that
    can be active for CSM is constantly changing due to protocol dynamics.
    <br />
    <LocalLink
      anchor="#what-is-the-csm-stake-share-limit"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
    >
      Read more in the FAQ section
    </LocalLink>
  </Banner>
);

export const ShareLimitBanner: FC = () => {
  const targetModule = useCurrentCurveModule();
  const isCSM02 = targetModule === MODULE_NAME.CSM_02;
  const { data } = useShareLimit(undefined, targetModule);
  const { data: status } = useShareLimitStatus(targetModule);
  const { data: hasPrioritySpots } = useHasPriorityQueueSpots();

  if (!data || !status || !isCsmFamilyModule(targetModule)) {
    return null;
  }

  return (
    <>
      {status === SHARE_LIMIT_STATUS.REACHED ? (
        <ReachedBanner />
      ) : status === SHARE_LIMIT_STATUS.EXHAUSTED && !hasPrioritySpots ? (
        isCSM02 ? (
          <TopUpsExceedBanner />
        ) : (
          <ExhaustedBanner
            activeLeft={data.activeLeft.toString()}
            queue={data.queue.toString()}
          />
        )
      ) : status === SHARE_LIMIT_STATUS.APPROACHING ? (
        <ApproachingBanner
          activeLeft={data.activeLeft.toString()}
          queue={data.queue.toString()}
        />
      ) : null}
    </>
  );
};
