import React from 'react';
import { Faq } from 'types';

export const CmKeys5: Faq = {
  title: 'When does a validator become withdrawn?',
  anchor: 'when-does-a-validator-become-withdrawn',
  content: (
    <div>
      <p>
        A validator is withdrawn after exiting the consensus layer and having
        its balance swept to the withdrawal address. There are three stages:
      </p>
      <ol>
        <li>
          Exit queue: when the exit is initiated, the validator enters the exit
          queue. Wait time depends on how many validators are exiting.
        </li>
        <li>
          Withdrawable state: after leaving the active set, there is a mandatory
          delay of 256 epochs (~27 hours) before the balance can be swept.
        </li>
        <li>
          Sweep: once the withdrawable epoch is reached, the balance is
          transferred to the withdrawal address.
        </li>
      </ol>
      <p>
        Once the withdrawal is reported to the module, any pending penalties are
        applied and the remaining bond is released.
      </p>
    </div>
  ),
};
