import { Skeleton, StatCard, StatCardMeta } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { useKeysBreakdown, useShowFlags } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { getKeysStatusItems } from '../utils/get-keys-status-items';
import { toKeysMetaItems } from './keys-status-meta';

export const ActiveKeysCard: FC<{ className?: string }> = ({ className }) => {
  const nodeOperatorId = useNodeOperatorId();
  const { IS_NODE_OPERATOR } = useShowFlags();
  const { data, isPending, isError } = useKeysBreakdown({ nodeOperatorId });

  const counts = data?.counts;
  const items = counts
    ? toKeysMetaItems(
        getKeysStatusItems(counts, {
          isCsmFamily: true,
          includeDepositable: true,
        }),
      )
    : [];

  return (
    <StatCard
      className={className}
      title="Active keys"
      info="Active keys out of all non-withdrawn keys of the Node Operator"
      link={
        IS_NODE_OPERATOR
          ? {
              label: 'All keys',
              href: PATH.KEYS,
              onClick: () =>
                trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink),
            }
          : undefined
      }
      value={
        isPending ? <Skeleton variant="text" /> : isError ? '—' : counts?.active
      }
      valueSuffix={
        counts
          ? `/${counts.depositable + counts.activationPending + counts.active}`
          : undefined
      }
      description={
        items.length > 0 ? <StatCardMeta items={items} /> : undefined
      }
      dataTestId={{
        root: 'dashboardKeysSection',
        link: 'sectionHeaderLink',
        value: 'keysActiveCount',
        valueSuffix: 'keysLiveCount',
      }}
    />
  );
};
