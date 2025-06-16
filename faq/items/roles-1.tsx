import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Roles1: Faq = {
  title: 'What are rewards and Manager Addresses?',
  anchor: 'what-are-rewards-and-manager-addresses',
  content: (
    <div>
      <p>
        There are two addresses associated with your Node Operator that have
        different scope of responsibilities for managing your Node Operator.
      </p>
      <p>The Rewards Address is used for:</p>
      <ul>
        <li>Claiming bond and rewards</li>
        <li>Adding extra bond amount</li>
        <li>Proposing a new Rewards Address</li>
        <li>Resetting the Manager Address to the current Rewards Address</li>
      </ul>
      <p>The Manager Address is used for:</p>
      <ul>
        <li>Adding new keys</li>
        <li>Removing existing keys</li>
        <li>Adding extra bond amount</li>
        <li>Claiming bond and rewards to the Rewards Address</li>
        <li>Covering locked bond</li>
        <li>Proposing a new Manager Address</li>
      </ul>
      <p>
        Read more about addresses management{' '}
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-d3ad2b2bd3994a06b19dccc0794ac8d6">
          here
        </FaqLink>
        .
      </p>
    </div>
  ),
};
