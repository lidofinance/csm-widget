import { Stack } from '@lidofinance/lido-app-ui';
import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Pubkey, PubkeyLinks, StatusComment } from 'shared/components';
import styled from 'styled-components';
import { TopUpQueuePosition } from './top-up-queue-position';

const CommentLineStyled = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: var(--lido-app-ui-color-text-secondary);

  &:has(
    [data-testid='statusCommentCell'] > :not(:empty),
    [data-testid='topUpQueuePosition']
  ) {
    margin-top: 4px;
  }
`;

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
    <CommentLineStyled>
      <span data-testid="statusCommentCell">
        <StatusComment statuses={item.statuses} />
      </span>
      <TopUpQueuePosition position={topUpPosition} total={topUpTotal} />
    </CommentLineStyled>
  </Stack>
);
