import React from 'react';
import { Faq } from 'types';

export const Roles5: Faq = {
  title: 'What happens to rewards after changing the Rewards Address?',
  anchor: 'what-happens-to-rewards-after-changing-the-rewards-address',
  content: (
    <div>
      <p>
        Rewards claimed to the previous Rewards Address remain there. After
        changing the Rewards Address, all rewards and excess bond accumulated on
        the bond balance can be claimed to the new Rewards Address. In the event
        of validator withdrawal, upon claiming of the bond, it would also be
        returned to the new Rewards Address.
      </p>
    </div>
  ),
};
