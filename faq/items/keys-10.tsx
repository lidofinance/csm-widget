import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys10: Faq = {
  title:
    'What is the difference between removing, exiting, and ejecting a key?',
  anchor: 'what-is-the-difference-between-removing-exiting-and-ejecting-a-key',
  content: (
    <div>
      <p>
        Removing a key is an operation when the validator key is removed from
        the Node Operator on-chain keys storage in CSM. Only non-deposited keys
        can be removed. Due to associated queue maintenance costs{' '}
        <code>keyRemovalCharge</code> is charged from the Node Operator&apos;s
        bond for each removed key.
      </p>
      <p>
        Exiting a key (validator) is an operation when the Node Operator
        publishes a voluntary exit message associated with the corresponding
        active validator to the Beacon chain. Once published, the exit process
        will be started for the validator. Note that only activated validators
        might be exited. Also, a period of <code>256 epochs</code> (approx. 27
        hours) should pass since the validator activation before the voluntary
        exit message can be published.
      </p>
      <p>
        Ejecting the key (validator) is an operation when the validator exit is
        initiated from the validator&apos;s withdrawal credentials on Execution
        layer. Since all validators in CSM have their withdrawal credentials set
        to Lido Withdrawal Vault, the process can only be initiated from this
        smart contract. CSM provides a proxy method for the Node Operators to
        voluntary eject their validators if they decide to do so. In this case,
        the Node Operator is responsible for attaching a corresponding payment
        to cover{' '}
        <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">TW fee</FaqLink>
        . Also, ejection can be invoked from the Lido protocol side in the
        following cases:
      </p>
      <ul>
        <li>
          The validator has excessive number of performance strikes assigned;
        </li>
        <li>
          The validator was requested to exit by VEBO but have not exited in
          time;
        </li>
        <li>Based on the Lido DAO decision;</li>
      </ul>
    </div>
  ),
};
