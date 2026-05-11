import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmBondRewards1: Faq = {
  title: 'What rewards do I get in CM?',
  anchor: 'what-rewards-do-i-get-in-cm',
  content: (
    <div>
      <p>Running validators through CMv2 gives you two types of rewards:</p>
      <ul>
        <li>
          <strong>Protocol fee:</strong> a share of staking rewards based on
          your validator count as a portion of total Lido validators.
        </li>
        <li>
          <strong>Bond rebase:</strong> staking rewards from your posted stETH
          bond, accruing daily even before your validators go live.
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
