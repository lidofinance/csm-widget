import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import s from './whats-next-block.module.css';

/** "What is next:" steps box inside a tx stage description; children are `<li>` items. */
export const WhatsNextBlock: FC<PropsWithChildren> = ({ children }) => (
  <MessageBox icon={false} headline="What is next:" className={s.root}>
    <ol>{children}</ol>
  </MessageBox>
);
