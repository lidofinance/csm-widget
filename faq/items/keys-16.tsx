import React from 'react';
import { Faq } from 'types';

export const Keys16: Faq = {
  title: 'How do seed deposits and top-ups work in 0x02 CSM?',
  anchor: 'how-do-seed-deposits-and-top-ups-work-in-0x02-csm',
  content: (
    <div>
      <p>0x02 CSM validators receive stake in two steps:</p>
      <ul>
        <li>
          <strong>Seed deposit</strong>: Uploaded keys wait in the deposit queue
          for their initial 32 ETH deposit, the same way as in 0x01 CSM. This
          allows the validator to start the activation process without waiting
          for the full 2,048 ETH.
        </li>
        <li>
          <strong>Top-ups</strong>: Once seeded, the validator enters the top-up
          queue, where it receives additional stake until it reaches 2,048 ETH.
          The top-up queue follows the order of the seed deposits, and only a
          limited number of validators can be in it at the same time. While the
          top-up queue is full, new seed deposits wait until a validator is
          fully topped up and frees a seat.
        </li>
      </ul>
      <p>
        The time to fully top up a validator depends on factors such as total
        stake inflows and outflows, module shares, and the validator&apos;s
        position in the top-up queue. Hence, an active 0x02 CSM validator may
        not always have a balance of 2,048 ETH. Top-ups do not require
        additional bond.
      </p>
    </div>
  ),
};
