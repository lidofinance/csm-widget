import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmRoles1: Faq = {
  title: 'What are Rewards and Manager Addresses?',
  anchor: 'what-are-rewards-and-manager-addresses',
  content: (
    <div>
      <p>Every sub-operator has two required addresses:</p>
      <ul>
        <li>
          Manager Address: the primary control address. It can add and remove
          keys, top up bond, and propose address changes.
        </li>
        <li>
          Rewards Address: where your staking rewards are sent. It can also
          claim rewards and request the Rewards Address change.
        </li>
      </ul>
      <p>
        Additionally, a Rewards Claimer and Rewards Splitter can be set to
        trigger reward claiming from a different address or send rewards to
        multiple addresses on claim.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/roles">
          See Roles
        </FaqLink>
      </p>
    </div>
  ),
};
