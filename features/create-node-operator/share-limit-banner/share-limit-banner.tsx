import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { isCsmFamilyModule } from 'consts';
import { PHASED_DEPOSIT_APPROACH_LINK } from 'consts/external-links';
import { SEED_DEPOSIT_BANNERS, useFeatureFlags } from 'config/feature-flags';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MODULE_METADATA } from 'consts/module';
import {
  SHARE_LIMIT_STATUS,
  useHasPriorityQueueSpots,
  useShareLimit,
  useShareLimitStatus,
  useTopUpQueueInfo,
} from 'modules/web3';
import { FC } from 'react';
import { Banner, MatomoLink } from 'shared/components';
import { useCurrentCurveModule } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';

type NameProps = { name: string };
type KeysLeftProps = NameProps & {
  variant: 'wary' | 'wary-dangerous';
  title: string;
  activeLeft: string;
  queue: string;
};

const ShareLimitFaqLink: FC = () => (
  <LocalLink
    anchor="#what-is-the-csm-stake-share-limit"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner}
  >
    Read more in the FAQ section
  </LocalLink>
);

const PhasedDepositLink: FC = () => (
  <MatomoLink
    $inline
    href={PHASED_DEPOSIT_APPROACH_LINK}
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.phasedDepositApproachLinkBanner}
  >
    the phased deposit approach
  </MatomoLink>
);

const SeedOnlyBanner: FC<NameProps> = ({ name }) => (
  <Banner
    variant="wary"
    title={`${name} is currently allocating seed deposits only`}
  >
    Each key uploaded now will be eligible for a seed deposit of 32 ETH only.
    Top-ups will become available once the module’s stake share limit is
    increased. For more details, see <PhasedDepositLink />.
  </Banner>
);

const SeedQueueFullBanner: FC = () => (
  <Banner variant="wary-dangerous" title="The seed deposit queue is full">
    You can still upload keys, but they are unlikely to receive deposits in the
    near term. The wait could last several months. For more details, see{' '}
    <PhasedDepositLink />.
  </Banner>
);

const ReachedBanner: FC<NameProps> = ({ name }) => (
  <Banner
    variant="wary-dangerous"
    title={`${name} has reached its stake share limit`}
  >
    You can still upload keys, but they are very unlikely to receive deposits in
    the near future (possibly for months).
    <br />
    <ShareLimitFaqLink />
  </Banner>
);

const TopUpsExceedBanner: FC = () => (
  <Banner variant="wary-dangerous" title="Top ups exceed the stake share limit">
    Your keys will still be queued for initial activation, but they are unlikely
    to be filled up to 2048 ETH in the near future
    <br />
    <ShareLimitFaqLink />
  </Banner>
);

const KeysLeftBanner: FC<KeysLeftProps> = ({
  variant,
  title,
  name,
  activeLeft,
  queue,
}) => (
  <Banner variant={variant} title={title}>
    Currently, <b>{activeLeft}</b> more keys can be activated in {name} before
    it hits its stake share limit. Since there are already <b>{queue}</b> keys
    in the queue, this means that newly uploaded keys may not receive deposits
    in the near future. You can still upload keys, but in case {name} reaches
    the limit before your keys get deposited to, the deposit time for your keys
    can be months or longer. Please note that the exact number of validators
    that can be active for {name} is constantly changing due to protocol
    dynamics.
    <br />
    <ShareLimitFaqLink />
  </Banner>
);

export const ShareLimitBanner: FC = () => {
  const targetModule = useCurrentCurveModule();
  const isCSM02 = targetModule === MODULE_NAME.CSM_02;
  const name = MODULE_METADATA[targetModule].variantName;
  const { data } = useShareLimit({ module: targetModule });
  const { data: status } = useShareLimitStatus(targetModule);
  const { data: hasPrioritySpots } = useHasPriorityQueueSpots();
  const { data: topUpQueue } = useTopUpQueueInfo({ module: targetModule });
  const featureFlags = useFeatureFlags();

  if (!data || !status || !isCsmFamilyModule(targetModule)) {
    return null;
  }

  if (status === SHARE_LIMIT_STATUS.REACHED)
    return <ReachedBanner name={name} />;

  if (isCSM02 && featureFlags?.[SEED_DEPOSIT_BANNERS]) {
    if (!topUpQueue) return null;

    // Uploaded keys enter the top-up queue only after their seed deposit, so the contract caps seed deposits by remaining top-up capacity
    const seedQueueFull =
      topUpQueue.enabled && data.queue + topUpQueue.length >= topUpQueue.limit;

    return seedQueueFull ? (
      <SeedQueueFullBanner />
    ) : (
      <SeedOnlyBanner name={name} />
    );
  }

  return (
    <>
      {status === SHARE_LIMIT_STATUS.EXHAUSTED && !hasPrioritySpots ? (
        isCSM02 ? (
          <TopUpsExceedBanner />
        ) : (
          <KeysLeftBanner
            variant="wary-dangerous"
            title={`${name} has exhausted its limit for new keys`}
            name={name}
            activeLeft={data.activeLeft.toString()}
            queue={data.queue.toString()}
          />
        )
      ) : status === SHARE_LIMIT_STATUS.APPROACHING ? (
        <KeysLeftBanner
          variant="wary"
          title={`${name} is approaching its stake share limit`}
          name={name}
          activeLeft={data.activeLeft.toString()}
          queue={data.queue.toString()}
        />
      ) : null}
    </>
  );
};
