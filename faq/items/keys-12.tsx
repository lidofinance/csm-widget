import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys12: Faq = {
  title: 'Why a key can get ejected?',
  anchor: 'why-a-key-can-get-ejected',
  content: (
    <div>
      <p>
        Validator ejection can be invoked from the Lido protocol side in the
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
      <p>
        Also, Node Operators can voluntary eject their validators if they decide
        to so. In this case, the Node Operator is responsible for attaching a
        corresponding payment to cover{' '}
        <FaqLink href="https://eips.ethereum.org/EIPS/eip-7002">TW fee</FaqLink>
        .
      </p>
    </div>
  ),
};
