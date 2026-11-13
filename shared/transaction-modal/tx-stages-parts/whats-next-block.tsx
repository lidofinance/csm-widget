import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

// TxStatus centers its message; the steps read as a left-aligned list
const BlockStyle = styled(MessageBox)`
  && {
    text-align: left;
  }

  ol {
    margin: 0;
    padding-left: 20px;
  }
`;

/** "What is next:" steps box inside a tx stage description; children are `<li>` items. */
export const WhatsNextBlock: FC<PropsWithChildren> = ({ children }) => (
  <BlockStyle icon={false} headline="What is next:">
    <ol>{children}</ol>
  </BlockStyle>
);
