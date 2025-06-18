import React from 'react';
import { FaqFrameDuration } from 'shared/components';
import { Faq } from 'types';

export const BondRewards2: Faq = {
  title: 'How often do I get rewards?',
  anchor: 'how-often-do-i-get-rewards',
  content: (
    <div>
      <p>
        <strong>Node Operator rewards</strong> on mainnet are calculated and
        made claimable by the CSM Oracle{' '}
        <strong>
          every <FaqFrameDuration />
        </strong>
        . Rewards do not have to be claimed during every reporting frame, and
        can be left to accumulate to be claimed later.
      </p>
      <p>
        <strong>Bond rebase part</strong> of the rewards come from stETH being a
        rebasing token and the bond being stored in stETH. After each Accounting
        Oracle report that happens on mainnet{' '}
        <strong>every 225 epochs (24hrs)</strong>, the share rate changes.
        Hence, the same amount of stETH shares will now be equal to a bigger
        stETH token balance.
      </p>
    </div>
  ),
};
