import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Main3: Faq = {
  title: 'What do node operators receive in CSM?',
  anchor: 'what-do-node-operators-receive-in-csm',
  content: (
    <div>
      <p>Node operators benefit from:</p>
      <ul>
        <li>
          <strong>Daily Bond Rebase</strong>: The collateral for CSM NOs is
          eligible for{' '}
          <FaqLink href="https://help.lido.fi/en/articles/5230610-what-is-steth">
            rewards through stETH&apos;s rebase
          </FaqLink>
          , even before validator activation.{' '}
        </li>
        <li>
          <strong>Socialized Rewards</strong>: Rewards are smoothed across the
          largest validator set, mitigating volatility. This means that even in
          the event of small outages or disruptions, node operators can still
          receive rewards, reducing the risk of rewards loss.
        </li>
      </ul>
    </div>
  ),
};
