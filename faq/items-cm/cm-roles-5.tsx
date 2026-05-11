import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmRoles5: Faq = {
  title: 'What’s the difference between Rewards Claimer and Rewards Splitter?',
  anchor: 'whats-the-difference-between-rewards-claimer-and-rewards-splitter',
  content: (
    <div>
      <p>
        The Rewards Claimer is a separate address that can pull rewards on your
        behalf, useful if you want to automate or delegate reward claiming
        without exposing your Manager or Rewards Address.
      </p>
      <p>
        The Rewards Splitter defines how your Node Operator rewards are
        distributed across multiple recipient addresses. It does not apply to
        bond rebase rewards.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/roles">
          See Roles
        </FaqLink>
      </p>
    </div>
  ),
};
