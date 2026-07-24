import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmMain1: Faq = {
  title: 'What do node operators receive in CM?',
  anchor: 'what-do-node-operators-receive-in-cm',
  content: (
    <div>
      <p>Node operators benefit from two reward streams:</p>
      <ul>
        <li>
          <strong>Protocol fee:</strong> a share of staking rewards.
        </li>
        <li>
          <strong>Bond rebase:</strong> daily stETH staking rewards on your
          posted bond, even before your validators go live.
        </li>
      </ul>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/rewards">
          See Rewards
        </FaqLink>
      </p>
    </div>
  ),
};
