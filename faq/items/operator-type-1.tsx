import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const OperatorType1: Faq = {
  title: 'What is a Node Operator type?',
  anchor: 'what-is-a-node-operator-type',
  content: (
    <div>
      <p>
        Node Operator type is a set of custom parameters values for a Node
        Operator in CSM. Node Operator type is determined based on the Node
        Operator&apos;s bond curve. The full list of parameters for the Node
        Operator is:
      </p>
      <ul>
        <li>
          <code>keyRemovalCharge</code>&nbsp;- a fee charged for each deleted
          deposit data record;
        </li>
        <li>
          <code>elRewardsStealingAdditionalFine</code>&nbsp;- an additional fine
          charged for each validator that has stolen EL rewards;
        </li>
        <li>
          <code>keysLimit</code>&nbsp;- a limit on the number of active keys for
          the Node Operator;
        </li>
        <li>
          <code>queuePriority</code>&nbsp;and&nbsp;<code>maxDeposits</code>
          &nbsp;- parameters defining the priority queue for the Node Operator;
        </li>
        <li>
          <code>rewardShare</code>&nbsp;- a share of the Node Operator rewards
          that the Node Operator receives for each validator. Can be customized
          depending on the key index in the Node Operator&apos;s keys storage;
        </li>
        <li>
          <code>performanceLeeway</code>&nbsp;- a leeway for the Node
          Operator&apos;s validator&apos;sperformance, which is used to define a
          performance threshold. Can be customized depending on the key index in
          the Node Operator&apos;s keys storage;
        </li>
        <li>
          <code>strikesParams</code>&nbsp;- parameters defining the Node
          Operator&apos;s strikes system, which is used to decide on the Node
          Operator&apos;s validator&apos;sejection due to systematic bad
          performance;
        </li>
        <li>
          <code>badPerformancePenalty</code>&nbsp;- a penalty charged for each
          validator that has been ejected due to bad performance;
        </li>
        <li>
          <code>performanceCoefficients</code>&nbsp;- coefficients used to
          calculate the Node Operator&apos;s performance based on the
          validator&apos;seffectiveness in performing duties like attestation,
          proposing blocks, and sync committee participation;
        </li>
        <li>
          <code>allowedExitDelay</code>&nbsp;- an allowed delay between the
          moment Node Operator&apos;s validator was requested to exit and the
          moment it is actually initiated exit process;
        </li>
        <li>
          <code>exitDelayPenalty</code>&nbsp;- a penalty charged for each
          validator that has been requested to exit but has not exited within
          the allowed delay;
        </li>
        <li>
          <code>maxWithdrawalRequestFee</code>&nbsp;- a maximum fee charged for
          each Node Operator&apos;s validator that has been forcefully ejected
          using&nbsp;
          <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">
            EIP-7002
          </FaqLink>
          ;
        </li>
      </ul>
    </div>
  ),
};
