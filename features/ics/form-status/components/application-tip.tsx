import { MessageBox, TextLink } from '@lidofinance/lido-app-ui';
import { LIDO_RESEARCH_FORUM_NODE_OPERATORS_LINK } from 'consts/external-links';
import { FC } from 'react';

export const ApplicationTip: FC = () => (
  <MessageBox variant="default" icon headline="What you can do">
    If you believe that these address(es) were incorrectly flagged, you may
    submit an appeal on the{' '}
    <TextLink
      external
      size="inherit"
      href={LIDO_RESEARCH_FORUM_NODE_OPERATORS_LINK}
    >
      Lido Research Forum
    </TextLink>{' '}
    for review by the CSM Committee
  </MessageBox>
);
