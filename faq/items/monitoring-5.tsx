import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Monitoring5: Faq = {
  title: 'What to do in case of a strike assigned?',
  anchor: 'what-to-do-in-case-of-a-strike-assigned',
  content: (
    <div>
      <p>
        Since a strike is an indicator of the validator performing below the
        performance threshold in the given frame, Node Operators should improve
        their validator&apos;s performance to avoid getting additional strikes.
        If the validator gets more than <code>strikesThreshold</code> strikes
        assigned, it will be ejected using{' '}
        <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">
          EIP-7002
        </FaqLink>
        . In case of ejection both <code>badPerformancePenalty</code> and{' '}
        <code>min(actual TW fee paid, maxWithdrawalRequestFee)</code>will be
        confiscated from the Node Operator&apos;s bond upon validator withdrawal
        reporting.{' '}
      </p>
      <p>
        If Node Operators are unable to maintain validator&apos;s performance
        above the performance threshold they should voluntary exit their
        validators immediately to avoid damaging overall protocol&apos;s
        performance and application of the corresponding penalties.
      </p>
    </div>
  ),
};
