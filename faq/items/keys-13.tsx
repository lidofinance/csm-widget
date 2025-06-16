import React from 'react';
import { Faq } from 'types';

export const Keys13: Faq = {
  title: 'What is the CSM Stake Share Limit?',
  anchor: 'stake-share-limit',
  content: (
    <div>
      <p>
        The stake share limit is a parameter defined for each Staking Module
        based on its risk profile. It determines the percentage of the total
        stake in the Lido Protocol that can be allocated to the module.
        Currently, the stake share limit for CSM is set at 2%. Once CSM reaches
        its stake share limit, new keys can still be uploaded, but deposits to
        these keys may take a very long time (e.g. months), if they are
        deposited to at all. These factors affect the possibility of new
        deposits to your uploaded keys:
      </p>
      <ul>
        <li>
          The number of keys already in the deposit queue, and the position of
          your keys in this queue
        </li>
        <li>The number of keys that will exit from CSM</li>
        <li>
          Changes in the total volume of stake in the Lido Protocol (both net
          flows as well as whether overall Lido protocol stake increases or not)
        </li>
      </ul>
      <p>
        In other words, if keys had not been deposited to before CSM reached its
        limit, they may still be deposited to later if:
      </p>
      <ul>
        <li>The overall stake volume in the Lido Protocol increases</li>
        <li>Keys exit from CSM, freeing up space for new keys</li>
        <li>The DAO decides to increase CSM&#39;s stake share limit</li>
      </ul>
      <p>
        While keys are awaiting deposit, Node Operators continue to receive
        daily bond rewards based on the bond they submitted. However, they do
        not receive Node Operator rewards, as the keys remain inactive until
        they are fully deposited.
      </p>
    </div>
  ),
};
