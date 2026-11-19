import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import styled from 'styled-components';
import { useKeysBreakdown, useShowFlags } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { getKeysStatusItems } from '../utils/get-keys-status-items';
import { toKeysMetaItems } from './keys-status-meta';
import { StatCard } from './stat-card';
import { StatCardMeta } from './stat-card-meta';

const ValueSuffix = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
  font-size: var(--lido-app-ui-font-size-body);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  letter-spacing: var(--lido-app-ui-letter-spacing-body);
  line-height: var(--lido-app-ui-line-height-body);
`;

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
      loading={isPending}
      value={isError ? '—' : counts?.active}
      subValue={
        counts ? (
          <ValueSuffix data-testid="keysLiveCount">
            /{counts.depositable + counts.activationPending + counts.active}
          </ValueSuffix>
        ) : undefined
      }
      description={
        items.length > 0 ? <StatCardMeta items={items} /> : undefined
      }
      dataTestId={{
        root: 'dashboardKeysSection',
        link: 'sectionHeaderLink',
        value: 'keysActiveCount',
      }}
    />
  );
};
