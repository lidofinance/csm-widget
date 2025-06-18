import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Monitoring3: Faq = {
  title: 'What is a strike?',
  anchor: 'what-is-a-strike',
  content: (
    <div>
      <p>
        A strike is an indicator of the validator performing below the
        performance threshold in the given frame. Strikes have a lifetime — a
        time after which the strike is no longer considered valid and gets
        removed form the strikes{' '}
        <FaqLink href="https://en.wikipedia.org/wiki/Merkle_tree">
          Merkle tree
        </FaqLink>{' '}
        delivered by the Performance Oracle.
      </p>
    </div>
  ),
};
