import React from 'react';
import { Faq } from 'types';

export const Roles6: Faq = {
  title: 'What is a Rewards Splitter?',
  anchor: 'what-is-a-rewards-splitter',
  content: (
    <div>
      <p>
        The Rewards Splitter allows distributing Node Operator rewards across up
        to 10 additional addresses, each receiving a set percentage in stETH.
        Split recipients receive their shares first, and the remaining part is
        sent to the Rewards Address when rewards are claimed. This can be used,
        for example, for infrastructure providers that charge a percentage of
        the rewards, or for opt-in donations.
      </p>
      <p>
        Splits apply to Node Operator rewards only, not to the bond rebase. They
        can only be changed when there are no claimable rewards, and the initial
        configuration can only be changed after the first rewards distribution,
        so make sure to review the recipient addresses carefully.
      </p>
    </div>
  ),
};
