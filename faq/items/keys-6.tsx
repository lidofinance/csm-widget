import React from 'react';
import { Faq } from 'types';

export const Keys6: Faq = {
  title: 'When does a validator become active?',
  anchor: 'when-does-a-validator-become-active',
  content: (
    <div>
      <p>
        After key submission, and if keys have been successfully validated, two
        actions are required for a validator to be activated:
      </p>
      <ol>
        <li>
          <strong>Deposit by Lido Protocol</strong>: The time to deposit a
          validator is unpredictable and depends on factors such as total stake
          inflows and outflows, gas considerations, module shares, CSM deposit
          queue size, and the Node Operator&apos;s place in the queue.
        </li>
        <li>
          <strong>Activation on Ethereum Network</strong>: Once deposited, the
          validator enters the Beacon Chain activation queue. The time to
          activation depends on the total number of validators in the queue
          awaiting activation and the rate of queue processing, which varies
          based on the total number of active Ethereum validators.
        </li>
      </ol>
    </div>
  ),
};
