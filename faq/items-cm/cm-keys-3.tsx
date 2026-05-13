import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmKeys3: Faq = {
  title:
    'What is the difference between removing, exiting, and ejecting a key?',
  anchor: 'what-is-the-difference-between-removing-exiting-and-ejecting-a-key',
  content: (
    <div>
      <p>Removing a key deletes it before it has been deposited.</p>
      <p>
        Exiting a validator is a voluntary action performed through your
        consensus client. It starts the exit process on the Beacon chain.
      </p>
      <p>
        Ejecting a validator triggers the exit through EIP-7002 (Triggerable
        Withdrawals). This is done by the protocol when required or can be
        triggered by a Node Operator in case of emergency.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/bond-and-key-management#exiting-keys">
          See Bond and Key Management
        </FaqLink>
      </p>
    </div>
  ),
};
