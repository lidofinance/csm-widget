import React from 'react';
import { Faq } from 'types';

export const Roles7: Faq = {
  title: 'What is a Rewards Claimer?',
  anchor: 'what-is-a-rewards-claimer',
  content: (
    <div>
      <p>
        The Rewards Claimer is an optional address authorized to claim rewards
        on behalf of the Node Operator. It does not receive any funds, as
        claimed rewards are always sent to the Rewards Address. This is useful
        for automating reward claims without giving access to the Rewards or
        Manager Address.
      </p>
    </div>
  ),
};
