import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Pubkey, PubkeyLinks, StatusComment } from 'shared/components';
import styled from 'styled-components';
import { TopUpQueuePosition } from './top-up-queue-position';

const KeyCellStyled = styled.span`
  display: flex;
  flex-direction: column;
`;

const LinksStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

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
  <KeyCellStyled data-testid="pubkeyCell">
    <Pubkey
      pubkey={item.pubkey}
      symbols={6}
      monospace={false}
      link={
        <LinksStyled>
          <PubkeyLinks {...item} />
        </LinksStyled>
      }
    />
    <CommentLineStyled>
      <span data-testid="statusCommentCell">
        <StatusComment statuses={item.statuses} />
      </span>
      <TopUpQueuePosition position={topUpPosition} total={topUpTotal} />
    </CommentLineStyled>
  </KeyCellStyled>
);
