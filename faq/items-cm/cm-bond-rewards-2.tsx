import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmBondRewards2: Faq = {
  title: 'How often do I get rewards?',
  anchor: 'how-often-do-i-get-rewards',
  content: (
    <div>
      <p>
        Bond rebases accrue daily. Operator fees are calculated per reporting
        frame of 14 days.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/rewards">
          See Rewards
        </FaqLink>
      </p>
    </div>
  ),
};
