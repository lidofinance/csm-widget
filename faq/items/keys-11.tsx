import React from 'react';
import { Faq } from 'types';

export const Keys11: Faq = {
  title: 'When does a validator become withdrawn?',
  anchor: 'when-does-a-validator-become-withdrawn',
  content: (
    <div>
      <p>
        On the Ethereum network, a validator can be withdrawn&nbsp;after
        successfully exiting from the consensus layer, but the exact timing of
        withdrawal depends on several factors related to Ethereum protocol
        mechanics:
      </p>
      <ol>
        <li>
          <strong>Exit Queue</strong>: When a validator initiates an exit, it
          enters an&nbsp;<strong>exit queue</strong>. The time required to exit
          depends on the&nbsp;<strong>number of validators exiting</strong>
          &nbsp;and the&nbsp;<strong>churn limit</strong>&nbsp;(the number of
          validators allowed to exit or enter per epoch).
        </li>
        <li>
          <strong>Withdrawal Process</strong>: After exiting the active
          validator set, the validator enters a&nbsp;
          <strong>withdrawable state</strong>. This state is determined by
          the&nbsp;<strong>withdrawable epoch</strong>, which is set to the exit
          epoch + a&nbsp;<strong>minimum delay</strong>&nbsp;of 256 epochs (~27
          hours).
        </li>
        <li>
          <strong>Finalization of Withdrawal</strong>: Once the withdrawable
          epoch is reached, the validator balance will be transferred to the
          validator&apos;s withdrawal credentials (in the case of the Lido
          protocol, the Lido Withdrawal Vault) within the next iteration of the
          Consensus Layer withdrawal sweep cycle. How long this takes depends on
          the validator&apos;s position in the overall sweep cycle, and time
          difference between the withdrawable epoch and when its turn will come
          to be swept. Once the withdrawal has occurred, the fact of the
          withdrawal can be reported to CSM permissionlessly. Once that occurs,
          the part of the Node Operator&apos;s bond used for this validator is
          released. At this point, the Node Operator can claim the bond on the{' '}
          <strong>Bond &amp; Rewards Claim</strong> tab.
        </li>
      </ol>
    </div>
  ),
};
