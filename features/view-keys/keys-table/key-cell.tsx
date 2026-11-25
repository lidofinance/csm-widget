import { Stack } from '@lidofinance/lido-app-ui';
import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Pubkey, PubkeyLinks, StatusComment } from 'shared/components';
import s from './key-cell.module.css';
import { TopUpQueuePosition } from './top-up-queue-position';

type Props = {
  item: KeyWithStatus;
  topUpPosition?: number;
  topUpTotal?: number;
};

export const KeyCell: FC<Props> = ({ item, topUpPosition, topUpTotal }) => (
  <Stack dataTestId={{ root: 'pubkeyCell' }}>
    <Pubkey
      pubkey={item.pubkey}
      symbols={6}
      monospace={false}
      link={
        <Stack as="span" inline direction="row" align="center" gap={4}>
          <PubkeyLinks {...item} />
        </Stack>
      }
    />
    <span className={s.commentLine}>
      <span data-testid="statusCommentCell">
        <StatusComment statuses={item.statuses} />
      </span>
      <TopUpQueuePosition position={topUpPosition} total={topUpTotal} />
    </span>
  </Stack>
);
