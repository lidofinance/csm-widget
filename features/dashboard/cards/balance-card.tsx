import { Skeleton, StatCard, StatCardMeta } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useBondStats } from 'shared/components/bond-stats-card/use-bond-stats';
import { UsdValue } from 'shared/components/bond-stats-card/usd-value';
import { FormatToken } from 'shared/formatters';
import { trackMatomoEvent } from 'utils';
import { getBalanceMetaItems } from '../utils/get-balance-meta-items';
import { toBalanceMetaItems } from './balance-meta';

const onBondLinkClick = () =>
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.dashboardBondLink);

export const BalanceCard: FC = () => {
  const { bond, rewards, splittable, isPending } = useBondStats();

  return (
    <StatCard
      title="Your balance, stETH"
      info="Total bond currently held for the Node Operator"
      link={{
        label: 'Bond & Rewards',
        href: PATH.BOND,
        onClick: onBondLinkClick,
      }}
      value={
        isPending ? (
          <Skeleton variant="text" />
        ) : (
          <FormatToken
            amount={bond?.current}
            token={TOKENS.steth}
            symbol=""
            fallback="—"
            trimTrailingZeros
          />
        )
      }
      secondary={
        !isPending && bond ? (
          <UsdValue amount={bond.current} approx={false} />
        ) : undefined
      }
      footer={
        isPending ? (
          <Skeleton variant="text" />
        ) : bond ? (
          <StatCardMeta
            items={toBalanceMetaItems(
              getBalanceMetaItems({ bond, rewards, splittable }),
            )}
          />
        ) : undefined
      }
      dataTestId={{
        root: 'bondBalanceBlock',
        link: 'sectionHeaderLink',
        value: 'commonBalance',
      }}
    />
  );
};
