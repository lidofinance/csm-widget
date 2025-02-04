import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { Banner } from 'shared/components';
import { SHARE_LIMIT_STATUS, useCSMShareLimitInfo } from 'shared/hooks';
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
      anchor="#stake-share-limit"
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
      anchor="#stake-share-limit"
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
      anchor="#stake-share-limit"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
    >
      Read more in the FAQ section
    </LocalLink>
  </Banner>
);

export const ShareLimitBanner: FC = () => {
  const { data } = useCSMShareLimitInfo();

  return (
    <>
      {data?.status === SHARE_LIMIT_STATUS.REACHED ? (
        <ReachedBanner />
      ) : data?.status === SHARE_LIMIT_STATUS.EXHAUSTED ? (
        <ExhaustedBanner
          activeLeft={data.activeLeft.toString()}
          queue={data.queue.toString()}
        />
      ) : data?.status === SHARE_LIMIT_STATUS.APPROACHING ? (
        <ApproachingBanner
          activeLeft={data.activeLeft.toString()}
          queue={data.queue.toString()}
        />
      ) : null}
    </>
  );
};
