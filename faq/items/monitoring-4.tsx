import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Monitoring4: Faq = {
  title: 'How are the strikes assigned?',
  anchor: 'how-are-the-strikes-assigned',
  content: (
    <div>
      <p>
        Strikes are assigned on per-validator basis. If the validator&apos;s
        performance within a Performance Oracle frame is below the threshold, a
        strike will be assigned and reported on-chain by the Performance Oracle
        using{' '}
        <FaqLink href="https://en.wikipedia.org/wiki/Merkle_tree">
          Merkle tree
        </FaqLink>
        .
      </p>
    </div>
  ),
};
