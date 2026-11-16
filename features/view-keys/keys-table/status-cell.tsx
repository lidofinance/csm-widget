import { Stack, Tag } from '@lidofinance/lido-app-ui';
import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC, Fragment } from 'react';
import { KeyStatusTag } from 'shared/hook-form/fields/key-status-tag';
import { HUB_STATUS_TITLES } from './hub-status-titles';

type Props = { item: KeyWithStatus; maxPriorityKeyIndex: number };

export const StatusCell: FC<Props> = ({ item, maxPriorityKeyIndex }) => (
  <span data-testid="statusCell">
    <Stack direction="row" wrap gap={4}>
      {item.statuses.map((status) => (
        <Fragment key={status}>
          <KeyStatusTag status={status} titles={HUB_STATUS_TITLES} />
          {status === KEY_STATUS.DEPOSITABLE &&
            item.index <= maxPriorityKeyIndex && <Tag variant="neutral">P</Tag>}
        </Fragment>
      ))}
    </Stack>
  </span>
);
